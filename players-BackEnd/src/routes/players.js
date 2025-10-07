const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const player = require("../models/player");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const passport = require("passport");
const authenticateJWT = require("../middleware/authMiddleware");
const PlayerController = require("../controllers/player.controller");
const DocumentsController = require("../controllers/documents.controller");


// Filtrar jugador por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const playerData = await player.findByPk(id); //(id, { attributes: ['id', 'long_name'] }) puedo agregar este codigo para traer los atributos que yo necesite
    if (playerData) {
      res.status(200).json(playerData);
    } else {
      res.status(404).json({ error: "Jugador no encontrado" });
    }
  } catch (error) {
    console.error("Error al buscar el jugador:", error);
    res.status(500).json({ error: "Error al obtener el jugador" });
  }
});

//Filtrar jugador por nombre
//http://localhost:3000/api/players/name/Lionel%20Andr%C3%A9s%20Messi%20Cuccittini
router.get("/name/:name", [authenticateJWT], PlayerController.getPlayersByName);

//Descargar CSV Name
router.get("/name/:name/csv", DocumentsController.getPlayersByNameCsv);
  

//http://localhost:3000/api/players/club/FC%20Barcelona
//http://localhost:3000/api/players/club/talleres/23
//Filtrar jugador por club
router.get(
  "/club/:clubName/:version",
  [authenticateJWT],
  PlayerController.getPlayersByTeam
);

//Descargar CSV Name
router.get("/club/:clubName/:version/csv",[authenticateJWT], DocumentsController.getPlayersByTeamCsv);

//Filtrar por país
//http://localhost:3000/api/players/country/argentina/15
router.get("/country/:country/:version/", [authenticateJWT], PlayerController.getPlayersByCountry);

//Descargar CSV Country
router.get("/country/:country/:version/csv", [authenticateJWT], DocumentsController.getPlayersByCountryCsv);
// Filtrar por posición
//http://localhost:3000/api/players/position/cf
router.get("/position/:position", [authenticateJWT], PlayerController.getPlayersByPosition);

//Descargar CSV Posición
router.get("/position/:position/csv", [authenticateJWT], DocumentsController.getPlayersByPositionCsv);

// Filtrar por valoración
router.get("/overall/:overall", [authenticateJWT], PlayerController.getPlayersByOverall);

//Descargar CSV
router.get("/overall/:overall/csv",[authenticateJWT], DocumentsController.getPlayersByOverrallCsv);

//Buscar Jugador Unico
router.get("/name/:name/:season", [authenticateJWT], PlayerController.getOnePlayerByName);

// Actualizar un jugador
router.put("/:id", [authenticateJWT], PlayerController.putPlayerById);

// Crear un nuevo jugador
router.post("/", [authenticateJWT], PlayerController.postPlayerById);

// Eliminar un jugador
router.delete("/:id", [authenticateJWT], PlayerController.deletePlayerById);

module.exports = router;
