import { log } from "debug";
import { BeverageId } from "./BeverageId";

export class Utils {
  static format(
    data: Buffer | Int8Array | string[],
    type: "hex" | "dec" = "dec"
  ) {
    // convert data to Buffer
    if (data instanceof Int8Array) {
      data = Utils.byteToBuffer(data);
    } else if (data instanceof Array && typeof data[0] === "string") {
      data = Utils.hexToBuffer(data.join(" "));
    }

    let str = "";

    if (type === "hex") {
      str = Utils.byteToBuffer(Int8Array.from(data as Buffer))
        .toString("hex")
        .replace(/(.{2})/g, "$1 ")
        .trim();
    } else {
      // decimal
      str = Utils.bufferToByte(data as Buffer).join(" ");
    }

    return `[${str}] (${data.length})`;
  }
  static bufferToHex = (buffer: Buffer) => buffer.toString("hex");
  static byteToHexArray = (bytes: Int8Array) => [
    Utils.bufferToHex(Utils.byteToBuffer(bytes))
      .replace(/(.{2})/g, "$1 ")
      .trim(),
  ];
  static byteToNumber = (bytes: Int8Array, i: number) => {
    let j = 0;
    let i2 = 0;
    while (i2 < 4 && i2 + i < bytes.length) {
      j = (j << 8) | (bytes[i2] & 255);
      i2++;
    }
    return j;
  };
  static hexToBuffer = (hex: string) =>
    Buffer.from(hex.replace(/\s*/g, ""), "hex");

  static byteArrayToString(
    bytes: Int8Array,
    str:
      | "hex"
      | "ascii"
      | "utf8"
      | "utf-8"
      | "utf16le"
      | "ucs2"
      | "ucs-2"
      | "base64"
      | "latin1"
      | "binary"
      | undefined
  ) {
    return Buffer.from(bytes).toString(str).trim();
  }
  static bufferToByte = (buffer: Buffer) => Int8Array.from(buffer);
  static byteToBuffer = (data: Int8Array) => Buffer.from(data);

  static removeNullBytes(bytes: Int8Array) {
    bytes = bytes.filter((byte) => byte != 0);
    return new Int8Array(bytes, 0, bytes.length + 1);
  }

  static isBytesAllNull(bytes: Int8Array) {
    for (let b = 0; b <= bytes.length; b++) {
      if (bytes[b] != 0) {
        return false;
      }
    }
    return true;
  }

  static arraycopy(
    src: Int8Array,
    srcPos: number,
    dst: Int8Array,
    dstPos: number,
    length: number
  ) {
    let j = dstPos;
    const tempArr = src.slice(srcPos, srcPos + length);
    for (const e in tempArr) {
      dst[j] = tempArr[e];
      j++;
    }
  }

  static getOptimalId(i: number) {
    return BeverageId.BEAN_01;
  }

  static twoBytesToShort(b: number, b2: number) {
    return ((b & 0xff) << 8) | (b2 & 0xff);
  }

  static getUnsignedIntFromByte(b: number) {
    return b & 255;
  }

  static byteToInt(b: number) {
    return b & 255;
  }

  static checksum(bytes: Int8Array) {
    let crc = 0x1d0f;
    for (let byteIndex = 0; byteIndex < bytes.length - 2; byteIndex++) {
      let tmp =
        (((crc << 8) | (crc >>> 8)) & 0xffff) ^ (bytes[byteIndex] & 0xff);
      tmp = tmp ^ ((tmp & 0xff) >> 4);
      tmp = tmp ^ ((tmp << 12) & 0xffff);
      crc = tmp ^ (((tmp & 0xff) << 5) & 0xffff);
    }

    return crc & 0xffff;
  }

  static retrieveSkuFromName(str: string) {
    if (str != null) {
      if (str.startsWith("DLWIFI")) {
        str = str.replace("DLWIFI_", "");
      }
      if (/"D[0-9a-zA-Z]{6}.*"/.test(str)) {
        return str.substring(1, 6);
      }
    }
    return null;
  }

  static isArraysEqual(arr1: number[], arr2: number[]) {
    if (arr1.length !== arr2.length) return false;

    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }

    return true;
  }
}
