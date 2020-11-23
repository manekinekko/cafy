export class MachineLoad {
  static MOTOR_MOVING_UP = [0, 0];
  static MOTOR_MOVING_DOWN = [0, 1];
  static COFFEE_HEATER_ON = [0, 2];
  static WATER_PUMP_ON = [0, 3];
  static COFFEE_GRINDER_ON = [0, 4];
  static STEAM_HEATER_ON = [0, 5];
  static ELECTROVALVE_1_ON = [0, 6];
  static ELECTROVALVE_2_ON = [0, 7];
  static CUP_WARMER = [1, 0];
  static CIOCCO_MOTOR = [1, 1];

  bitIndex = 0;
  load = 0;

  constructor(i: number, i2: number) {
    this.load = i;
    this.bitIndex = i2;
  }

  getBitIndex() {
    return this.bitIndex;
  }

  getLoad() {
    return this.load;
  }
}
