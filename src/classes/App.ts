import {
  Characteristic,
  on,
  Peripheral,
  startScanningAsync,
} from "@abandonware/noble";
import debug from "debug";
import { commands } from "../commands";
import { decode } from "../decoder";
import { EcamManager } from "./EcamManager";
import { Utils } from "./Utils";
const d = debug("App");

export class App {
  static SERVICE = "00035b03-58e6-07dd-021a-08123a000300";
  static CHARACTERISTIC = "00035b03-58e6-07dd-021a-08123a000301";
  static DESCRIPTOR = "00002902-0000-1000-8000-00805f9b34fb";
  private healthCheckTimer: any;

  private machine: {
    device?: Peripheral;
    characteristic?: Characteristic;
  } = {};

  private readBuffer = new Int8Array();
  private writeBuffer: Buffer = Buffer.from([]);

  constructor() {
    this.setupConnect();
  }

  sendCommand(
    id: string,
    data: string[] | Int8Array,
    callback?: Function | null,
    timer = 1000,
    sendCommandRetries = 5
  ): Promise<boolean> {
    d("packets to send: id=", id);
    d("                hex=", Utils.format(data, "hex"));
    d("                dec=", Utils.format(data, "dec"));

    return new Promise(async (resolve, reject) => {
      if (!this.machine?.characteristic) {
        d(
          `Warning: Trying to send packets but connection is not ready. Retrying... (${sendCommandRetries--})`
        );

        if (sendCommandRetries <= 0) {
          d("Abort");
          await this.disconnect();
          return;
        }

        setTimeout(
          async () =>
            await this.sendCommand(
              id,
              data,
              callback,
              timer,
              sendCommandRetries
            ),
          1000
        );
      }

      let packetIndex = 0;

      // send the command in multiple chunks (if needed)
      let t = setInterval(async (_) => {
        try {
          let packet: Buffer;
          if (data instanceof Int8Array) {
            packet = Utils.byteToBuffer(data);
            packetIndex = data.length;
          } else {
            packet = Utils.hexToBuffer(data[packetIndex++] as any);
          }

          if (callback) {
            await callback(packet);
          } else {
            await this.machine?.characteristic?.writeAsync(packet, true);
          }

          this.writeBuffer = packet;
        } catch (err) {
          reject(err);
        }

        if (packetIndex >= data.length) {
          clearInterval(t);
          resolve(true);
        } else {
          resolve(false);
        }
      }, timer);
    });
  }

  private async onStateChange(state: string) {
    d("BLE: state=", state);

    if (state === "poweredOn") {
      await startScanningAsync([App.SERVICE], false);
    } else if (state === "disconnected") {
      await this.disconnect();
    }
  }

  private async onDiscover(peripheral: Peripheral) {
    this.machine.device = peripheral;

    peripheral.on("connect", this.onPeripheralConnect.bind(this));
    peripheral.on("disconnect", this.onPeripheralDisconnect.bind(this));

    // await stopScanningAsync();
    await peripheral.connectAsync();
    EcamManager.onMachineFound(peripheral, new Int8Array());

    const {
      characteristics,
    } = await peripheral.discoverSomeServicesAndCharacteristicsAsync(
      [App.SERVICE],
      [App.CHARACTERISTIC]
    );
    const characteristic = characteristics[0];
    this.machine.characteristic = characteristic;

    const { uuid, type, properties } = characteristic;
    d("characteristic found");
    d(" - UUID      ", uuid);
    d(" - Properties", properties);

    characteristic.on("data", this.onCharacteristicData.bind(this));
    characteristic.on("notify", this.onCharacteristicNotify.bind(this));
    characteristic.on("read", this.onCharacteristicRead.bind(this));
    characteristic.on("write", this.onCharacteristicWrite.bind(this));
    characteristic.notify(true); // enable indication
  }

  private onPeripheralConnect() {
    d("BLE: device found");
  }

  private onPeripheralDisconnect() {
    d("BLE: disconnected");
  }

  private onScanStart() {
    d("BLE: scanning...");
  }

  private onScanStop() {
    d("BLE: scanning... done!");
  }

  private setupConnect() {
    d("BLE: activating...");

    on("stateChange", this.onStateChange.bind(this));
    on("discover", this.onDiscover.bind(this));
    on("scanStart", this.onScanStart.bind(this));
    on("scanStop", this.onScanStop.bind(this));

    process.on("SIGINT", this.disconnect.bind(this));
    process.on("uncaughtException", this.disconnect.bind(this));
    process.on("SIGUSR1", this.disconnect.bind(this));
    process.on("SIGUSR2", this.disconnect.bind(this));
  }

  // callbacks

  onCharacteristicNotify(..._args: any[]) {}
  onCharacteristicRead(data: Buffer, _isNotify: boolean) {
    d("chunk received: hex=", Utils.format(data, "hex"));
    d("                dec=", Utils.format(data, "dec"));
  }
  onCharacteristicWrite() {
    d("packet sent:    hex=", Utils.format(this.writeBuffer, "hex"));
    d("                dec=", Utils.format(this.writeBuffer, "dec"));
  }

  async onCharacteristicData(value: Int8Array, _isNotification: boolean) {
    // read from peripheral

    const buffer2 = new Int8Array(this.readBuffer.length + value.length);
    buffer2.set(this.readBuffer);
    buffer2.set(value, this.readBuffer.length);

    this.readBuffer = Int8Array.from(buffer2);

    if (this.isResponseComplete(this.readBuffer)) {
      // d("data", "completed", buffer.length, runChecksum(buffer));
      d("response ready: hex=", Utils.format(this.readBuffer, "hex"));
      d("                dec=", Utils.format(this.readBuffer, "dec"));

      decode(this, this.readBuffer);

      // reset buffer
      this.readBuffer = new Int8Array();
    }
  }
  private isResponseComplete(bytes: Int8Array) {
    return bytes.length >= 2 && Utils.byteToInt(bytes[1]) == bytes.length - 1;
  }

  async disconnect() {
    try {
      d("disconnecting...");
      clearInterval(this.healthCheckTimer);
      await this.machine.characteristic?.removeAllListeners();
      await this.machine.characteristic?.notify(false);
      await this.machine.characteristic?.unsubscribe();
      await this.machine.device?.disconnectAsync();
    } catch (error) {}
    process.exit(0);
  }

  // commands

  async machineStatus() {
    await this.sendCommand("machine_status", commands.machine_status);
  }

  async heathCheck(): Promise<App> {
    this.healthCheckTimer = setInterval(async () => {
      await this.sendCommand("health_check", commands.health_check, null, 500);
    }, 5000);

    return this;
  }

  async sync(): Promise<App> {
    d("command: sync");

    await this.sendCommand("get_parameters", commands.get_parameters);
    await this.sendCommand("machine_status", commands.machine_status);
    await this.sendCommand("get_profiles", commands.get_profiles);
    return this;
  }
}
