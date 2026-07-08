export class Ahorcado {
  private palabraSecreta: string;
  private adivinadas: Set<string> = new Set();
  private errores: number = 0;
  private aviso: string = "";

  constructor(palabra: string) {
    this.palabraSecreta = palabra;
  }

  palabraEnmascarada(): string {
    if (this.haPerdido()) {
      return this.palabraSecreta.split("").join(" ");
    }

    return this.palabraSecreta
      .split("")
      .map((letra) => (this.adivinadas.has(letra.toUpperCase()) ? letra : "_"))
      .join(" ");
  }

  adivinar(letra: string): void {
    const letraMayus = letra.toUpperCase();

    if (letra === "1") {
    this.aviso = "Entrada inválida";
    return;
  }
  
    if (this.adivinadas.has(letraMayus)) {
      this.aviso = "Ya intentaste esa letra";
      return;
    }

    this.aviso = "";
    this.adivinadas.add(letraMayus);
    if (!this.palabraSecreta.includes(letraMayus)) {
      this.errores++;
    }
  }

  vidas(): number {
    return 6 - this.errores;
  }

  haGanado(): boolean {
    return !this.palabraEnmascarada().includes("_");
  }

  haPerdido(): boolean {
    return this.vidas() === 0;
  }

  mensajeInformativo(): string {
    return this.aviso;
  }
}