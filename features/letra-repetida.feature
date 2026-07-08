# language: es
Característica: Letra repetida

  Escenario: El jugador ingresa una letra que ya intentó
    Dado una partida con la palabra "GATO"
    Cuando el jugador adivina la letra "E"
    Y el jugador adivina la letra "E"
    Entonces se ve el mensaje "Ya intentaste esa letra"
    Y se ven 5 vidas
    