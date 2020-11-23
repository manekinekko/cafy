import { EcamManager } from "./EcamManager";
import { Parameter } from "./Parameter";
import { Utils } from "./Utils";

export class Synchronizer {
  static TLS_DH_RSA_WITH_AES_256_GCM_SHA384 = 161;
  static TLS_RSA_PSK_WITH_AES_256_CBC_SHA = 149;
  static readStats(parameters: Parameter[]) {
    const parameter = parameters.pop() as Parameter;
    const i = 0;
    const i2 = parameter.getIndex() + 1;
    const bytes = new Int8Array(9);
    bytes[0] = 13;
    bytes[1] = 8;
    bytes[2] = EcamManager.STATISTICS_READ_ANSWER_ID;
    bytes[3] = 15;
    bytes[4] = i >> 8;
    bytes[5] = i;
    bytes[6] = i2;
    const cs = Utils.checksum(bytes);
    bytes[7] = (cs >> 8) & 255;
    bytes[8] = cs & 255;
    return bytes;
  }

  static getParametersPacket(i: number, i2: number) {
    const bytes = new Int8Array(9);
    const b = i >> 8;
    const b2 = i;
    bytes[0] = 13;
    bytes[1] = 8;
    bytes[2] =
      i2 > 4
        ? Synchronizer.TLS_DH_RSA_WITH_AES_256_GCM_SHA384
        : Synchronizer.TLS_RSA_PSK_WITH_AES_256_CBC_SHA;
    bytes[3] = i < 1000 ? 15 : 240;
    bytes[4] = b;
    bytes[5] = b2;
    bytes[6] = i2;
    const checksum = Utils.checksum(bytes);
    bytes[7] = (checksum >> 8) & 255;
    bytes[8] = checksum & 255;
    return bytes;
  }

  static loadSerialNumber() {
    return this.getParametersPacket(Parameter.PARAM_SN_1, 5);
  }

  static readSerialNumber(parameters: Parameter[]) {
    if (parameters.length !== 5) {
      return "";
    }
    return (
      Utils.byteArrayToString(parameters[0].getValue(), "utf-8") +
      Utils.byteArrayToString(parameters[1].getValue(), "utf-8") +
      Utils.byteArrayToString(parameters[2].getValue(), "utf-8") +
      Utils.byteArrayToString(parameters[3].getValue(), "utf-8") +
      Utils.byteArrayToString(parameters[4].getValue(), "utf-8")
    );
  }
}
