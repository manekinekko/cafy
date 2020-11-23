import debug from "debug";
const d = debug('EcamManager');

import { Peripheral } from "@abandonware/noble";

export class EcamManager {
  static ANSWER_ID_BYTE_IDX = 2;
  static BEAN_SYSTEM_READ_ANSWER_ID = -70;
  static BEAN_SYSTEM_SELECT_ANSWER_ID = -71;
  static BEAN_SYSTEM_WRITE_ANSWER_ID = -69;
  static BEVERAGE_DISPENSING_ANSWER_ID = -125;
  static BUSY_MAIN_BOARD_ANSWER = -31;
  static BUSY_RETRY_DELAY = 100;
  static CHECKSUM_ANSWER_ID = -93;
  static DATA_0_ANSWER_ID = 96;
  static DATA_1_ANSWER_ID = 112;
  static DATA_2_ANSWER_ID = 117;
  static MAX_BUSY_RETRIES = 10;
  static MAX_CONNECTION_RETRIES = 3;
  static MAX_MISMATCH_RETRIES = 5;
  static MAX_REQUEST_RETRIES = 5;
  static MISMATCH_RETRY_DELAY = 100;
  static PARAMETER_READ_ANSWER_ID = -107;
  static PARAMETER_READ_EXT_ANSWER_ID = -95;
  static PARAMETER_WRITE_ANSWER_ID = -112;
  static PIN_ACTIVATION_ANSWER_ID = -80;
  static PIN_SET_ANSWER_ID = -79;
  static PRIORITY_HIGH = 1;
  static PRIORITY_LOW = 3;
  static PRIORITY_NORMAL = 2;
  static PROFILES_NAME_READ_ANSWER_ID = -92;
  static PROFILES_NAME_WRITE_ANSWER_ID = -91;
  static PROFILE_SELECTION_ANSWER_ID = -87;
  static RECIPES_NAME_READ_ANSWER_ID = -86;
  static RECIPES_NAME_WRITE_ANSWER_ID = -85;
  static RECIPES_PRIORITY_READ_ANSWER_ID = -88;
  static RECIPES_QTY_READ_ANSWER_ID = -90;
  static REMOTE_CONTROL = 12;
  static SET_TIME_ANSWER = -30;
  static STATISTICS_READ_ANSWER_ID = -94;
  static addEcamMachine(address: string, name: string) {
    d("machine added");
  }

  static onMachineFound(device: Peripheral, bytes: Int8Array) {
    d("Ecam Machine found", {
      name: device.advertisement.localName,
      address: device.address,
    });

    EcamManager.addEcamMachine(
      device.address,
      device.advertisement.localName
    );
  }
}
