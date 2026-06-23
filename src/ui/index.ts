import { Ahorcado } from "../domain/Ahorcado";
import { mountApp } from "./main";

const params = new URLSearchParams(window.location.search);
const palabra = params.get("word") || "GATO";

const juego = new Ahorcado(palabra);
const appContainer = document.getElementById("app");

if (appContainer) {
  mountApp(appContainer, juego);
}
