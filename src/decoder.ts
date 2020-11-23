import debug from "debug";
import { Appliance } from "./classes/Appliance";
import { ApplianceManager } from "./classes/ApplianceManager";
import { BeanSystem } from "./classes/BeanSystem";
import { EcamManager } from "./classes/EcamManager";
import { MonitorData } from "./classes/MonitorData";
import { MonitorData2 } from "./classes/MonitorData2";
import { Parameter } from "./classes/Parameter";
import { ParameterModel } from "./classes/ParameterModel";
import { RecipeData } from "./classes/RecipeData";
import { RecipeDefaults } from "./classes/RecipeDefaults";
import { Utils } from "./classes/Utils";
const d = debug("Decoder");

const UByte = {
  MAX_VALUE: -1,
};

export function decode(app: any, bytes: Int8Array) {
  const EcamUpdatesReceived = {
    beverageSavingResult(...args: any[]) {
      d("EcamUpdatesReceived.beverageSavingResult", args);
    },
    onBeanSystemWritten(...args: any[]) {
      d("EcamUpdatesReceived.onBeanSystemWritten", args);
    },
    onParameterWritten(...args: any[]) {
      d("EcamUpdatesReceived.onParameterWritten", args);
    },
    onRecipeQuantitiesReceived(...args: any[]) {
      d("EcamUpdatesReceived.onRecipeQuantitiesReceived", args);
    },
    onMonitorDataReceived(args: MonitorData) {
      d("EcamUpdatesReceived.onMonitorDataReceived", args);
    },
    onMonitorDataReceivedV2(monitorData: MonitorData2) {
      d(monitorData.toString());
    },
    onRecipesNamesWritten(...args: any[]) {
      d("EcamUpdatesReceived.onRecipesNamesWritten", args);
    },
    onProfileSelectionAnswer(...args: any[]) {
      d("EcamUpdatesReceived.onProfileSelectionAnswer", args);
    },
    onProfilesNamesReceived(...args: any[]) {
      d("EcamUpdatesReceived.onProfilesNamesReceived", args);
    },
    async onParametersReceived(parameters: Parameter[]) {
      d(parameters.toString());

      // await app.sendCommand(Synchronizer.loadSerialNumber(), async (chunk: Int8Array) => {
      //   await app.machine?.characteristic?.writeAsync(Utils.buffer(chunk), true);
      // });
    },
    onRequestTimeout(n: number) {
      d("EcamUpdatesReceived.onRequestTimeout", n);
    },
    onTimeSet(n: number) {
      d("EcamUpdatesReceived.onTimeSet", n);
    },
    onBeanSystemReceived(n: BeanSystem) {
      d("EcamUpdatesReceived.onTimeSet", n);
    },
    onPrioritiesReceived(n: number, bytes: Int8Array) {
      d("EcamUpdatesReceived.onPrioritiesReceived", n);
    },
    onProfilesRecipeQuantitiesReceived(n: number, r: RecipeData) {
      d(
        "EcamUpdatesReceived.onProfilesRecipeQuantitiesReceived",
        n,
        r
      );
    },
    onProfilesNamesWritten(n: number) {
      d("EcamUpdatesReceived.onProfilesNamesWritten", n);
    },
    onRecipesNamesReceived(a: string[], b: number[]) {
      d("EcamUpdatesReceived.onRecipesNamesReceived", a, b);
    },
    onChecksumsReceived(x: number, y: number, arr: Int8Array) {
      d("EcamUpdatesReceived.onChecksumsReceived", x, y, arr);
    },
  };

  let r1 = bytes[2];
  const r0 = 2;
  let r3 = 5;
  const r4 = 4;
  let r5 = 0;
  const r6 = 1;

  if (r1 == EcamManager.BEVERAGE_DISPENSING_ANSWER_ID) {
    let x = bytes[r4];
    if (x != 0) {
      x = r5;
    }
    x = r6;
    const n = bytes[r3];
    if (n != 0) {
      EcamUpdatesReceived.beverageSavingResult(x, r5);
    }
    r5 = r6;
  }

  const r7 = 6;
  if (r1 == EcamManager.PARAMETER_WRITE_ANSWER_ID) {
    const x = bytes[r4];
    r1 = bytes[r3];
    const n = Utils.twoBytesToShort(x, r1);
    const y = bytes[r7];
    if (y != 0) {
      EcamUpdatesReceived.onParameterWritten(n, r5);
      return;
    }
    r5 = r6;
  }

  if (r1 == EcamManager.PARAMETER_READ_ANSWER_ID) L_0x0207();

  if (r1 == EcamManager.PIN_ACTIVATION_ANSWER_ID) {
    // const r0 = bytes[r6];
    const x = Utils.getUnsignedIntFromByte(bytes[r4]);
    const minMax = getDefaultMinMaxQty(bytes);
    EcamUpdatesReceived.onRecipeQuantitiesReceived(x, minMax);
    return;
  }

  if (r1 == EcamManager.DATA_0_ANSWER_ID) {
    const monitorData = new MonitorData(r5, bytes);
    EcamUpdatesReceived.onMonitorDataReceived(monitorData);
    return;
  }

  if (r1 == EcamManager.DATA_1_ANSWER_ID) {
    const monitorData = new MonitorData(r6, bytes);
    EcamUpdatesReceived.onMonitorDataReceived(monitorData);
    return;
  }

  if (r1 == EcamManager.DATA_2_ANSWER_ID) {
    const monitorData2 = new MonitorData2(r0, bytes);
    EcamUpdatesReceived.onMonitorDataReceivedV2(monitorData2);
    return;
  }

  if (r1 == EcamManager.BUSY_MAIN_BOARD_ANSWER) {
    EcamUpdatesReceived.onRequestTimeout(r1);
    return;
  }

  if (r1 == EcamManager.SET_TIME_ANSWER) {
    const n = bytes[r4];
    if (n != 0) {
      EcamUpdatesReceived.onTimeSet(r5);
      return;
    }
    r5 = r6;
  }

  switch (r1) {
    case EcamManager.PARAMETER_READ_EXT_ANSWER_ID:
      L_0x0207();
    case EcamManager.STATISTICS_READ_ANSWER_ID:
      L_0x016b();
    case EcamManager.CHECKSUM_ANSWER_ID:
      L_0x0103();
    case EcamManager.PROFILES_NAME_READ_ANSWER_ID:
      L_0x00d9();
    case EcamManager.PROFILES_NAME_WRITE_ANSWER_ID:
      L_0x00cd();
    case EcamManager.RECIPES_QTY_READ_ANSWER_ID:
      L_0x0085();
    case EcamManager.RECIPES_PRIORITY_READ_ANSWER_ID:
      L_0x0074();
    case EcamManager.PROFILE_SELECTION_ANSWER_ID:
      L_0x0066();
    case EcamManager.RECIPES_NAME_READ_ANSWER_ID:
      L_0x00d9();
    case EcamManager.RECIPES_NAME_WRITE_ANSWER_ID:
      L_0x005a();
    case EcamManager.BEAN_SYSTEM_SELECT_ANSWER_ID:
      L_0x004e();
    case EcamManager.BEAN_SYSTEM_READ_ANSWER_ID:
      L_0x0043();
    case EcamManager.BEAN_SYSTEM_WRITE_ANSWER_ID:
      L_0x0037();
    default:
      return;
  }

  function L_0x0037() {
    const n = bytes[r3];
    if (n != 0) {
      EcamUpdatesReceived.onBeanSystemWritten(r5);
      return;
    }
    r5 = r6;
  }

  function L_0x0043() {
    const beanSystem = loadBeanSystems(bytes);
    EcamUpdatesReceived.onBeanSystemReceived(beanSystem as BeanSystem);
    return;
  }

  function L_0x004e() {
    const n = bytes[r3];
    if (n != 0) {
      EcamUpdatesReceived.onBeanSystemWritten(r5);
      return;
    }
    r5 = r6;
  }

  function L_0x005a() {
    const x = bytes[r4];
    if (x != 0) {
      EcamUpdatesReceived.onRecipesNamesWritten(r5);
      return;
    }
    r5 = r6;
  }

  function L_0x0066() {
    const x = bytes[r3];
    if (x != 0) {
      const n = bytes[r4];
      EcamUpdatesReceived.onProfileSelectionAnswer(n, r5);
      return;
    }
    r5 = r6;
  }

  function L_0x0074() {
    const r0 = Utils.byteToInt(bytes[r4]);
    const pr = readPriorities(bytes);
    EcamUpdatesReceived.onPrioritiesReceived(r0, pr);
    return;
  }

  function L_0x0085() {
    // r0 = bytes[r6];
    const x = bytes[r4];
    const a = Utils.getUnsignedIntFromByte(x);
    const b = Utils.getUnsignedIntFromByte(bytes[r3]);
    const c = getRecipeDataFromByteArray(bytes);

    d(
      "onProfilesRecipeQuantitiesReceived",
      "Risposta Profilo",
      a,
      "Bevanda:",
      b,
      "Payload:",
      Utils.bufferToHex(Utils.byteToBuffer(bytes))
    );
    EcamUpdatesReceived.onProfilesRecipeQuantitiesReceived(a, c);
    return;
  }

  function L_0x00cd() {
    const a = bytes[r4];
    if (a != 0) {
      EcamUpdatesReceived.onProfilesNamesWritten(r5);
      return;
    }
    r5 = r6;
  }

  function L_0x00d9() {
    const b = readProfiles(bytes);

    if (r1 != EcamManager.PROFILES_NAME_READ_ANSWER_ID) {
      const x = b["names_extra"];
      const y = b["icons_extra"];
      EcamUpdatesReceived.onRecipesNamesReceived(x, y);
      return;
    }
    const x = b["names_extra"];
    const y = b["icons_extra"];
    EcamUpdatesReceived.onProfilesNamesReceived(x, y);
    return;
  }

  function L_0x0103() {
    const p1 = ApplianceManager.getInstance()
      .getCurrentSelectedEcam()
      .getProfiles();
    const s1 = p1.length;
    const p2 = ApplianceManager.getInstance()
      .getCurrentSelectedEcam()
      .getProfiles();
    const s2 = p2.length;
    const arr = new Int8Array(s2);

    while (true) {
      const p3 = ApplianceManager.getInstance()
        .getCurrentSelectedEcam()
        .getProfiles();
      let s3 = p3.length;
      s3 = s3 * r0;
      if (r5 >= r3) {
        const x = r1 * r0 + 4;
        const a = bytes[r1 + 5];
        const n = Utils.twoBytesToShort(bytes[x], a);
        const b = bytes[r1 + 6];
        const c = bytes[r1 + 7];
        const d = Utils.twoBytesToShort(b, c);
        EcamUpdatesReceived.onChecksumsReceived(d, n, arr);
        return;
      }

      const e = bytes[r5 + 4];
      const f = bytes[r5 + 5];
      arr[r5 / 2] = Utils.twoBytesToShort(e, f);
      r5 = r5 + 2;
    }
  }

  function L_0x016b() {
    let a = bytes[r6];
    a = a & UByte.MAX_VALUE;
    a = a - r3;
    a = a / r7;
    const parameters = new Array<Parameter>(a);
    r3 = r5;
    let j = r3;

    while (true) {
      if (r3 >= a) {
        EcamUpdatesReceived.onParametersReceived(parameters);
        return;
      }
      const arr = new Int8Array(r0);
      const x = bytes[j + 4];
      arr[r5] = x;

      const y = bytes[j + 5];
      arr[r6] = y;

      const z = Utils.byteToNumber(arr, r5);
      const arr2 = new Int8Array(r4);
      Utils.arraycopy(bytes, r3 * 6 + r7, arr2, r5, r4);

      const par = new Parameter(z, arr2);
      parameters.push(par);
      j = j + r7;
      r3 = r3 + 1;
    }
  }

  function L_0x0207() {
    let x = bytes[r6];
    x = x & UByte.MAX_VALUE;
    x = x + -7;
    x = x / r4;
    const parameters = getParametersFromByte(bytes);
    EcamUpdatesReceived.onParametersReceived(parameters);
    return;
  }
}

