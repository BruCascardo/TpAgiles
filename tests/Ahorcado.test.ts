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

it("descuenta una vida cuando se adivina una letra incorrecta", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("E");
  expect(juego.vidas()).toBe(5);
});


it("revela la letra acertada en la palabra enmascarada", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("A");
  expect(juego.palabraEnmascarada()).toBe("_ A _ _");
});

it("no modifica la palabra enmascarada si la letra es incorrecta", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("E");
  expect(juego.palabraEnmascarada()).toBe("_ _ _ _");
});

it("detecta que el jugador ha ganado cuando adivina todas las letras", () => {
  const juego = new Ahorcado("GATO");
  expect(juego.haGanado()).toBe(false); // Al principio no ganó
  juego.adivinar("G");
  juego.adivinar("A");
  juego.adivinar("T");
  juego.adivinar("O");
  expect(juego.haGanado()).toBe(true); // Al adivinar todas, gana
});

it("detecta que el jugador perdio al quedarse sin vidas", () => {
  const juego = new Ahorcado("GATO");
  ["Z", "X", "C", "V", "B", "N"].forEach(letra => juego.adivinar(letra));
  expect(juego.haPerdido()).toBe(true);
});

it("revela la palabra GATO cuando el jugador pierde", () => {
  const juego = new Ahorcado("GATO");
  ["Z", "X", "C", "V", "B", "N"].forEach(letra => juego.adivinar(letra));
  expect(juego.palabraEnmascarada()).toBe("G A T O");
});

it("revela correctamente cualquier palabra al perder (ej: MESA)", () => {
  const juego = new Ahorcado("MESA");
  ["Z", "X", "C", "V", "B", "N"].forEach(letra => juego.adivinar(letra));
  expect(juego.palabraEnmascarada()).toBe("M E S A");
});

it("informa cuando se ingresa una letra previamente adivinada", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("A");
  juego.adivinar("A");
  expect(juego.mensajeInformativo()).toBe("Ya intentaste esa letra");
});

it("no penaliza con una vida extra si se repite una letra incorrecta, y limpia el aviso al intentar una nueva", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("E"); // Falla: 5 vidas
  juego.adivinar("E"); // Repite: 5 vidas, muestra aviso

  expect(juego.vidas()).toBe(5);
  expect(juego.mensajeInformativo()).toBe("Ya intentaste esa letra");

  juego.adivinar("I"); // Nueva falla: 4 vidas, limpia el aviso anterior
  expect(juego.vidas()).toBe(4);
  expect(juego.mensajeInformativo()).toBe("");
});

it("no resta vidas y avisa cuando se ingresa el numero 1", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("1");

  expect(juego.vidas()).toBe(6);
  expect(juego.mensajeInformativo()).toBe("Entrada inválida");
});

it("valida dinamicamente cualquier caracter que no sea una letra", () => {
  const juego = new Ahorcado("GATO");

  juego.adivinar("@");
  expect(juego.vidas()).toBe(6);
  expect(juego.mensajeInformativo()).toBe("Entrada inválida");

  juego.adivinar(" "); // Espacio vacío
  expect(juego.mensajeInformativo()).toBe("Entrada inválida");
});

it("devuelve 'cabeza' como parte del dibujo al cometer 1 error", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("Z");
  expect(juego.partesDibujo()).toEqual(["cabeza"]);
});

it("devuelve un arreglo progresivo de partes segun la cantidad de errores", () => {
  const juego = new Ahorcado("GATO");

  expect(juego.partesDibujo()).toEqual([]); // 0 errores = vacío

  juego.adivinar("Z"); // 1 error
  juego.adivinar("X"); // 2 errores
  expect(juego.partesDibujo()).toEqual(["cabeza", "cuerpo"]);

  ["C", "V", "B", "N"].forEach(letra => juego.adivinar(letra)); // 6 errores
  expect(juego.partesDibujo()).toEqual([
    "cabeza", "cuerpo", "brazo izquierdo", "brazo derecho", "pierna izquierda", "pierna derecha"
  ]);
});

it("devuelve la letra 'A' como usada luego de intentarla", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("A");
  expect(juego.letrasUsadas()).toContain("A");
});

});
