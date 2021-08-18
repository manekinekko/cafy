import { Utils } from "./Utils";

afterAll(() => {});

test("App should initialize without errors", async () => {
  const crc16 = Utils.checksum(new Int8Array([0, 1, 2])).toString(16);

  expect(crc16).toBe("cc9c");
});
