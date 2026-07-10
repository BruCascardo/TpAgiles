import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

Given(
  "una partida con la palabra {string}",
  async ({ page }, palabra: string) => {
    await page.goto(`/?word=${palabra}`);
  },
);

When(
  "el jugador adivina la letra {string}",
  async ({ page }, letra: string) => {
    const entrada = page.getByRole("textbox", { name: "Ingresar letra" });
    await entrada.fill(letra);
    await entrada.press("Enter");
  },
);

Then("se ve la palabra {string}", async ({ page }, esperada: string) => {
  await expect(page.getByTestId("word")).toHaveText(esperada);
});

Then("se ven {int} vidas", async ({ page }, vidas: number) => {
  await expect(page.getByTestId("lives")).toHaveText(String(vidas));
});

Then("se ve el mensaje {string}", async ({ page }, mensaje: string) => {
  await expect(page.getByTestId("mensaje")).toHaveText(mensaje);
});

Then("se ve la parte del dibujo {string}", async ({ page }, parte: string) => {
  await expect(page.getByTestId("dibujo")).toContainText(parte);
});

Then(
  "la tecla {string} aparece deshabilitada",
  async ({ page }, letra: string) => {
    // Buscamos el botón por su texto exacto y verificamos que esté deshabilitado
    const boton = page.getByRole("button", { name: letra, exact: true });
    await expect(boton).toBeDisabled();
  },
);

Given("una partida nueva sin palabra especificada", async ({ page }) => {
  // Entramos a la raíz sin parámetros en la URL
  await page.goto(`/`);
});

Then("el juego tiene una palabra secreta oculta", async ({ page }) => {
  // Verificamos que el contenedor de la palabra tenga guiones bajos
  await expect(page.getByTestId("word")).toContainText("_");
});
