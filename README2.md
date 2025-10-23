Proyecto Fifa Players
(FIFA-XDEV-FABIAN)
SE PUEDE VER LA APLICACION FUNCIONANDO EN: https://youtu.be/Av6aoYnSdf4
Descripción del Proyecto
Este proyecto es un sistema CRUD que permite gestionar jugadores desde una base de datos llamada fifa_local. Está desarrollado con Angular para el frontend y Node.js con Express para el backend. Se utiliza MySQL como base de datos relacional, y Sequelize como ORM para manejar las consultas a la base de datos. Además, se incluye autenticación mediante JWT.
________________________________________
Funcionalidades Principales
•	Crear: Añadir nuevos jugadores a la base de datos.
•	Leer: Listar y buscar jugadores con opciones de filtrado.
•	Actualizar: Modificar la información de un jugador existente.
•	Eliminar: Borrar jugadores de la base de datos.
•	Autenticación: Inicio de sesión y protección de rutas mediante JWT y Passport.
________________________________________
Tecnologías Utilizadas
Backend:
•	Node.js: Entorno de ejecución para el servidor.
•	Express.js: Framework minimalista para la creación de aplicaciones web.
•	MySQL: Base de datos relacional para almacenar la información de los jugadores.
•	Sequelize: ORM para interactuar con la base de datos MySQL.
•	Nodemon: Herramienta para reiniciar automáticamente el servidor durante el desarrollo.
•	JWT: Autenticación basada en tokens.
•	Passport: Middleware de autenticación.
•	XLSX: Biblioteca para la manipulación y creación de archivos Excel en el backend, permitiendo la exportación de datos de jugadores a formatos de hoja de cálculo.
Frontend:
•	Angular: Framework para construir la interfaz de usuario.
•	HTML y CSS: Para el diseño de la interfaz de usuario.
•	Font Awesome: Utilizado para un solo icono en la aplicación.
•	Angular Forms: Para manejar formularios reactivos.
•	Chart.js: Biblioteca para la visualización de datos, utilizada para crear gráficos y representar estadísticas sobre los jugadores de manera interactiva.
________________________________________

Estructura del Proyecto
Backend
•	Express para la creación de rutas y middleware.
•	Sequelize para manejar consultas a la base de datos.
•	JWT y Passport para la autenticación.
Frontend
•	Angular con el módulo AppModule configurado con componentes como FiltrosComponent, OnePlayerComponent, EditPlayerComponent, entre otros.
•	Angular Forms para manejar los formularios de creación y edición de jugadores.
•	AuthGuard para proteger rutas en el frontend.

________________________________________
Como correr el proyecto

•	Tener Node.js y npm instalados.
•	Tener Angular CLI instalado globalmente.
•	Usar XAMPP y arrancar el servidor Apache y Mysql.
•	Crear una base de datos MySQL con los archivos ".sql" adjuntos en la carpeta playersbackend/src/database  con el nombre     "   "fifa_local.sql".
•	Utilizar el comando "npm install" para instalar dependencias.
•	Utilizar el comando “npm run dev” dentro de la carpeta players-backend.
•	Utilzar el comando “ng serve –o” dentro de la carpeta players-frontend.
•   Para inciar sesión usaremos el usuario: "fabian" y la contraseña: "xdevfabian"
•	Para utilizar postman debemos primero loguearnos con “POST”en "http://localhost:3000/auth/login"
 este nos devolverá un token que debemos copiar y utilizar en cada endpoint.
 Debemos ingresar a “Authorization” [->Auth Type -> Bearer Token]  e ingresar Token.

SE PUEDE VER LA APLICACION FUNCIONANDO EN: https://youtu.be/Av6aoYnSdf4
