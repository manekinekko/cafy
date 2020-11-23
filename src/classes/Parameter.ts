import { Utils } from "./Utils";

const Tnaf = {
  POW_2_WIDTH: 16,
};
export class Parameter {
  static EUROPE_TYPE = 0;
  static FACTORY0_conf = 0;
  static FACTORY1_conf = 1;
  static JAPAN_TYPE = 1;
  static PARAM_ABSOLUTE_POSITION_MC1 = 78;
  static PARAM_ABSOLUTE_POSITION_MC2 = 82;
  static PARAM_ACT_SECOND = 1004;
  static PARAM_AUTOOFF = 62;
  static PARAM_AUTOSTART_HOUR = 64;
  static PARAM_AUTOSTART_MINUTE = 65;
  static PARAM_CURRENT_HOUR = 95;
  static PARAM_CURRENT_MINUTE = 96;
  static PARAM_CURRENT_SECOND = 97;
  static PARAM_CUSTOM6_ABS_CNT = 181;
  static PARAM_DEFAULT_POSITION_MC1 = 80;
  static PARAM_DEFAULT_POSITION_MC1SET = 81;
  static PARAM_DEFAULT_POSITION_MC2 = 84;
  static PARAM_DEFAULT_POSITION_MC2SET = 85;
  static PARAM_FIRST_CONFIG = 70;
  static PARAM_GRINDER_QERROR_1 = 76;
  static PARAM_GRINDER_QERROR_2 = 77;
  static PARAM_HOT_WATER_COUNT = 152;
  static PARAM_INERTIA_1 = 74;
  static PARAM_INERTIA_2 = 75;
  static PARAM_MC1_SPARE = 88;
  static PARAM_MC2_SPARE = 89;
  static PARAM_PIN = 210;
  static PARAM_SN_1 = 205;
  static PARAM_STA_CONF = 63;
  static PARAM_STEPS_REQUESTED_MC1 = 86;
  static PARAM_STEPS_REQUESTED_MC2 = 87;
  static PARAM_STEP_TO_SWITCH_MC1 = 79;
  static PARAM_STEP_TO_SWITCH_MC2 = 83;
  static PARAM_TEMPERATURE = 61;
  static PARAM_WATER_HARDNESS = 50;
  static USA_TYPE = 2;
  index: number;
  timestamp: number;
  value = new Int8Array();

  describeContents() {
    return 0;
  }

  constructor(i: number, bytes: Int8Array) {
    this.index = i;
    this.value = bytes;
    this.timestamp = Date.now();
  }

  getIndex() {
    return this.index;
  }

  getValue() {
    return this.value;
  }

  setValue(bytes: Int8Array) {
    this.value = bytes;
  }

  setIndexValue(i: number) {
    let bytes = new Int8Array(4);
    bytes[3] = i;
    bytes[2] = (i >> 8) & 255;
    bytes[1] = (i >> 16) & 255;
    bytes[0] = (i >> 24) & 255;
    this.value = bytes;
  }

  getTimestamp() {
    return this.timestamp;
  }

  setTimestamp(j: number) {
    this.timestamp = j;
  }

  getLongValue() {
    return Utils.byteToNumber(this.value, 0);
  }

  isLanguageSet() {
    if (this.index == 0 && (this.value[3] & 32) != 0) {
      return true;
    }
    return false;
  }

  getSelectedLanguage() {
    if (this.index != 0) {
      return -1;
    }
    return this.value[3] & 31;
  }

  getCountryType() {
    if (this.index != 1) {
      return -1;
    }
    return (this.value[3] & 12) >> 2;
  }

  isTimeSet24hFormat() {
    let i = this.index;
    if ((i == 0 || i == 63) && (this.value[3] & 2) == 0) {
      return true;
    }
    return false;
  }

  isFirstStartEnabled() {
    return this.index == 1 && (this.value[3] & 1) != 0;
  }

