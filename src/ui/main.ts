import { Ahorcado } from "../domain/Ahorcado";
import "./styles.css";

// --- Tema (solo visual, no toca la lógica del juego) ---------------------
type Tema = "light" | "dark";

let temaActual: Tema =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";

document.documentElement.setAttribute("data-theme", temaActual);

function aplicarTema(): void {
  document.documentElement.setAttribute("data-theme", temaActual);
  const boton = document.getElementById("theme-toggle");
  if (boton) {
    boton.textContent = temaActual === "dark" ? "🌙" : "☀️";
    boton.setAttribute(
      "aria-label",
      temaActual === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro",
    );
  }
}

// --- Fondo decorativo (blobs + grano) -------------------------------------
// Se monta UNA sola vez, fuera del contenedor que se re-renderiza en cada
// jugada, para que sus animaciones no se corten/reinicien todo el tiempo.
function montarFondo(): void {
  if (document.getElementById("fondo-decorativo")) return;

  const fondo = document.createElement("div");
  fondo.id = "fondo-decorativo";
  fondo.className = "bg-blobs";
  fondo.setAttribute("aria-hidden", "true");
  fondo.innerHTML = `
    <span class="blob blob-1"></span>
    <span class="blob blob-2"></span>
    <span class="blob blob-3"></span>
    <span class="grano"></span>
  `;
  document.body.prepend(fondo);
}

montarFondo();

// --- Estado auxiliar solo de presentación (no es estado del juego) -------
// Estas variables no alteran ninguna regla: solo permiten decidir qué
// animación mostrar en el próximo render (p. ej. "solo animar la tecla que
// se acaba de tocar" en vez de recrear todas las teclas con animación).
let entradaAnimada = false;
let vidasPrevias: number | null = null;
let letraRecienIntentada: string | null = null;

function crearConfetti(): string {
  const colores = ["var(--accent)", "var(--correct)", "var(--gold)"];
  let piezas = "";
  for (let i = 0; i < 24; i++) {
    const izquierda = (Math.random() * 100).toFixed(1);
    const retraso = (Math.random() * 0.5).toFixed(2);
    const duracion = (1.8 + Math.random() * 1.2).toFixed(2);
    const color = colores[i % colores.length];
    const rotacion = Math.floor(Math.random() * 360);
    piezas += `<span class="confetti-pieza" style="left:${izquierda}%; animation-delay:${retraso}s; animation-duration:${duracion}s; background:${color}; --rot:${rotacion}deg;"></span>`;
  }
  return `<div class="confetti-contenedor" aria-hidden="true">${piezas}</div>`;
}

function dibujarAhorcado(partes: string[]): string {
  const tiene = (parte: string) => partes.includes(parte);

  return `
    <svg viewBox="0 0 200 250" width="200" height="250" class="ahorcado-svg">
      <line x1="20" y1="230" x2="120" y2="230" stroke="#333" stroke-width="4" />
      <line x1="50" y1="230" x2="50" y2="20" stroke="#333" stroke-width="4" />
      <line x1="50" y1="20" x2="140" y2="20" stroke="#333" stroke-width="4" />
      <line x1="140" y1="20" x2="140" y2="45" stroke="#333" stroke-width="4" />

      ${tiene("cabeza") ? `<circle cx="140" cy="60" r="15" stroke="#333" stroke-width="3" fill="none" />` : ""}
      ${tiene("cuerpo") ? `<line x1="140" y1="75" x2="140" y2="140" stroke="#333" stroke-width="3" />` : ""}
      ${tiene("brazo izquierdo") ? `<line x1="140" y1="90" x2="115" y2="120" stroke="#333" stroke-width="3" />` : ""}
      ${tiene("brazo derecho") ? `<line x1="140" y1="90" x2="165" y2="120" stroke="#333" stroke-width="3" />` : ""}
      ${tiene("pierna izquierda") ? `<line x1="140" y1="140" x2="115" y2="180" stroke="#333" stroke-width="3" />` : ""}
      ${tiene("pierna derecha") ? `<line x1="140" y1="140" x2="165" y2="180" stroke="#333" stroke-width="3" />` : ""}
    </svg>
    <span class="sr-only">${partes.join(", ")}</span>
  `;
}

