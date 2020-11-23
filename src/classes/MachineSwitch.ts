export class MachineSwitch {
  static WATER_SPOUT = [0, 0];
  static MOTOR_UP = [0, 1];
  static MOTOR_DOWN = [0, 2];
  static COFFEE_WASTE_CONTAINER = [0, 3];
  static WATER_TANK_ABSENT = [0, 4];
  static KNOB = [0, 5];
  static WATER_LEVEL_LOW = [0, 6];
  static COFFEE_JUG = [0, 7];
  static IFD_CARAFFE = [1, 0];
  static CIOCCO_TANK = [1, 1];
  static CLEAN_KNOB = [1, 2];
  static DOOR_OPENED = [1, 5];
  static PREGROUND_DOOR_OPENED = [1, 6];
  static UNKNOWN_SWITCH = [99, 99];
  static IGNORE_SWITCH = [100, 100];

  akey = 0;
  bitIndex = 0;

  static fromInt(i: number) {
    switch (i) {
      case 0:
        return MachineSwitch.WATER_SPOUT;
      case 1:
        return MachineSwitch.IGNORE_SWITCH;
      case 2:
        return MachineSwitch.IGNORE_SWITCH;
      case 3:
        return MachineSwitch.COFFEE_WASTE_CONTAINER;
      case 4:
        return MachineSwitch.WATER_TANK_ABSENT;
      case 5:
        return MachineSwitch.KNOB;
      case 6:
        return MachineSwitch.IGNORE_SWITCH;
      case 7:
        return MachineSwitch.COFFEE_JUG;
      case 8:
        return MachineSwitch.IFD_CARAFFE;
      case 9:
        return MachineSwitch.CIOCCO_TANK;
      case 10:
        return MachineSwitch.CLEAN_KNOB;
      case 11:
        return MachineSwitch.IGNORE_SWITCH;
      case 12:
        return MachineSwitch.IGNORE_SWITCH;
      case 13:
        return MachineSwitch.DOOR_OPENED;
      case 14:
        return MachineSwitch.PREGROUND_DOOR_OPENED;
      default:
        return MachineSwitch.UNKNOWN_SWITCH;
    }
  }

  constructor(i: number, i2: number) {
    this.akey = i;
    this.bitIndex = i2;
  }

  getAkey() {
    return this.akey;
  }

  getBitIndex() {
    return this.bitIndex;
  }

  static getSwithById(id: number) {
    switch (id) {
      case 0:
        return "WATER_SPOUT";
      case 1:
        return "IGNORE_SWITCH";
      case 2:
        return "IGNORE_SWITCH";
      case 3:
        return "COFFEE_WASTE_CONTAINER";
      case 4:
        return "WATER_TANK_ABSENT";
      case 5:
        return "KNOB";
      case 6:
        return "IGNORE_SWITCH";
      case 7:
        return "COFFEE_JUG";
      case 8:
        return "IFD_CARAFFE";
      case 9:
        return "CIOCCO_TANK";
      case 10:
        return "CLEAN_KNOB";
      case 11:
        return "IGNORE_SWITCH";
      case 12:
        return "IGNORE_SWITCH";
      case 13:
        return "DOOR_OPENED";
      case 14:
        return "PREGROUND_DOOR_OPENED";
      default:
        return "UNKNOWN_SWITCH";
    }
  }
}
