export class Ahorcado {
  private palabraSecreta: string;
  private adivinadas: Set<string> = new Set();

  constructor(palabra: string) {
    this.palabraSecreta = palabra;
  }

  adivinar(letra: string): void {
    this.adivinadas.add(letra.toUpperCase());
  }

  palabraEnmascarada(): string {
    return this.palabraSecreta
      .split('')
      .map(letra => this.adivinadas.has(letra.toUpperCase()) ? letra : '_')
      .join(' ');
  }

  vidas(): number {
    // Se implementará a partir de los tests unitarios
    return 6;
  }

  
}