export function mountApp(container: HTMLElement, juego: Ahorcado): void {
  let mensaje = juego.mensajeInformativo();
  if (juego.haGanado()) mensaje = "GANASTE";
  if (juego.haPerdido()) mensaje = "PERDISTE";
  const juegoTerminado = juego.haGanado() || juego.haPerdido();
  const usadas = juego.letrasUsadas();

  // Derivado únicamente de palabraEnmascarada() (ya pública) para
  // clasificar visualmente las teclas como correctas/incorrectas.
  // No agrega reglas de juego nuevas.
  const letrasReveladas = new Set(
    juego.palabraEnmascarada().split(" ").filter((c) => c !== "_"),
  );

  // Clase de tamaño según longitud de palabra, para que siempre entre
  // completa en el panel (sin cortarse ni desbordar).
  const longitudPalabra = juego.palabraEnmascarada().replace(/\s/g, "").length;
  let claseLongitud = "word-lg";
  if (longitudPalabra > 9) claseLongitud = "word-sm";
  else if (longitudPalabra > 6) claseLongitud = "word-md";

  // Detecta si esta jugada restó una vida, solo para disparar una
  // animación puntual (no cambia ninguna regla del juego).
  const vidasActuales = juego.vidas();
  const vidaPerdida = vidasPrevias !== null && vidasActuales < vidasPrevias;
  vidasPrevias = vidasActuales;

  const abecedario = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
  const tecladoHTML = abecedario
    .map((letra) => {
      const deshabilitada =
        usadas.includes(letra) || juegoTerminado ? "disabled" : "";

      let clases = "tecla";
      if (usadas.includes(letra)) {
        const esCorrecta = letrasReveladas.has(letra);
        clases += esCorrecta ? " correcta" : " incorrecta";
        // La animación (flash/shake) solo se aplica a la tecla que se
        // acaba de presionar, no a todas las que ya estaban usadas.
        if (letra === letraRecienIntentada) {
          clases += esCorrecta ? " flash-correcta" : " flash-incorrecta";
        }
      }

      return `<button class="${clases}" type="button" data-letra="${letra}" ${deshabilitada}>${letra}</button>`;
    })
    .join("");

  const claseEntrada = entradaAnimada ? "" : "entrada";
  entradaAnimada = true;

  let claseEstado = "";
  if (juego.haGanado()) claseEstado = "estado-ganaste";
  if (juego.haPerdido()) claseEstado = "estado-perdiste";

  let claseResultado = "";
  if (juego.haGanado()) claseResultado = "ganaste";
  if (juego.haPerdido()) claseResultado = "perdiste";

  container.innerHTML = `
    <div class="game-container ${claseEntrada} ${claseEstado}">
      ${juego.haGanado() ? crearConfetti() : ""}
      <div class="game-header">
        <h1>Ahorcado</h1>
        <button type="button" id="theme-toggle" class="theme-toggle" aria-label="Cambiar tema">🌙</button>
      </div>
      <p class="subtitle">Adiviná la palabra antes de quedarte sin vidas</p>
      <form class="entrada-form" data-testid="entrada-form">
        <label for="entrada-letra">Ingresar letra</label>
        <input
          id="entrada-letra"
          name="letra"
          type="text"
          maxlength="1"
          autocomplete="off"
          ${juegoTerminado ? "disabled" : ""}
        />
      </form>
      <div class="word-display ${claseLongitud}" data-testid="word">${juego.palabraEnmascarada()}</div>
      <div class="lives-display ${vidaPerdida ? "vida-perdida" : ""}">Vidas: <span data-testid="lives">${juego.vidas()}</span></div>
      <div class="resultado ${claseResultado}">
        <div data-testid="mensaje" class="mensaje">${mensaje}</div>
      </div>
      <div data-testid="dibujo" class="dibujo-container">
        ${dibujarAhorcado(juego.partesDibujo())}
      </div>
      <div class="teclado-container" data-testid="teclado">
        ${tecladoHTML}
      </div>
    </div>
  `;

  aplicarTema();

  const botonTema = container.querySelector<HTMLButtonElement>("#theme-toggle");
  botonTema?.addEventListener("click", () => {
    temaActual = temaActual === "dark" ? "light" : "dark";
    aplicarTema();
  });

  const entrada = container.querySelector<HTMLInputElement>("#entrada-letra");
  entrada?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    const letra = entrada.value;

    if (!juegoTerminado) {
      letraRecienIntentada = letra.toUpperCase();
      juego.adivinar(letra);
      mountApp(container, juego);
    }
  });

  const teclas = container.querySelectorAll(".tecla");
  teclas.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const letra = (e.target as HTMLButtonElement).dataset.letra;
      if (letra && !juegoTerminado) {
        letraRecienIntentada = letra;
        juego.adivinar(letra);
        mountApp(container, juego);
      }
    });
  });

  // Mantiene el foco en el input entre jugadas para que escribir letras
  // sea fluido y no se sienta como si la página se recargara.
  if (!juegoTerminado) {
    entrada?.focus();
  }
}
