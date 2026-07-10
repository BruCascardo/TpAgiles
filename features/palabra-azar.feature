# language: es
Característica: Palabra al azar

  Escenario: Iniciar partida sin especificar palabra en la URL
    Dado una partida nueva sin palabra especificada
    Entonces el juego tiene una palabra secreta oculta
    Y se ven 6 vidas