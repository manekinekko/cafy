import { on, startScanningAsync, stopScanningAsync } from "@abandonware/noble";
const SERVICE = "00035b03-58e6-07dd-021a-08123a000300";
const CHARACTERISTIC = "00035b03-58e6-07dd-021a-08123a000301";
on("stateChange", async (state) => {
  console.log("on -> stateChange: ", { state });

  if (state === "poweredOn") {
    await startScanningAsync([SERVICE], false);
  } else {
    await stopScanningAsync();
  }
});

on("scanStart", function () {
  console.log("on -> scanStart");
});

on("scanStop", function () {
  console.log("on -> scanStop");
});

on("discover", async (peripheral) => {
  console.log("on -> discover: ", { peripheral });

  await stopScanningAsync();

  peripheral.on("connect", async () => {
    console.log("on -> connect");
    await peripheral.updateRssiAsync();
  });

  peripheral.on("disconnect", () => {
    console.log("on -> disconnect");
  });

  peripheral.on("rssiUpdate", async (rssi) => {
    console.log("on -> RSSI update ", { rssi });
    await peripheral.discoverServicesAsync();
  });

  peripheral.on("servicesDiscover", async (services) => {
    console.log("on -> peripheral services discovered ", { services });

    const serviceIndex = 0;

    services[serviceIndex].on(
      "includedServicesDiscover",
      (includedServiceUuids) => {
        console.log("on -> service included services discovered ", {
          includedServiceUuids,
        });
        services[serviceIndex].discoverCharacteristicsAsync();
      }
    );

    services[serviceIndex].on(
      "characteristicsDiscover",
      async (characteristics) => {
        console.log("on -> service characteristics discovered ", {
          characteristics,
        });

        const characteristicIndex = 0;

        characteristics[characteristicIndex].on(
          "read",
          async (data, isNotification) => {
            console.log("on -> characteristic read", { isNotification });
            console.log({ data });

            await peripheral.disconnectAsync();
          }
        );

        characteristics[characteristicIndex].on(
          "write",
          async (error: string) => {
            console.log("on -> characteristic write ");
            console.log("error?", { error });

            await peripheral.disconnectAsync();
          }
        );

        characteristics[characteristicIndex].on("broadcast", async (state) => {
          console.log("on -> characteristic broadcast " + state);

          await peripheral.disconnectAsync();
        });

        characteristics[characteristicIndex].on("notify", async (state) => {
          console.log("on -> characteristic notify ", { state });

          await peripheral.disconnectAsync();
        });

        characteristics[characteristicIndex].on(
          "descriptorsDiscover",
          async (descriptors) => {
            console.log("on -> descriptors discover ", { descriptors });

            const descriptorIndex = 0;

            descriptors[descriptorIndex].on("valueRead", async (data) => {
              console.log("on -> descriptor value read ", { data });
              await peripheral.disconnectAsync();
            });

            descriptors[descriptorIndex].on("valueWrite", async () => {
              console.log("on -> descriptor value write ");

              await peripheral.disconnectAsync();
            });

            await descriptors[descriptorIndex].readValueAsync();
          }
        );

        await characteristics[characteristicIndex].readAsync();
        await characteristics[characteristicIndex].writeAsync(
          Buffer.from(["0d05750fda25"]),
          true
        );
        await characteristics[characteristicIndex].notifyAsync(true);
        await characteristics[characteristicIndex].discoverDescriptorsAsync();
      }
    );

    await services[serviceIndex].discoverIncludedServicesAsync();
  });

  await peripheral.connectAsync();
});
