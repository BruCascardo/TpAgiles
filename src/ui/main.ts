import { Ahorcado } from "../domain/Ahorcado";

export function mountApp(container: HTMLElement, juego: Ahorcado): void {
  container.innerHTML = `
    <div class="game-container">
      <h1>Ahorcado</h1>
      <div class="word-display" data-testid="word">${juego.palabraEnmascarada()}</div>
      <div class="lives-display">Vidas: <span data-testid="lives">${juego.vidas()}</span></div>
      <form id="guess-form" class="guess-form">
        <input type="text" maxlength="1" placeholder="Ingresa una letra" autofocus />
        <button type="submit">Intentar</button>
      </form>
    </div>
  `;

  const form = container.querySelector("#guess-form") as HTMLFormElement;
  const input = container.querySelector("input") as HTMLInputElement;

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const letra = input.value.trim();
    if (letra) {
      juego.adivinar(letra);
      mountApp(container, juego);
    }
  });
}
