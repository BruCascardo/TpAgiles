# language: es
Característica: Dibujo progresivo del ahorcado

  Escenario: Fallar una letra muestra la primera parte del muñeco
    Dado una partida con la palabra "GATO"
    Cuando el jugador adivina la letra "Z"
    Entonces se ve la parte del dibujo "cabeza"