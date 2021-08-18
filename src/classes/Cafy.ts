import {
  Characteristic,
  on,
  Peripheral,
  startScanningAsync,
} from "@abandonware/noble";
import { BehaviorSubject } from "rxjs";
import debug from "debug";
import { commands } from "../commands";
import { decode } from "../decoder";
import { EcamManager } from "./EcamManager";
import { Utils } from "./Utils";
const d = debug("Cafy");

export interface DeviceInfo {
  name: string;
  address: string;
}

export interface DeviceStatus {
  status: "CONNECTED" | "DISCONNECTED";
}

export interface DeviceOptions {
  address?: string;
  name?: string;
}

export class Cafy {
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

  /**
   * @internal
   */
  private _deviceSatus: BehaviorSubject<DeviceStatus>;
  private _option: DeviceOptions | undefined;

  constructor(option?: DeviceOptions) {
    this._deviceSatus = new BehaviorSubject({
      status: "DISCONNECTED",
    } as DeviceStatus);

    this._option = option;
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
      // if we are trying to send commands before we finish connecting to the machine,
      // let's defer the command for "sendCommandRetries" seconds.
      if (!this.machine?.characteristic) {
        d(
          `Warning: Trying to send packets but connection is not ready. Retrying... (${sendCommandRetries--})`
        );

        if (sendCommandRetries <= 0) {
          d("Abort");
          await this.disconnect();
          process.exit(0);
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
          clearInterval(t);
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
      await startScanningAsync([Cafy.SERVICE], false);
    } else if (state === "disconnected" || state === "poweredOff") {
      await this.disconnect();
    }
  }

  private onDiscover(resolve: Function, reject: Function) {
    return async (peripheral: Peripheral) => {
      const address = peripheral.address.replace(/\-/g, "").toLowerCase();
      if (
        this._option?.address &&
        address !== this._option?.address.toLowerCase()
      ) {
        return;
      }
      if (
        this._option?.name &&
        peripheral?.advertisement.localName !== this._option?.name
      ) {
        return;
      }
      this.machine.device = peripheral;

      peripheral.on(
        "connect",
        this.onPeripheralConnect(resolve, reject).bind(this)
      );
      peripheral.on("disconnect", this.onPeripheralDisconnect.bind(this));

      // await stopScanningAsync();
      await peripheral.connectAsync();
      EcamManager.onMachineFound(peripheral, new Int8Array());

      const {
        characteristics,
      } = await peripheral.discoverSomeServicesAndCharacteristicsAsync(
        [Cafy.SERVICE],
        [Cafy.CHARACTERISTIC]
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
    };
  }

  private onPeripheralConnect(resolve: Function, _reject: Function) {
    return () => {
      d("BLE: device found");
      resolve({
        name: this.machine.device?.advertisement.localName as string,
        address: this.machine.device?.address as string,
      });
    };
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

  status$() {
    if (this.machine.device) {
      this._deviceSatus.next({ status: "CONNECTED" });
    } else {
      this._deviceSatus.next({ status: "DISCONNECTED" });
    }
    return this._deviceSatus;
  }

  connect() {
    d("BLE: activating...");

    process.on("SIGINT", this.registerProcessExit.bind(this));
    process.on("uncaughtException", this.registerProcessExit.bind(this));
    process.on("SIGUSR1", this.registerProcessExit.bind(this));
    process.on("SIGUSR2", this.registerProcessExit.bind(this));

    return new Promise((resolve, reject) => {
      this.machine.characteristic?.removeAllListeners();

      on("stateChange", this.onStateChange.bind(this));
      on("discover", this.onDiscover(resolve, reject).bind(this));
      on("scanStart", this.onScanStart.bind(this));
      on("scanStop", this.onScanStop.bind(this));

      this._deviceSatus.next({ status: "CONNECTED" });
    });
  }

  private registerProcessExit() {
    this.disconnect();
    process.exit(0);
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
      d("packet ready:   hex=", Utils.format(this.readBuffer, "hex"));
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
      d("BLE: disconnecting...");
      clearInterval(this.healthCheckTimer);
      await this.machine.characteristic?.removeAllListeners();
      await this.machine.characteristic?.notify(false);
      await this.machine.characteristic?.unsubscribe();
      await this.machine.device?.disconnectAsync();

      this._deviceSatus.next({ status: "DISCONNECTED" });
      d("BLE: disconnected");

      return Promise.resolve({ status: "DISCONNECTED" });
    } catch (error) {
      d("BLE: error", { error });
      return Promise.reject({ error });
    }
  }

  // commands

  async machineStatus() {
    return await this.sendCommand("machine_status", commands.machine_status);
  }

  async heathCheck(): Promise<Cafy> {
    this.healthCheckTimer = setInterval(async () => {
      if (this.machine?.characteristic) {
        await this.sendCommand(
          "health_check",
          commands.health_check,
          null,
          500
        );
      }
    }, 5000);

    return this;
  }

  async sync(): Promise<Cafy> {
    d("command: sync");

    await this.sendCommand("get_parameters", commands.get_parameters);
    await this.sendCommand("machine_status", commands.machine_status);
    await this.sendCommand("get_profiles", commands.get_profiles);
    return this;
  }

  async turnOn(): Promise<Cafy> {
    d("command: turn on");
    await this.sendCommand("turn_on", commands.turn_on);
    return this;
  }
}
