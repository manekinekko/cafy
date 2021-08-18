import { Cafy } from "./classes";

jest.spyOn(process, "exit").mockImplementation();

let app: Cafy;

afterAll(() => {
  app.disconnect();
});

test("App should initialize without errors", async () => {
  app = new Cafy({ name: "foo" });
  expect(app).toBeTruthy();
});
