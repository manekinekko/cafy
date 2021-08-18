process.env.DEBUG = "Cafy,noble";

const { fork } = require("child_process");
const express = require("express");
let cafyCLi;

const port = 8080;
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("machine-connect", () => {
    cafyCLi = fork("./examples/cli.js");
    cafyCLi
      .on("message", (data) => {
        console.log("Message from CLI", data);
        io.emit("machine-response", { data });

        if (data.deviceStatus === "DISCONNECTED") {
          cafyCLi.kill(0);
        }
      })
      .on("error", (error) => {
        console.log({ error });
      });

    cafyCLi.send({ command: "connect" });
  });

  socket.on("machine-disconnect", () => {
    if (cafyCLi && cafyCLi.connected) {
      cafyCLi.send({ command: "disconnect" });
    }
  });

  socket.on("machine-status", () => {
    if (cafyCLi && cafyCLi.connected) {
      cafyCLi.send({ command: "status" });
    }
  });
});

const expressServer = server.listen(port, "0.0.0.0", () => {
  console.log(
    `Cafy is running on port http://${expressServer.address().address}:${
      expressServer.address().port
    }/`
  );
});
