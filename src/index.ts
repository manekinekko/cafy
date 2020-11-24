import { App } from "./classes";

(async function () {
  let app = new App();
  app = await app.heathCheck();
})();
