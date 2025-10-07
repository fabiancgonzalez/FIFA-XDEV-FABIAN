// manejar los cvs
const player = require("../models/player");
const PlayerServices = require("../services/player.service");
const XLSX = require("xlsx");
const { Op } = require("sequelize");
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getPlayersByNameCsv(req, res) {
  let playerName = decodeURIComponent(req.params.name);

  try {
    playerName = playerName.toLowerCase().split(" ");
    cantidad = 6;
    const playerResult = await PlayerServices.getPlayersByName(
      playerName,
      cantidad
    );

    const players = playerResult.map((player) => player.get({ plain: true }));

    // Convertir los datos en formato de hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(players);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");

    // Crear un buffer para el archivo CSV
    const csvBuffer = XLSX.write(workbook, { bookType: "csv", type: "buffer" });

    // Establecer encabezados para la descarga
    res.setHeader("Content-Disposition", "attachment; filename=jugadores.csv");
    res.setHeader("Content-Type", "text/csv");

    // Enviar el buffer como respuesta
    return res.send(csvBuffer);
  } catch (error) {
    console.error("Error al obtener jugadores por nombre:", error);
    return res.status(500).json({
      error: `Error al obtener los jugadores del nombre: ${playerName}`,
    });
  }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getPlayersByTeamCsv(req, res) {
  const clubName = decodeURIComponent(req.params.clubName);
  const fifaVersion = decodeURIComponent(req.params.version);

  try {
    const playerResult = await PlayerServices.getPlayersFilteredTC(
      "club_name",
      clubName,
      fifaVersion
    );
    const players = playerResult.map((player) => player.get({ plain: true }));

    const worksheet = XLSX.utils.json_to_sheet(players);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");

    const csvBuffer = XLSX.write(workbook, { bookType: "csv", type: "buffer" });

    res.setHeader("Content-Disposition", "attachment; filename=jugadores.csv");
    res.setHeader("Content-Type", "text/csv");

    return res.send(csvBuffer);
  } catch (error) {
    console.error("Error al obtener jugadores por nombre:", error);
    return res.status(500).json({
      error: `Error al obtener los jugadores del nombre: ${playerName}`,
    });
  }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getPlayersByCountryCsv(req, res) {
  const countryName = decodeURIComponent(req.params.country);
  const fifaVersion = decodeURIComponent(req.params.version);

  try {
    const playerResult = await PlayerServices.getPlayersFilteredTC(
      "nationality_name",
      countryName,
      fifaVersion
    );

    const players = playerResult.map((player) => player.get({ plain: true }));

    const worksheet = XLSX.utils.json_to_sheet(players);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");

    const csvBuffer = XLSX.write(workbook, { bookType: "csv", type: "buffer" });

    res.setHeader("Content-Disposition", "attachment; filename=jugadores.csv");
    res.setHeader("Content-Type", "text/csv");

    return res.send(csvBuffer);
  } catch (error) {
    console.error("Error al obtener jugadores por nombre:", error);
    return res.status(500).json({
      error: `Error al obtener los jugadores del nombre: ${playerName}`,
    });
  }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getPlayersByPositionCsv(req, res) {
  const playerPosition = req.params.position;

  try {
    const playerResult = await PlayerServices.getPlayersFilteredPO(
      "player_positions",
      playerPosition
    );

    if (playerResult.length === 0) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }

    const players = playerResult.map((player) => player.get({ plain: true }));

    const worksheet = XLSX.utils.json_to_sheet(players);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");

    const csvBuffer = XLSX.write(workbook, { bookType: "csv", type: "buffer" });

    res.setHeader("Content-Disposition", "attachment; filename=jugadores.csv");
    res.setHeader("Content-Type", "text/csv");

    return res.send(csvBuffer);
  } catch (error) {
    console.error("Error al obtener jugadores por nombre:", error);
    return res.status(500).json({
      error: `Error al obtener los jugadores del nombre: ${playerName}`,
    });
  }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getPlayersByOverrallCsv(req, res) {
  const overall = decodeURIComponent(req.params.overall);

  try {
    const playerResult = await PlayerServices.getPlayersFilteredPO(
      "overall",
      overall
    );
    const players = playerResult.map((player) => player.get({ plain: true }));

    // Convertir los datos en formato de hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(players);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");

    const csvBuffer = XLSX.write(workbook, { bookType: "csv", type: "buffer" });

    res.setHeader("Content-Disposition", "attachment; filename=jugadores.csv");
    res.setHeader("Content-Type", "text/csv");

    return res.send(csvBuffer);
  } catch (error) {
    console.error("Error al obtener jugadores por nombre:", error);
    return res.status(500).json({
      error: `Error al obtener los jugadores del nombre: ${playerName}`,
    });
  }
}

module.exports = {
  getPlayersByNameCsv,
  getPlayersByTeamCsv,
  getPlayersByCountryCsv,
  getPlayersByPositionCsv,
  getPlayersByOverrallCsv,
};
