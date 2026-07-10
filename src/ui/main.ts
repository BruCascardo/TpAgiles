import { Ahorcado } from "../domain/Ahorcado";

function dibujarAhorcado(partes: string[]): string {
  const tiene = (parte: string) => partes.includes(parte);

  return `
    <svg viewBox="0 0 200 250" width="200" height="250" class="ahorcado-svg">
      <!-- Horca (siempre visible) -->
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

  container.innerHTML = `
    <div class="game-container">
      <h1>Ahorcado</h1>
      <div class="word-display" data-testid="word">${juego.palabraEnmascarada()}</div>
      <div class="lives-display">Vidas: <span data-testid="lives">${juego.vidas()}</span></div>
      <div data-testid="mensaje" class="mensaje">${mensaje}</div>
      <div data-testid="dibujo" class="dibujo-container">
        ${dibujarAhorcado(juego.partesDibujo())}
      </div>
      <form id="guess-form" class="guess-form">
        <input type="text" maxlength="1" placeholder="Ingresa una letra" autofocus ${juegoTerminado ? 'disabled' : ''} />
        <button type="submit" ${juegoTerminado ? 'disabled' : ''}>Intentar</button>
      </form>
    </div>
  `;

  const form = container.querySelector("#guess-form") as HTMLFormElement;
  const input = container.querySelector("input") as HTMLInputElement;
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const letra = input.value.trim();
    if (letra && !juegoTerminado) {
      juego.adivinar(letra);
      mountApp(container, juego);
    }
  });
}
