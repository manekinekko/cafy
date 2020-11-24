import debug from "debug";
import { BeverageId } from "./BeverageId";
import { MachineAlarm } from "./MachineAlarm";
import { MachineKey } from "./MachineKey";
import { MachineLoad } from "./MachineLoad";
import { MachineSwitch } from "./MachineSwitch";
import { Utils } from "./Utils";
const d = debug("MonitorData2");

export class MonitorData2 {
  static ACCESSORIES_DATA_2 = 4;
  static AKEY0 = 4;
  static AKEY1 = 5;
  static AKEY2 = 6;
  static AKEY3 = 7;
  static AKEY4 = 8;
  static AKEY5 = 5;
  static AKEY6 = 6;
  static BEVERAGE_TYPE_DATA_1 = 13;
  static BEVERAGE_TYPE_DATA_2 = 23;
  static COFFEE_INFUSER_POS_LSB_DATA_0 = 12;
  static COFFEE_INFUSER_POS_LSB_DATA_2 = 16;
  static COFFEE_INFUSER_POS_MSB_DATA_0 = 11;
  static COFFEE_INFUSER_POS_MSB_DATA_2 = 15;
  static COFFEE_POWDER_QTY_LSB = 18;
  static COFFEE_POWDER_QTY_MSB = 17;
  static COFFEE_WASTE_COUNTER_DATA_1 = 14;
  static COFFEE_WASTE_COUNTER_DATA_2 = 24;
  static CURRENT_WATER_FLOW_LSB_DATA_0 = 14;
  static CURRENT_WATER_FLOW_LSB_DATA_2 = 18;
  static CURRENT_WATER_FLOW_MSB_DATA_0 = 13;
  static CURRENT_WATER_FLOW_MSB_DATA_2 = 17;
  static DATA_0 = 0;
  static DATA_1 = 1;
  static DATA_2 = 2;
  static DIAG0_DATA_1 = 4;
  static DIAG0_DATA_2 = 7;
  static DIAG1_DATA_1 = 5;
  static DIAG1_DATA_2 = 8;
  static DIAG2_DATA_1 = 5;
  static DIAG2_DATA_2 = 12;
  static DIAG3_DATA_1 = 5;
  static DIAG3_DATA_2 = 13;
  static FUNCTION_EXECUTION_PROGRESS_DATA_1 = 9;
  static FUNCTION_EXECUTION_PROGRESS_DATA_2 = 10;
  static FUNCTION_ONGOING_DATA_1 = 8;
  static FUNCTION_ONGOING_DATA_2 = 9;
  static HEATER_TEMP_DATA_1 = 11;
  static HEATER_TEMP_DATA_2 = 21;
  static LOADS0_DATA_1 = 6;
  static LOADS0_DATA_2 = 13;
  static LOADS1_DATA_1 = 7;
  static LOADS1_DATA_2 = 14;
  static MACHINE_MODEL_ID = 10;
  static MAIN_BOARD_SW_RELEASE = 15;
  static REQUESTED_WATER_QTY_LSB = 16;
  static REQUESTED_WATER_QTY_MSB = 15;
  static STEAMER_TEMP_DATA_1 = 12;
  static STEAMER_TEMP_DATA_2 = 22;
  timestamp: any;
  constructor(public dataN: number, public value: Int8Array) {}

  getType() {
    return this.dataN;
  }

  getTimestamp() {
    return this.timestamp;
  }

  setTimestamp(j: number) {
    this.timestamp = j;
  }

  getValue() {
    return this.value;
  }

  getPressedKeys() {
    if (this.dataN == 1) {
      return null;
    }
    const arrayList = new Array<number>();
    const bytes = this.value;
    let j =
      bytes[4] +
      (bytes[5] << 8) +
      (bytes[6] << 16) +
      (bytes[7] << 24) +
      (bytes[8] << 32);
    let j2 = 549755813888;
    let i = 0;
    while (i < 40) {
      if ((j2 & j) != 0) {
        arrayList.push(i);
      }
      i++;
      j2 >>= 1;
    }
    return arrayList;
  }

  isKeyPressed(machineKey: MachineKey) {
    if (
      this.dataN == 1 ||
      ((this.value[machineKey.getAkey() + 4] >> machineKey.getBitIndex()) &
        1) ==
        0
    ) {
      return false;
    }
    return true;
  }

  getOnSwitches() {
    let i = 1;
    if (this.dataN == 1) {
      return null;
    }
    const arrayList = new Array<number>();
    const bytes = this.value;
    const i2 = bytes[5] + (bytes[6] << 8);
    let i3 = 0;
    while (i3 < 16) {
      if ((i & i2) != 0) {
        arrayList.push(i3);
      }
      i3++;
      i <<= 1;
    }
    return arrayList;
  }

