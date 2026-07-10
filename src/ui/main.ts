import { Ahorcado } from "../domain/Ahorcado";

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

  const abecedario = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
  const tecladoHTML = abecedario
    .map((letra) => {
      const deshabilitada =
        usadas.includes(letra) || juegoTerminado ? "disabled" : "";
      return `<button class="tecla" type="button" data-letra="${letra}" ${deshabilitada}>${letra}</button>`;
    })
    .join("");

  container.innerHTML = `
    <div class="game-container">
      <h1>Ahorcado</h1>
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
      <div class="word-display" data-testid="word">${juego.palabraEnmascarada()}</div>
      <div class="lives-display">Vidas: <span data-testid="lives">${juego.vidas()}</span></div>
      <div data-testid="mensaje" class="mensaje">${mensaje}</div>
      <div data-testid="dibujo" class="dibujo-container">
        ${dibujarAhorcado(juego.partesDibujo())}
      </div>
      <div class="teclado-container" data-testid="teclado">
        ${tecladoHTML}
      </div>
    </div>
  `;

  const entrada = container.querySelector<HTMLInputElement>("#entrada-letra");
  entrada?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    const letra = entrada.value;

    if (!juegoTerminado) {
      juego.adivinar(letra);
      mountApp(container, juego);
    }
  });

  const teclas = container.querySelectorAll(".tecla");
  teclas.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const letra = (e.target as HTMLButtonElement).dataset.letra;
      if (letra && !juegoTerminado) {
        juego.adivinar(letra);
        mountApp(container, juego);
      }
    });
  });
}
