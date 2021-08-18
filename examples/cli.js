process.env.DEBUG = "Cafy,noble";

const { cafy } = require("../dist");
const cafyInstance = cafy({ name: "D1900942" });

process.on("message", async (data) => {
  console.log("Message from server:", data);

  switch (data.command) {
    case "status":
      cafyInstance.status$().subscribe((deviceStatus) => {
        process.send({ deviceStatus });
      });
      break;
    case "connect":
      const deviceInfo = await cafyInstance.connect();
      process.send({ deviceInfo });
      process.send({ deviceStatus: "CONNECTED" });
      break;

    case "disconnect":
      await cafyInstance.disconnect();
      process.send({ deviceStatus: "DISCONNECTED" });
      break;
  }
});

process.on("exit", async () => {
  await cafyInstance.disconnect();
});
