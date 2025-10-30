import { greet } from "../src/lib/greet.ts";

test("greet retorna el nom", () => {
  expect(greet("Món")).toBe("Hola Món");
});
