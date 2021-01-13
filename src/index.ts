import { Cafy } from "./classes";
import { tap } from "rxjs/operators";

(async function () {
  let cafy = new Cafy();
  cafy
    .connect()
    .pipe(tap(async (device) => await cafy.machineStatus()))
    .subscribe();
})();
