import { App } from "./classes";

jest.spyOn(process, "exit").mockImplementation();

let app: App;

afterAll(() => {
  app.disconnect();
});

test("App should initialize without errors", async () => {
  app = new App();
  expect(app).toBeTruthy();
});
