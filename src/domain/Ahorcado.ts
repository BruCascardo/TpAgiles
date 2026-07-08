export class Ahorcado {
  private palabraSecreta: string;
  private adivinadas: Set<string> = new Set();
  private errores: number = 0; // Agregamos contador de errores
  private aviso: string = "";

  constructor(palabra: string) {
    this.palabraSecreta = palabra;
  }


  palabraEnmascarada(): string {
    if (this.haPerdido()) {
      return this.palabraSecreta.split('').join(' '); // Logica real
    }

    return this.palabraSecreta
      .split('')
      .map(letra => this.adivinadas.has(letra.toUpperCase()) ? letra : '_')
      .join(' ');
  }

adivinar(letra: string): void {
  const letraMayus = letra.toUpperCase();

  // Si ya la intentó, guardamos el aviso y cortamos acá (no restamos vida ni agregamos nada)
  if (this.adivinadas.has(letraMayus)) {
    this.aviso = "Ya intentaste esa letra";
    return; 
  }

  // Si es una letra nueva, limpiamos el aviso
  this.aviso = "";
  this.adivinadas.add(letraMayus);

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

mensajeInformativo(): string {
    return this.aviso;
  }

}