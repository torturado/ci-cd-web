import { greet } from "../src/app.ts";

test("greet retorna el nom", () => {
  expect(greet("Món")).toBe("Hola Món");
});
