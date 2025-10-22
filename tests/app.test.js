import { greet } from "../src/app.js";

test("greet retorna el nom", () => {
  expect(greet("Món")).toBe("Hola Món");
});
