export class Ahorcado {
  private palabraSecreta: string;

  constructor(palabra: string) {
    this.palabraSecreta = palabra;
  }

  adivinar(letra: string): void {
    // Se implementará a partir de los tests unitarios
  }

  palabraEnmascarada(): string {
    // Se implementará a partir de los tests unitarios
    return "";
  }

  vidas(): number {
    // Se implementará a partir de los tests unitarios
    return 6;
  }
}