  getOnSwitchesToShowUser() {
    let i = 1;
    if (this.dataN == 1) {
      return null;
    }
    const arrayList = new Array<number>();
    const unsignedIntFromByte =
      Utils.getUnsignedIntFromByte(this.value[5]) +
      (Utils.getUnsignedIntFromByte(this.value[6]) << 8);
    let i2 = 0;
    while (i2 < 16) {
      if ((i & unsignedIntFromByte) != 0) {
        d("Switch found: ", i2, MachineSwitch.getSwithById(i2));
        if (
          !Utils.isArraysEqual(
            MachineSwitch.fromInt(i2),
            MachineSwitch.IGNORE_SWITCH
          ) &&
          !Utils.isArraysEqual(
            MachineSwitch.fromInt(i2),
            MachineSwitch.WATER_SPOUT
          ) &&
          !Utils.isArraysEqual(
            MachineSwitch.fromInt(i2),
            MachineSwitch.IFD_CARAFFE
          ) &&
          !Utils.isArraysEqual(
            MachineSwitch.fromInt(i2),
            MachineSwitch.CIOCCO_TANK
          )
        ) {
          arrayList.push(i2);
        }
      }
      i2++;
      i <<= 1;
    }
    return arrayList;
  }

  isSwitchOn(machineSwitch: MachineSwitch) {
    if (
      this.dataN == 1 ||
      ((this.value[machineSwitch.getAkey() + 5] >>
        machineSwitch.getBitIndex()) &
        1) ==
        0
    ) {
      return false;
    }
    return true;
  }

  getCoffeeInfuserPos() {
    const i = this.dataN;
    if (i == 1) {
      return -1;
    }
    const c = i == 0 ? 12 : 16;
    const c2 = this.dataN == 2 ? 11 : 15;
    const bytes = this.value;
    return bytes[c] + (bytes[c2] << 8);
  }

  getWaterFlowQty() {
    const i = this.dataN;
    if (i == 1) {
      return -1;
    }
    const c = i == 0 ? 14 : 18;
    const c2 = this.dataN == 2 ? 13 : 17;
    const bytes = this.value;
    return bytes[c2] + (bytes[c] << 8);
  }

  getRequestedWaterQty() {
    if (this.dataN != 1) {
      return -1;
    }
    const bytes = this.value;
    return bytes[16] + (bytes[15] << 8);
  }

  getCoffeePowderQty() {
    if (this.dataN != 1) {
      return -1;
    }
    const bytes = this.value;
    return bytes[18] + (bytes[17] << 8);
  }

  getActiveAlarms() {
    if (this.dataN == 0) {
      return null;
    }
    const arrayList = new Array<number>();
    let i = 1;
    const unsignedIntFromByte =
      Utils.getUnsignedIntFromByte(this.value[this.dataN == 1 ? 4 : 7]) +
      (Utils.getUnsignedIntFromByte(this.value[this.dataN == 1 ? 5 : 8]) << 8) +
      (Utils.getUnsignedIntFromByte(this.value[12]) << 16) +
      (Utils.getUnsignedIntFromByte(this.value[13]) << 24);
    let i2 = 0;
    while (i2 < 32) {
      if ((i & unsignedIntFromByte) != 0) {
        d("Alarm found: " + i2);
        if (
          !Utils.isArraysEqual(
            MachineAlarm.fromInt(i2),
            MachineAlarm.IGNORE_ALARM
          )
        ) {
          arrayList.push(i2);
        }
      }
      i2++;
      i <<= 1;
    }
    return arrayList;
  }

  isAlarmActive(machineAlarm: MachineAlarm) {
    let b = null;
    const i = this.dataN;
    let z = false;
    if (i == 0) {
      return false;
    }
    if (i == 1) {
      b = this.value[machineAlarm.getDiag() + 4];
    } else {
      const diag = machineAlarm.getDiag();
      b = this.value[
        diag != 0
          ? diag != 1
            ? diag != 2
              ? diag != 3
                ? 0
                : 13
              : 12
            : 8
          : 7
      ];
    }
    d(
      "isAlarmActive: " +
        Utils.bufferToHex(Utils.byteToBuffer(new Int8Array([b])))
    );
    if (((b >> machineAlarm.getBitIndex()) & 1) != 0) {
      z = true;
    }
    if (z) {
      d("WATER TANK ALARM");
    }
    return z;
  }

  getOnLoads() {
    if (this.dataN == 0) {
      return null;
    }
    const arrayList = new Array<number>();
    const c = this.dataN == 1 ? 6 : 13;
    const c2 = this.dataN == 1 ? 7 : 14;
    const bytes = this.value;
    const i = bytes[c] + (bytes[c2] << 8);
    let i2 = 32768;
    let i3 = 0;
    while (i3 < 16) {
      if ((i2 & i) != 0) {
        arrayList.push(i3);
      }
      i3++;
      i2 >>= 1;
    }
    return arrayList;
  }