function getDefaultMinMaxQty(bytes: Int8Array) {
  let i;
  let i2;
  let i3;
  let b = bytes[1] & UByte.MAX_VALUE;
  let unsignedIntFromByte = Utils.getUnsignedIntFromByte(bytes[4]);
  let i4 = (b - 6) / 4;
  d("txLength :" + b);
  d("recipeLength :" + i4);
  let arrayList = new Array();
  let i5 = 0;
  for (let i6 = 0; i6 < i4; i6++) {
    let i7 = i6 * 4 + i5;
    let i8 = i7 + 8;
    if (b <= i8) {
      break;
    }
    let parameterModel = new ParameterModel();
    let unsignedIntFromByte2 = Utils.getUnsignedIntFromByte(bytes[i7 + 5]);
    d("pramId :" + unsignedIntFromByte2);
    if (isTowBytesShort(unsignedIntFromByte2)) {
      i = Utils.twoBytesToShort(bytes[i7 + 6], bytes[i7 + 7]);
      i2 = Utils.twoBytesToShort(bytes[i8], bytes[i7 + 9]);
      i3 = Utils.twoBytesToShort(bytes[i7 + 10], bytes[i7 + 11]);
      i5 += 3;
    } else {
      i = Utils.getUnsignedIntFromByte(bytes[i7 + 6]);
      let unsignedIntFromByte3 = Utils.getUnsignedIntFromByte(bytes[i7 + 7]);
      let unsignedIntFromByte4 = Utils.getUnsignedIntFromByte(bytes[i8]);
      i2 = unsignedIntFromByte3;
      i3 = unsignedIntFromByte4;
    }
    parameterModel.setId(unsignedIntFromByte2);
    parameterModel.setMinValue(i);
    parameterModel.setMaxValue(i3);
    parameterModel.setDefValue(i2);
    arrayList.push(parameterModel);
  }
  return new RecipeDefaults(
    unsignedIntFromByte,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    arrayList,
    false
  );
}

