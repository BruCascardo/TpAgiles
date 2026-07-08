export class Ahorcado {
  private palabraSecreta: string;
  private adivinadas: Set<string> = new Set();
  private errores: number = 0; // Agregamos contador de errores

  constructor(palabra: string) {
    this.palabraSecreta = palabra;
  }


  palabraEnmascarada(): string {
    return this.palabraSecreta
      .split('')
      .map(letra => this.adivinadas.has(letra.toUpperCase()) ? letra : '_')
      .join(' ');
  }

  adivinar(letra: string): void {
    const letraMayus = letra.toUpperCase();
    this.adivinadas.add(letraMayus);

    // Si la palabra no incluye la letra, sumamos un error
    if (!this.palabraSecreta.includes(letraMayus)) {
      this.errores++;
    }
  }

  vidas(): number {
    return 6 - this.errores; // Calculamos las vidas restantes
  }

  // Agregar este método a la clase Ahorcado
  haGanado(): boolean {
    return !this.palabraEnmascarada().includes('_');
  }
  
  haPerdido(): boolean {
  return this.vidas() === 0;
}
  
}