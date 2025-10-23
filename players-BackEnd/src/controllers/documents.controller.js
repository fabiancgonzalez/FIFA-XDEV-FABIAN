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
  console.log('🗂️ CSV por nombre - Parámetros recibidos:', {
    query: req.query,
    params: req.params
  });

  let playerName = req.query.name || req.params.name;
  
  if (!playerName) {
    console.error('❌ Falta parámetro name');
    return res.status(400).json({ error: "Falta el parámetro de nombre" });
  }

  try {
    playerName = decodeURIComponent(playerName);
    console.log('🔍 Buscando jugadores para CSV:', playerName);
    
    const nameTerms = playerName.toLowerCase().split(" ").filter(term => term.length > 0);
    const cantidad = parseInt(req.query.limit, 10) || 50; // Permitir más registros para CSV
    const playerResult = await PlayerServices.getPlayersByName(
      nameTerms,
      cantidad
    );

    console.log('📊 Jugadores encontrados para CSV:', playerResult?.length || 0);

    if (!playerResult || playerResult.length === 0) {
      console.warn('⚠️ No se encontraron jugadores para CSV');
      return res.status(404).json({ 
        error: "No se encontraron jugadores con ese nombre",
        searchTerms: nameTerms
      });
    }

    const players = playerResult.map((player) => player.get({ plain: true }));

    // Seleccionar solo los campos más importantes para el CSV
    const playersFiltered = players.map(player => ({
      Nombre: player.long_name || '',
      Version: player.fifa_version || '',
      Nacionalidad: player.nationality_name || '',
      Club: player.club_name || '',
      Valoracion: player.overall || '',
      Posicion: player.player_positions || '',
      Edad: player.age || '',
      Pie: player.preferred_foot || '',
      Valor: player.value_eur || '',
      Salario: player.wage_eur || ''
    }));

    console.log('📝 Generando CSV con', playersFiltered.length, 'jugadores');

    // Convertir los datos en formato de hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(playersFiltered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");

    // Crear un buffer para el archivo CSV con codificación UTF-8
    const csvBuffer = XLSX.write(workbook, { 
      bookType: "csv", 
      type: "buffer",
      codepage: 65001 // UTF-8
    });

    // Establecer encabezados para la descarga con codificación UTF-8
    res.setHeader("Content-Disposition", "attachment; filename*=UTF-8''jugadores.csv");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");

    console.log('📤 Enviando CSV de', csvBuffer.length, 'bytes');

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

  console.log('🗂️ CSV por club - Parámetros:', { clubName, fifaVersion });

  if (!clubName || !fifaVersion) {
    return res.status(400).json({ error: "Faltan parámetros de club o versión" });
  }

  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const playerResult = await PlayerServices.getPlayersFilteredTC(
      "club_name",
      clubName,
      fifaVersion,
      limit
    );

    console.log('📊 Jugadores encontrados para CSV por club:', playerResult?.length || 0);

    if (!playerResult || playerResult.length === 0) {
      return res.status(404).json({ 
        error: "No se encontraron jugadores para este club y versión" 
      });
    }

    const players = playerResult.map((player) => player.get({ plain: true }));

    // Filtrar campos importantes
    const playersFiltered = players.map(player => ({
      Nombre: player.long_name || '',
      Version: player.fifa_version || '',
      Nacionalidad: player.nationality_name || '',
      Club: player.club_name || '',
      Valoracion: player.overall || '',
      Posicion: player.player_positions || '',
      Edad: player.age || '',
      Pie: player.preferred_foot || '',
      Valor: player.value_eur || '',
      Salario: player.wage_eur || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(playersFiltered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");

    const csvBuffer = XLSX.write(workbook, { 
      bookType: "csv", 
      type: "buffer",
      codepage: 65001 
    });

    res.setHeader("Content-Disposition", "attachment; filename*=UTF-8''jugadores_club.csv");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");

    console.log('📤 Enviando CSV por club de', csvBuffer.length, 'bytes');
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

  console.log('🔍 Descarga CSV por país:', { countryName, fifaVersion });

  try {
    const playerResult = await PlayerServices.getPlayersFilteredTC(
      "nationality_name",
      countryName,
      fifaVersion
    );

    if (!playerResult || playerResult.length === 0) {
      console.log('❌ No se encontraron jugadores para país:', countryName);
      return res.status(404).json({ error: "No se encontraron jugadores para este país" });
    }

    console.log('✅ Encontrados', playerResult.length, 'jugadores');

    const players = playerResult.map((player) => player.get({ plain: true }));

    // Filtrar campos para CSV más limpio
    const playersFiltered = players.map(player => ({
      Nombre: player.short_name,
      'Nombre Completo': player.long_name,
      País: player.nationality_name,
      Club: player.club_name,
      Liga: player.league_name,
      Posición: player.player_positions,
      Edad: player.age,
      'Overall': player.overall,
      'Potencial': player.potential,
      'Pie Preferido': player.preferred_foot,
      'Versión FIFA': player.fifa_version
    }));

    const worksheet = XLSX.utils.json_to_sheet(playersFiltered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");

    const csvBuffer = XLSX.write(workbook, { 
      bookType: "csv", 
      type: "buffer",
      codepage: 65001 
    });

    res.setHeader("Content-Disposition", "attachment; filename*=UTF-8''jugadores_pais.csv");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");

    console.log('📤 Enviando CSV por país de', csvBuffer.length, 'bytes');
    return res.send(csvBuffer);
  } catch (error) {
    console.error("Error al obtener jugadores por país:", error);
    return res.status(500).json({
      error: `Error al obtener los jugadores del país: ${countryName}`,
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

  console.log('🔍 Descarga CSV por posición:', { playerPosition });

  try {
    const playerResult = await PlayerServices.getPlayersFilteredPO(
      "player_positions",
      playerPosition
    );

    if (!playerResult || playerResult.length === 0) {
      console.log('❌ No se encontraron jugadores para posición:', playerPosition);
      return res.status(404).json({ error: "No se encontraron jugadores para esta posición" });
    }

    console.log('✅ Encontrados', playerResult.length, 'jugadores');

    const players = playerResult.map((player) => player.get({ plain: true }));

    // Filtrar campos para CSV más limpio
    const playersFiltered = players.map(player => ({
      Nombre: player.short_name,
      'Nombre Completo': player.long_name,
      País: player.nationality_name,
      Club: player.club_name,
      Liga: player.league_name,
      Posición: player.player_positions,
      Edad: player.age,
      'Overall': player.overall,
      'Potencial': player.potential,
      'Pie Preferido': player.preferred_foot,
      'Versión FIFA': player.fifa_version
    }));

    const worksheet = XLSX.utils.json_to_sheet(playersFiltered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");

    const csvBuffer = XLSX.write(workbook, { 
      bookType: "csv", 
      type: "buffer",
      codepage: 65001 
    });

    res.setHeader("Content-Disposition", "attachment; filename*=UTF-8''jugadores_posicion.csv");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");

    console.log('📤 Enviando CSV por posición de', csvBuffer.length, 'bytes');
    return res.send(csvBuffer);
  } catch (error) {
    console.error("Error al obtener jugadores por posición:", error);
    return res.status(500).json({
      error: `Error al obtener los jugadores de la posición: ${playerPosition}`,
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

  console.log('🔍 Descarga CSV por overall:', { overall });

  try {
    const playerResult = await PlayerServices.getPlayersFilteredPO(
      "overall",
      overall
    );

    if (!playerResult || playerResult.length === 0) {
      console.log('❌ No se encontraron jugadores con overall:', overall);
      return res.status(404).json({ error: "No se encontraron jugadores con este overall" });
    }

    console.log('✅ Encontrados', playerResult.length, 'jugadores');

    const players = playerResult.map((player) => player.get({ plain: true }));

    // Filtrar campos para CSV más limpio
    const playersFiltered = players.map(player => ({
      Nombre: player.short_name,
      'Nombre Completo': player.long_name,
      País: player.nationality_name,
      Club: player.club_name,
      Liga: player.league_name,
      Posición: player.player_positions,
      Edad: player.age,
      'Overall': player.overall,
      'Potencial': player.potential,
      'Pie Preferido': player.preferred_foot,
      'Versión FIFA': player.fifa_version
    }));

    const worksheet = XLSX.utils.json_to_sheet(playersFiltered);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");

    const csvBuffer = XLSX.write(workbook, { 
      bookType: "csv", 
      type: "buffer",
      codepage: 65001 
    });

    res.setHeader("Content-Disposition", "attachment; filename*=UTF-8''jugadores_overall.csv");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");

    console.log('📤 Enviando CSV por overall de', csvBuffer.length, 'bytes');
    return res.send(csvBuffer);
  } catch (error) {
    console.error("Error al obtener jugadores por overall:", error);
    return res.status(500).json({
      error: `Error al obtener los jugadores con overall: ${overall}`,
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