function getParametersFromByte(bytes: Int8Array): Parameter[] {
  let i = ((bytes[1] & UByte.MAX_VALUE) - 7) / 4;
  let arrayList = new Array(i);
  let twoBytesToShort_ = Utils.twoBytesToShort(bytes[4], bytes[5]);
  for (let i2 = 0; i2 < i; i2++) {
    let bytes2 = new Int8Array(4);
    Utils.arraycopy(bytes, i2 * 4 + 6, bytes2, 0, 4);
    arrayList.push(new Parameter(twoBytesToShort_, bytes2));
    twoBytesToShort_++;
  }
  return arrayList;
}

function readPriorities(bytes: Int8Array) {
  d("readPriorities");
  // byteToInt(bytes[4]);
  let i = (bytes[1] & UByte.MAX_VALUE) - 6;
  let iArr = new Int8Array(i);
  for (let i2 = 0; i2 < i; i2++) {
    iArr[i2] = Utils.byteToInt(bytes[i2 + 5]);
  }
  return iArr;
}

function getRecipeDataFromByteArray(bytes: Int8Array) {
  let i;
  let z;
  let b = bytes[1] & UByte.MAX_VALUE;
  Utils.getUnsignedIntFromByte(bytes[4]);

  let unsignedIntFromByte = Utils.getUnsignedIntFromByte(bytes[5]);
  let i2 = (b - 7) / 2;

  d(
    "getRecipeDataFromByteArray - Beverage ID: ",
    unsignedIntFromByte,
    " ingredientsLength :",
    i2
  );
  let arrayList = new Array();
  let i3 = 0;
  for (let i4 = 0; i4 < i2; i4++) {
    let i5 = i4 * 2 + i3;
    let i6 = i5 + 7;
    if (b <= i6) {
      break;
    }
    let unsignedIntFromByte2 = Utils.getUnsignedIntFromByte(bytes[i5 + 6]);
    if (isTowBytesShort(unsignedIntFromByte2)) {
      i = Utils.twoBytesToShort(bytes[i6], bytes[i5 + 8]);
      i3++;
    } else {
      i = Utils.getUnsignedIntFromByte(bytes[i6]);
    }

    z = false;
    for (let index = 0; index < arrayList.length; index++) {
      const parameterModel = arrayList[index];
      if (parameterModel.getId() == unsignedIntFromByte2) {
        parameterModel.setDefValue(i);
        z = true;
        break;
      }
    }

    if (!z) {
      const parameterModel2 = new ParameterModel();
      parameterModel2.setId(unsignedIntFromByte2);
      parameterModel2.setDefValue(i);
      arrayList.push(parameterModel2);
    }
  }
  const recipeData = new RecipeData(unsignedIntFromByte);
  recipeData.setIngredients(arrayList);
  return recipeData;
}

