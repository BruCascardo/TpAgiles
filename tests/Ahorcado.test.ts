import { describe, it, expect } from "vitest";
import { Ahorcado } from "../src/domain/Ahorcado";

describe("Ahorcado", () => {
  it("muestra la palabra oculta con guiones bajos separados por espacios al iniciar", () => {
    const juego = new Ahorcado("GATO");
    expect(juego.palabraEnmascarada()).toBe("_ _ _ _");
  });

  it("inicia la partida con 6 vidas", () => {
  const juego = new Ahorcado("GATO");
  expect(juego.vidas()).toBe(6);
});

it("revela la letra acertada en la palabra enmascarada", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("A");
  expect(juego.palabraEnmascarada()).toBe("_ A _ _");
});
});
