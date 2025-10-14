Challenge XAcademy
Requerimientos
Desarrollar una aplicación web para gestionar un listado de jugadores de FIFA utilizando Node.js en
el backend y Angular en el frontend. La aplicación se conectará a una base de datos que contiene
información sobre jugadores de fútbol (de ambos géneros) con sus habilidades correspondientes.
Los datos abarcan versiones de FIFA desde 2015 hasta 2023, lo que implica que es posible que un
jugador aparezca en varias versiones del juego, con variaciones en su edad, versión del juego y
habilidades.
Funcionalidades Requeridas:
1. Listado de jugadores:
○ Crear endpoint y pantalla que devuelva un listado de los jugadores paginados y
filtrado por nombre, club, o posición, etc.
○ Implementar la posibilidad de descargar el listado filtrado en formato CSV ( Hint:
xlsx).
2. Obtener información de un solo jugador:
○ Crear endpoint y pantalla que devuelva los detalles de un jugador específico, dado
su ID e implementar algun grafico para mostrar sus skills Hint: pueden utilizar
Chart.js Radar Chart)
3. Editar la información de un jugador:
○ Crear endpoint y pantalla que permita modificar la información de un jugador
(nombre, posición, club, calificación, nacionalidad y sus skills).
4. Create a vos como jugador:
○ Crear un endpoint que te permita crear un jugador, crear uno con tu nombre y las
skills que quieras.
5. Crear Login:
○ Crear un Login para solo ver la info de forma autenticada
○ Los endpoints del back no deben dar información si no estás logueado
Detalles Técnicos:
● El backend debe estar construido en Node.js y utilizar Sequelize como ORM.
● El frontend debe estar construido en Angular.
● Utilizar MySQL como base de datos.
● La aplicación debe incluir validaciones tanto en el frontend como en el backend. Hint:
Utilizar reactive forms de Angular y express-validator o class-validator en Node.js)