function isTowBytesShort(i: number) {
  if (Appliance.getParameters() != null) {
    const params = Appliance.getParameters();
    for (let index = 0; index < params.length; index++) {
      const element = params[index];
      if (element.getId() == i && element.getLength() > 1) {
        return true;
      }
    }
  }
  return false;
}

function loadBeanSystems(bytes: Int8Array) {
  d("loadBeanSystems");
  const r2 = 4;
  const r3 = new Int8Array(40);
  Utils.arraycopy(bytes, 5, r3, 0, 40);
  const z = Utils.isBytesAllNull(r3);

  if (z != false) {
    const y = Utils.getUnsignedIntFromByte(bytes[49]);

    let r11 = true;
    if (y == 1) {
      r11 = false;
    }

    const z = Utils.getUnsignedIntFromByte(bytes[50]);
    let r10 = true;
    if (z == 0) {
      r10 = false;
    }

    const r15 = Utils.getOptimalId(bytes[4]);
    const r12 = Utils.getUnsignedIntFromByte(bytes[45]);
    const r13 = Utils.getUnsignedIntFromByte(bytes[46]);
    const r14 = Utils.getUnsignedIntFromByte(bytes[47]);
    try {
      return new BeanSystem(bytes[4], "", "", r10, r11, r12, r13, r14, r15);
    } catch (error) {
      try {
        return new BeanSystem(bytes[4], "", "", false, true, 0, 0, 0, 200);
      } catch (error) {
        return null;
      }
    }
  }

  const s = Utils.byteArrayToString(Utils.removeNullBytes(r3), "utf16le");
  d(s);

  try {
    return new BeanSystem(bytes[r2], "", "", false, true, 0, 0, 0, 200);
  } catch (error) {
    return null;
  }
}

function readProfiles(bytes: Int8Array) {
  d("readProfiles");

  const byteToInt = Utils.byteToInt(bytes[1]);
  const i = 4; // Bluethooth connection
  const i2 = (byteToInt - (i + 1)) / 21;
  const arrayList = new Array<string>(i2);
  const arrayList2 = new Array<number>(i2);
  for (let i3 = 0; i3 < i2; i3++) {
    const bytes2 = new Int8Array(20);
    const i4 = i3 * 21;
    Utils.arraycopy(bytes, i + i4, bytes2, 0, 20);

    let str = "";
    if (!Utils.isBytesAllNull(bytes2)) {
      str = Utils.byteArrayToString(Utils.removeNullBytes(bytes2), "utf16le");
    }
    const valueOf = Utils.byteToInt(bytes[i + 20 + i4]);
    arrayList.push(str);
    arrayList2.push(valueOf);
  }
  return {
    names_extra: arrayList,
    icons_extra: arrayList2,
  };
}