  isLoadOn(machineLoad: MachineLoad) {
    const i = this.dataN;
    if (i == 0) {
      return false;
    }
    if (
      ((this.value[(i == 1 ? 6 : 13) + machineLoad.getLoad()] >>
        machineLoad.getBitIndex()) &
        1) !=
      0
    ) {
      return true;
    }
    return false;
  }

  getFunctionOngoing() {
    const i = this.dataN;
    if (i == 0) {
      return -1;
    }
    const i2 = i == 1 ? 8 : 9;
    const bytes = this.value;
    if (bytes.length > i2) {
      return Utils.byteToInt(bytes[i2]);
    }
    return -1;
  }

  getFunctionExecutionProgress() {
    const i = this.dataN;
    if (i == 0) {
      return -1;
    }
    const i2 = i == 1 ? 9 : 10;
    const bytes = this.value;
    if (bytes.length > i2) {
      return Utils.byteToInt(bytes[i2]);
    }
    return -1;
  }

  getMachineModelId() {
    if (this.dataN != 1) {
      return -1;
    }
    return this.value[10];
  }

  getHeaterTemp() {
    const i = this.dataN;
    if (i == 0) {
      return -1;
    }
    const b = this.value[i == 1 ? 11 : 21];
    if (b < 0) {
      return 0;
    }
    return b;
  }

  getSteamerTemp() {
    const i = this.dataN;
    if (i == 0) {
      return -1;
    }
    const b = this.value[i == 1 ? 12 : 22];
    if (b < 0) {
      return 0;
    }
    return b;
  }

  getBeverageType() {
    const i = this.dataN;
    if (i == 0) {
      return null;
    }
    const b = this.value[i == 1 ? 13 : 23];
    d("Beverage id: " + BeverageId[b]);
    return BeverageId[b];
  }

  getCoffeeWasteCounter() {
    const i = this.dataN;
    if (i == 0) {
      return -1;
    }
    return this.value[i == 1 ? 14 : 24];
  }

  getMainBoardSwRelease() {
    if (this.dataN == 0) {
      return -1;
    }
    return this.value[15];
  }

  getDispensingPercentage() {
    if (this.dataN != 2) {
      return -1;
    }
    return Utils.byteToInt(this.value[11]);
  }

  isReadyToWork() {
    if (
      this.dataN != 0 &&
      this.getFunctionOngoing() == 7 &&
      this.getFunctionExecutionProgress() == 0
    ) {
      return true;
    }
    return false;
  }

  isInStandBy() {
    if (this.dataN == 0 || this.getFunctionOngoing() != 0) {
      return false;
    }
    return true;
  }

  isTurningOn() {
    if (this.dataN == 0 || this.getFunctionOngoing() != 1) {
      return false;
    }
    return true;
  }

  isShuttingDown() {
    if (this.dataN == 0 || this.getFunctionOngoing() != 2) {
      return false;
    }
    return true;
  }

  isShutDown() {
    if (this.dataN == 0 || this.getFunctionOngoing() != 0) {
      return false;
    }
    return true;
  }

  isAccessoryPresent(i: number) {
    if (this.dataN != 1 && Utils.byteToInt(this.value[4]) == i) {
      return true;
    }
    return false;
  }

  getAccessoryPresent() {
    if (this.dataN == 1) {
      return -1;
    }
    return Utils.byteToInt(this.value[4]);
  }

  toString() {
    return `
    MonitorData2:
      - AccessoryPresent      = ${this.getAccessoryPresent()}
      - ActiveAlarms          = ${this.getActiveAlarms()}
      - BeverageType          = ${this.getBeverageType()}
      - CoffeeInfuserPos      = ${this.getCoffeeInfuserPos()}
      - CoffeePowderQty       = ${this.getCoffeePowderQty()}
      - CoffeeWasteCounter    = ${this.getCoffeeWasteCounter()}
      - DispensingPercentage  = ${this.getDispensingPercentage()}
      - FunctionOngoing       = ${this.getFunctionOngoing()}
      - HeaterTemp            = ${this.getHeaterTemp()}
      - MachineModelId        = ${this.getMachineModelId()}
      - MainBoardSwRelease    = ${this.getMainBoardSwRelease()}
      - OnLoads               = ${this.getOnLoads()}
      - OnSwitches            = ${this.getOnSwitches()}
      - OnSwitchesToShowUser  = ${this.getOnSwitchesToShowUser()?.map(
        MachineSwitch.getSwithById
      )}
      - PressedKeys           = ${this.getPressedKeys()}
      - RequestedWaterQty     = ${this.getRequestedWaterQty()}
      - SteamerTemp           = ${this.getSteamerTemp()}
      - Timestamp             = ${this.getTimestamp()}
      - Type                  = ${this.getType()}
      - Value                 = ${this.getValue()}
      - WaterFlowQty          = ${this.getWaterFlowQty()}
    `;
  }
}
