import { Cafy } from "./classes";

(async function () {
  let app = new Cafy();
  app = await app.heathCheck();
})();
