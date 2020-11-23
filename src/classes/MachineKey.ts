export class MachineKey {
  static ON_OFF = [0, 0];
  static CUP_1 = [0, 1];
  static CUP_2 = [0, 2];
  static COFFEE_TASTE = [0, 3];
  static STEAM = [0, 4];
  static HOT_WATER = [0, 5];
  static DRIP_COFFEE = [0, 6];
  static WARM_MILK = [0, 7];
  static SHORT_COFFEE_1 = [1, 0];
  static MEDIUM_COFFE_1 = [1, 1];
  static LONG_COFFEE_1 = [1, 2];
  static SHORT_COFFEE_2 = [1, 3];
  static MEDIUM_COFFE_2 = [1, 4];
  static LONG_COFFEE_2 = [1, 5];
  static CAPPUCCINO = [1, 6];
  static LATTE_MACCHIATO = [1, 7];
  static MENU = [2, 0];
  static OK = [2, 1];
  static ESC = [2, 2];
  static NEXT = [2, 3];
  static PREVIOUS = [2, 4];
  static CAFFELATTE = [2, 5];
  static COFFEE_LENGTH = [2, 6];
  static RINSE = [2, 7];
  static KEY_1 = [3, 0];
  static KEY_2 = [3, 1];
  static KEY_3 = [3, 2];
  static KEY_4 = [3, 3];
  static KEY_5 = [3, 4];
  static KEY_6 = [3, 5];
  static MY_MILK = [3, 6];
  static KEY_7 = [3, 7];
  static KEY_8 = [4, 0];
  static KEY_9 = [4, 1];
  static KEY_10 = [4, 2];
  static KEY_11 = [4, 3];

  akey = 0;
  bitIndex = 0;

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
}