  isCupWarmerOn() {
    if (this.index == 63 && (this.value[3] & 5) != 0) {
      return true;
    }
    return false;
  }

  isEnergySaving() {
    let i = this.index;
    if (i == 0 || i == 63) {
      return i == 0
        ? (this.value[3] & 64) != 0
        : (this.value[3] & Tnaf.POW_2_WIDTH) != 0;
    }
    return false;
  }

  isCupLightOn() {
    if (this.index == 63 && (this.value[3] & 8) != 0) {
      return true;
    }
    return false;
  }

  isBuzzerOn() {
    if (this.index == 63 && (this.value[3] & 4) != 0) {
      return true;
    }
    return false;
  }

  isFilterOn() {
    if (this.index == 63 && (this.value[3] & 128) != 0) {
      return true;
    }
    return false;
  }

  isWriteDone() {
    if (this.index == 63 && this.value[0] == 0) {
      return true;
    }
    return false;
  }

  isAutoStartOn() {
    if (this.index == 63 && (this.value[3] & 1) == 0) {
      return true;
    }
    return false;
  }

  isAutoOffOn() {
    if (this.index == 63 && (this.value[3] & 64) != 0) {
      return true;
    }
    return false;
  }

  setEnergySaving(z: boolean) {
    if (this.index == 63) {
      if (z) {
        let bytes = this.value;
        bytes[3] = bytes[3] ^ Tnaf.POW_2_WIDTH;
        return;
      }
      let bytes2 = this.value;
      bytes2[3] = bytes2[3] & -17;
    }
  }

  setCupLightOn(z: boolean) {
    if (this.index == 63) {
      if (z) {
        let bytes = this.value;
        bytes[3] = bytes[3] ^ 8;
        return;
      }
      let bytes2 = this.value;
      bytes2[3] = bytes2[3] & -9;
    }
  }

  setBuzzerOn(z: boolean) {
    if (this.index == 63) {
      if (z) {
        let bytes = this.value;
        bytes[3] = bytes[3] ^ 4;
        return;
      }
      let bytes2 = this.value;
      bytes2[3] = bytes2[3] & -5;
    }
  }

  setFilterOn(z: boolean) {
    if (this.index == 63) {
      if (z) {
        let bytes = this.value;
        bytes[3] = bytes[3] ^ 128;
        return;
      }
      let bytes2 = this.value;
      bytes2[3] = bytes2[3] & 127;
    }
  }

  setAutoStartOn(z: boolean) {
    if (this.index == 63) {
      if (!z) {
        let bytes = this.value;
        bytes[3] = bytes[3] ^ 1;
        return;
      }
      let bytes2 = this.value;
      bytes2[3] = bytes2[3] & -2;
    }
  }

  setAutoOffOn(z: boolean) {
    if (this.index == 63) {
      if (z) {
        let bytes = this.value;
        bytes[3] = bytes[3] ^ 64;
        return;
      }
      let bytes2 = this.value;
      bytes2[3] = bytes2[3] & -65;
    }
  }

  toString() {
    return `
    Parameter:
      - Index             = ${this.getIndex()}
      - Value             = ${this.getValue()}
      - CountryType       = ${this.getCountryType()}
      - SelectedLanguage  = ${this.getSelectedLanguage()}
      - AutoOffOn         = ${this.isAutoOffOn()}
      - AutoStartOn       = ${this.isAutoStartOn()}
      - BuzzerOn          = ${this.isBuzzerOn()}
      - CupLightOn        = ${this.isCupLightOn()}
      - CupWarmerOn       = ${this.isCupWarmerOn()}
      - EnergySaving      = ${this.isEnergySaving()}
      - FilterOn          = ${this.isFilterOn()}
      - FirstStartEnabled = ${this.isFirstStartEnabled()}
      - LanguageSet       = ${this.isLanguageSet()}
      - TimeSet24hFormat  = ${this.isTimeSet24hFormat()}
      - WriteDone         = ${this.isWriteDone()}
    `;
  }
}
