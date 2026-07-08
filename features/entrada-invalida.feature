# language: es
Característica: Entrada inválida

  Escenario: El jugador ingresa un carácter que no es una letra
    Dado una partida con la palabra "GATO"
    Cuando el jugador adivina la letra "1"
    Entonces se ve el mensaje "Entrada inválida"
    Y se ven 6 vidas