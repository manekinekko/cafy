export class MachineAlarm {
  static EMPTY_WATER_TANK = [0, 0];
  static COFFEE_WASTE_CONTAINER_FULL = [0, 1];
  static DESCALE_ALARM = [0, 2];
  static REPLACE_WATER_FILTER = [0, 3];
  static COFFE_GROUND_TOO_FINE = [0, 4];
  static COFFEE_BEANS_EMPTY = [0, 5];
  static MACHINE_TO_SERVICE = [0, 6];
  static COFFEE_HEATER_PROBE_FAILURE = [0, 7];
  static TOO_MUCH_COFFEE = [1, 0];
  static COFFEE_INFUSER_MOTOR_NOT_WORKING = [1, 1];
  static STEAMER_PROBE_FAILURE = [1, 2];
  static EMPTY_DRIP_TRAY = [1, 3];
  static HYDRAULIC_CIRCUIT_PROBLEM = [1, 4];
  static TANK_IS_IN_POSITION = [1, 5];
  static CLEAN_KNOB = [1, 6];
  static COFFEE_BEANS_EMPTY_TWO = [1, 7];
  static TANK_TOO_FULL = [2, 0];
  static BEAN_HOPPER_ABSENT = [2, 1];
  static GRID_PRESENCE = [2, 2];
  static INFUSER_SENSE = [2, 3];
  static NOT_ENOUGH_COFFEE = [2, 4];
  static EXPANSION_COMM_PROB = [2, 5];
  static EXPANSION_SUBMODULES_PROB = [2, 6];
  static GRINDING_UNIT_1_PROBLEM = [2, 7];
  static GRINDING_UNIT_2_PROBLEM = [3, 0];
  static CONDENSE_FAN_PROBLEM = [3, 1];
  static CLOCK_BT_COMM_PROBLEM = [3, 2];
  static SPI_COMM_PROBLEM = [3, 3];
  static UNKNOWN_ALARM = [99, 99];
  static IGNORE_ALARM = [100, 100];

  bitIndex = 0;
  diag = 0;

  constructor(diag: number, bitIndex: number) {
    this.diag = diag;
    this.bitIndex = bitIndex;
  }

  getBitIndex() {
    return this.bitIndex;
  }

  getDiag() {
    return this.diag;
  }
  static fromInt(i: number) {
    switch (i) {
      case 0:
        return MachineAlarm.EMPTY_WATER_TANK;
      case 1:
        return MachineAlarm.COFFEE_WASTE_CONTAINER_FULL;
      case 2:
        return MachineAlarm.DESCALE_ALARM;
      case 3:
        return MachineAlarm.REPLACE_WATER_FILTER;
      case 4:
        return MachineAlarm.COFFE_GROUND_TOO_FINE;
      case 5:
        return MachineAlarm.COFFEE_BEANS_EMPTY;
      case 6:
        return MachineAlarm.MACHINE_TO_SERVICE;
      case 7:
        return MachineAlarm.COFFEE_HEATER_PROBE_FAILURE;
      case 8:
        return MachineAlarm.TOO_MUCH_COFFEE;
      case 9:
        return MachineAlarm.IGNORE_ALARM;
      case 10:
        return MachineAlarm.STEAMER_PROBE_FAILURE;
      case 11:
        return MachineAlarm.EMPTY_DRIP_TRAY;
      case 12:
        return MachineAlarm.HYDRAULIC_CIRCUIT_PROBLEM;
      case 13:
        return MachineAlarm.IGNORE_ALARM;
      case 14:
        return MachineAlarm.CLEAN_KNOB;
      case 15:
        return MachineAlarm.COFFEE_BEANS_EMPTY_TWO;
      case 16:
        return MachineAlarm.IGNORE_ALARM;
      case 17:
        return MachineAlarm.BEAN_HOPPER_ABSENT;
      case 18:
        return MachineAlarm.GRID_PRESENCE;
      case 19:
        return MachineAlarm.INFUSER_SENSE;
      case 20:
        return MachineAlarm.IGNORE_ALARM;
      case 21:
        return MachineAlarm.IGNORE_ALARM;
      case 22:
        return MachineAlarm.EXPANSION_SUBMODULES_PROB;
      case 23:
        return MachineAlarm.IGNORE_ALARM;
      case 24:
        return MachineAlarm.IGNORE_ALARM;
      case 25:
        return MachineAlarm.CONDENSE_FAN_PROBLEM;
      case 26:
        return MachineAlarm.IGNORE_ALARM;
      case 27:
        return MachineAlarm.IGNORE_ALARM;
      case 28:
        return MachineAlarm.IGNORE_ALARM;
      case 29:
        return MachineAlarm.IGNORE_ALARM;
      case 30:
        return MachineAlarm.IGNORE_ALARM;
      case 31:
        return MachineAlarm.IGNORE_ALARM;
      default:
        return MachineAlarm.UNKNOWN_ALARM;
    }
  }
}
