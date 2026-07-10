import { Ahorcado } from "../domain/Ahorcado";
import { mountApp } from "./main";

const params = new URLSearchParams(window.location.search);

// Definimos nuestro diccionario
const diccionario = ["ALGORITMO", "TYPESCRIPT", "COMPUTADORA", "INTERNET", "PROGRAMACION", "DESARROLLO"];

// Si viene por URL la usamos (útil para el resto de los ATs deterministas)
// Si no, elegimos una al azar usando el método de dominio (sin pasar el seam, usa Math.random)
const palabra = params.get("word") || Ahorcado.elegirPalabraAleatoria(diccionario);

const juego = new Ahorcado(palabra);
const appContainer = document.getElementById("app");

if (appContainer) {
  mountApp(appContainer, juego);
}