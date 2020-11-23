import { EcamMachine } from "./EcamMachine";

export class ApplianceManager {
  static sInstance: ApplianceManager;
  currentSelectedEcam: EcamMachine;

  constructor() {
    this.currentSelectedEcam = new EcamMachine("", "", 0, 0);
  }
  static getInstance() {
    if (ApplianceManager.sInstance == null) {
      ApplianceManager.sInstance = new ApplianceManager();
    }
    return ApplianceManager.sInstance;
  }

  getCurrentSelectedEcam() {
    return this.currentSelectedEcam;
  }
}
