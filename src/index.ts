import { App } from "./classes/App";

(async function () {
  const app = new App();
  await app.initialize();
  await app.heathCheck();
  await app.machineStatus();

  process.on("SIGINT", async () => {
    await app.stopProcess();
  });
})();
