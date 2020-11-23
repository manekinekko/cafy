import debug from "debug";
const d = debug("App");

import {
  Characteristic,
  on,
  Peripheral,
  startScanningAsync,
  stopScanningAsync,
} from "@abandonware/noble";
import { commands } from "../commands";
import { decode } from "../decoder";
import { EcamManager } from "./EcamManager";
import { Utils } from "./Utils";

export class App {
  static SERVICE = "00035b03-58e6-07dd-021a-08123a000300";
  static CHARACTERISTIC = "00035b03-58e6-07dd-021a-08123a000301";
  static DESCRIPTOR = "00002902-0000-1000-8000-00805f9b34fb";
  healthCheckTimer: any;

  machine: {
    device?: Peripheral;
    characteristic?: Characteristic;
  } = {};

  buffer = new Int8Array();

  sendCommand(
    data: string[] | Int8Array,
    callback?: Function | null,
    timer = 1000
  ) {
    d("packets:         hex=", Utils.format(data, "hex"));
    d("                 dec=", Utils.format(data, "dec"));

    return new Promise((res, rej) => {
      let packetIndex = 0;

      // send the command in multiple chunks (if needed)
      let t = setInterval(async (_) => {
        try {
          let packet;
          if (data instanceof Int8Array) {
            packet = Utils.byteToBuffer(data);
            packetIndex = data.length;
          } else {
            packet = Utils.hexToBuffer(data[packetIndex++] as any);
          }

          if (callback) {
            callback(packet);
          } else {
            await this.machine?.characteristic?.writeAsync(packet, true);
          }

          d("packet sent:     hex=", Utils.format(packet, "hex"));
          d("                 dec=", Utils.format(packet, "dec"));
        } catch (err) {
          rej(err);
        }

        if (packetIndex >= data.length) {
          clearInterval(t);
          res(true);
        }
      }, timer);
    });
  }

  async initialize() {
    try {
      on("stateChange", async (state: string) => {
        if (state === "poweredOn") {
          await startScanningAsync([App.SERVICE], false);
        }
      });

      on("discover", async (peripheral: Peripheral) => {
        this.machine.device = peripheral;

        await stopScanningAsync();
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
        d("characteristic found", { uuid: characteristic.uuid });

        characteristic.notify(true); // enable indication

        // set callbacks
        characteristic.on("data", this.onCharacteristicChanged.bind(this));
      });

      on("connect", () => d("connected"));
      on("scanStart", () => d("scanning..."));
      on("scanStop", () => d("scanning... done!"));
      on("warning", (message: string) => d("WARNING", message));
    } catch (error) {
      await this.stopProcess();
    }
  }

  // callbacks

  async onCharacteristicChanged(value: Int8Array, isNotification: boolean) {
    // read from peripheral

    const buffer2 = new Int8Array(this.buffer.length + value.length);
    buffer2.set(this.buffer);
    buffer2.set(value, this.buffer.length);

    this.buffer = Int8Array.from(buffer2);

    if (this.isResponseComplete(this.buffer)) {
      // d("data", "completed", buffer.length, runChecksum(buffer));
      d("packet received: hex=", Utils.format(this.buffer, "hex"));
      d("                 dec=", Utils.format(this.buffer, "dec"));

      decode(this, this.buffer);

      // reset buffer
      this.buffer = new Int8Array();
    }
  }

  isResponseComplete(bytes: Int8Array) {
    return bytes.length >= 2 && Utils.byteToInt(bytes[1]) == bytes.length - 1;
  }

  async stopProcess() {
    try {
      d("disconnecting...");
      clearInterval(this.healthCheckTimer);
      await this.machine.characteristic?.removeAllListeners();
      await this.machine.characteristic?.notify(false);
      await this.machine.characteristic?.unsubscribe();
      await this.machine.device?.disconnectAsync();
      d("disconnected");
    } catch (error) {}
    process.exit(0);
  }

  // commands

  async machineStatus() {
    d("command: machine_status");

    await this.sendCommand(commands.machine_status);
  }

  async heathCheck() {
    this.healthCheckTimer = setInterval(async () => {
      d("command: health_check");

      await this.sendCommand(commands.health_check, null, 500);
    }, 5000);
  }
}
