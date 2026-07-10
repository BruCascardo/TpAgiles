import { Ahorcado } from "../domain/Ahorcado";
import { mountApp } from "./main";

const params = new URLSearchParams(window.location.search);

const diccionario = ["ALGORITMO", "TYPESCRIPT", "COMPUTADORA", "INTERNET", "PROGRAMACION", "DESARROLLO"];
const palabra = params.get("word") || Ahorcado.elegirPalabraAleatoria(diccionario);

// Leemos la dificultad de la URL, por defecto será medio
const dificultad = params.get("dificultad") || "medio";

// Instanciamos inyectando ambas dependencias
const juego = new Ahorcado(palabra, dificultad);
const appContainer = document.getElementById("app");

if (appContainer) {
  mountApp(appContainer, juego);
}