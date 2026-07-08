# language: es
Característica: Perder partida

  Escenario: El jugador comete 6 errores y pierde
    Dado una partida con la palabra "GATO"
    Cuando el jugador adivina la letra "Z"
    Y el jugador adivina la letra "X"
    Y el jugador adivina la letra "C"
    Y el jugador adivina la letra "V"
    Y el jugador adivina la letra "B"
    Y el jugador adivina la letra "N"
    Entonces se ve el mensaje "PERDISTE"
    Y se ve la palabra "G A T O"
    Y se ven 0 vidas