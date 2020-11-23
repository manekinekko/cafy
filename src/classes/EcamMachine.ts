export class EcamMachine {
  profiles: any[] = [];
  connectionStatus: string;
  connectionType: string;
  protocolVersion: number;
  namesChecksum: number;
  customRecipesQtyChecksum: number;
  selectedProfileIndex: number;
  pin: number;
  customRecipes: any;
  beanSystemRecipes: any;
  originalName: string;
  customRecipesCnt = 0;
  serialNumber = "";

  constructor(
    public address: string,
    originalName: string,
    protocolVersion: number,
    profilesLength: number
  ) {
    this.originalName = originalName;
    this.connectionStatus = "";
    this.connectionType = "";
    this.protocolVersion = protocolVersion;
    this.namesChecksum = 0;
    this.customRecipesQtyChecksum = 0;
    this.selectedProfileIndex = 1;
    this.pin = -1;
    this.profiles = new Array<any>(profilesLength);
    this.customRecipes = new Array<any>(this.getCustomRecipeNumbers());
    this.beanSystemRecipes = new Array<any>(6);
  }

  getProfiles() {
    return this.profiles;
  }

  getCustomRecipeNumbers() {
    if (this.protocolVersion > 1) {
      return this.customRecipesCnt;
    }
    return 6;
  }

  getSerialNumber() {
    return this.serialNumber;
  }

  setSerialNumber(str: string) {
    this.serialNumber = str;
  }
}
