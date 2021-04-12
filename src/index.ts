import { Cafy, DeviceOptions } from "./classes";

let cafyInstance: Cafy | null = null;
export function cafy(options?: DeviceOptions) {
  if (!cafyInstance) {
    cafyInstance = new Cafy(options);
  }
  return cafyInstance;
}
export { commands } from "./commands";
