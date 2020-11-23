import { App } from "./classes/App";

(async function () {
  let app = new App();
  // await app.heathCheck();
  // await app.machineStatus();
  app = await app.sync();
})();
