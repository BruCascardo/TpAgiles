import { Ahorcado } from "../domain/Ahorcado";
import { mountApp, aplicarTema, alternarTema, botonTemaHTML } from "./main";

const appContainer = document.getElementById("app");
const params = new URLSearchParams(window.location.search);
const palabraParam = params.get("word");

const diccionario = ["ALGORITMO", "TYPESCRIPT", "COMPUTADORA", "INTERNET", "PROGRAMACION", "DESARROLLO"];

function iniciarJuego(container: HTMLElement, palabra: string, dificultad: string): void {
  const juego = new Ahorcado(palabra, dificultad);
  mountApp(container, juego);
}

// Muestra el menú de inicio (dificultad). Solo aparece cuando la URL
// no trae un parámetro "word" (es decir, no viene de un AT viejo).
function mountMenu(container: HTMLElement): void {
  container.innerHTML = `
    <div class="menu-container">
      ${botonTemaHTML()}
      <h1>Bienvenido al Ahorcado</h1>
      <p>Selecciona la dificultad:</p>
      <div class="menu-opciones">
        <button class="menu-opcion" data-testid="btn-nivel-facil" data-nivel="facil">
          <span class="menu-opcion-icono" aria-hidden="true">🟢</span>
          Fácil (8 vidas)
        </button>
        <button class="menu-opcion" data-testid="btn-nivel-medio" data-nivel="medio">
          <span class="menu-opcion-icono" aria-hidden="true">🟡</span>
          Medio (6 vidas)
        </button>
        <button class="menu-opcion" data-testid="btn-nivel-dificil" data-nivel="dificil">
          <span class="menu-opcion-icono" aria-hidden="true">🔴</span>
          Difícil (4 vidas)
        </button>
      </div>
    </div>
  `;

  aplicarTema();

  const botonTema = container.querySelector<HTMLButtonElement>("#theme-toggle");
  botonTema?.addEventListener("click", alternarTema);

  const botonesNivel = container.querySelectorAll<HTMLButtonElement>("[data-nivel]");
  botonesNivel.forEach((boton) => {
    boton.addEventListener("click", () => {
      const dificultad = boton.dataset.nivel || "medio";
      const palabra = Ahorcado.elegirPalabraAleatoria(diccionario);
      iniciarJuego(container, palabra, dificultad);
    });
  });
}

if (appContainer) {
  if (palabraParam) {
    // Comportamiento de los ATs viejos: si hay ?word= en la URL, se salta
    // el menú y arranca el juego directo (con o sin ?dificultad=).
    const dificultad = params.get("dificultad") || "medio";
    iniciarJuego(appContainer, palabraParam, dificultad);
  } else {
    // AT nuevo: URL limpia -> se muestra el menú de dificultad.
    mountMenu(appContainer);
  }
}