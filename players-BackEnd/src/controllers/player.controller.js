const PlayerServices = require("../services/player.service");
const player = require("../models/player");


/**
 * Filtrar jugadores por nombres.
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getPlayersByName(req, res) {
  try {
    console.log('🔍 Búsqueda por nombre - Parámetros recibidos:', {
      query: req.query,
      headers: {
        authorization: req.headers.authorization ? 'Token presente' : 'Sin token'
      }
    });

    let playerName = req.query.name;
    if (!playerName) {
      console.log('❌ Error: Falta parámetro de nombre');
      return res.status(400).json({ error: "Falta el parámetro de nombre" });
    }

    // Establecer límite
    const limit = parseInt(req.query.limit, 10) || 15; // default 15 if not provided
    console.log('📊 Parámetros de búsqueda:', { playerName, limit });
    
    // Dividir nombre y convertir a minúsculas
    const nameTerms = playerName.toLowerCase().split(" ").filter(term => term.length > 0);
    
    if (nameTerms.length === 0) {
      console.log('❌ Error: Términos de búsqueda vacíos');
      return res.status(400).json({ error: "Nombre de búsqueda inválido" });
    }

    console.log('🔎 Buscando jugadores con términos:', nameTerms);
    const playersResult = await PlayerServices.getPlayersByName(nameTerms, limit);
    console.log('📋 Resultados encontrados:', playersResult?.length || 0);
  
    if (!playersResult?.length) {
      console.log('❌ No se encontraron resultados');
      return res.status(404).json({ 
        error: "No se encontraron jugadores con ese nombre",
        searchTerms: nameTerms
      });
    }

    console.log('✅ Enviando resultados exitosamente');
    res.status(200).json(playersResult);
  } catch (error) {
    console.error("Error al obtener jugadores por nombre:", error);
    res.status(500).json({
      error: `Error al obtener los jugadores del nombre: ${playerName}`,
    });
  }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function getPlayersByTeam(req, res) {
  const clubName = decodeURIComponent(req.params.clubName);
  const fifaVersion = decodeURIComponent(req.params.version);
  const limit = parseInt(req.query.limit, 10);
  
  if (!clubName) {
    return res.status(400).json({ error: "Falta el parámetro de club" });
  }
  if(!fifaVersion){
    return res.status(400).json({ error: "Falta el parámetro de fifa versión." });
  }

  try {
    const playerResult = await PlayerServices.getPlayersFilteredTC("club_name", clubName, fifaVersion, limit);
    
    if (!playerResult?.length) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }

    const playerNames = playerResult.map((player) => ({
      long_name: player.long_name,
      fifa_version: player.fifa_version,
      player_face_url: player.player_face_url ? encodeURI(player.player_face_url) : null,
      nationality_name: player.nationality_name,
      club_name: player.club_name,
      overall: player.overall,
      player_positions: player.player_positions,
      preferred_foot: player.preferred_foot,
      age: player.age
    }));
    res.status(200).json(playerNames);
    
  } catch (error) {
    console.error("Error al obtener jugadores por club:", error);
    res.status(500).json({ error: "Error al obtener los jugadores del club" });
  }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function getPlayersByCountry(req, res){
  const countryName = decodeURIComponent(req.params.country);
  const fifaVersion = decodeURIComponent(req.params.version);
  const limit = parseInt(req.query.limit, 10);

  if (!countryName) {
    return res.status(400).json({ error: "Falta el parámetro de país." });
  }
  if(!fifaVersion){
    return res.status(400).json({ error: "Falta el parámetro de fifa versión." });
  }
 
  try {
    const playerResult = await PlayerServices.getPlayersFilteredTC("nationality_name", countryName, fifaVersion, limit);

    if (!playerResult?.length) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }
    const playerNames = playerResult.map((player) => ({
      long_name: player.long_name,
      fifa_version: player.fifa_version,
      player_face_url: player.player_face_url ? encodeURI(player.player_face_url) : null,
      nationality_name: player.nationality_name,
      club_name: player.club_name,
      overall: player.overall,
      player_positions: player.player_positions,
      preferred_foot: player.preferred_foot,
      age: player.age,
    }));
    res.status(200).json(playerNames);
  } catch (error) {
    console.error("Error al obtener jugadores por país:", error);
    res.status(500).json({
      error: `Error al obtener los jugadores del país: ${countryName} `,
    });
  }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getPlayersByPosition(req, res){
  const playerPosition = req.params.position;
  const limit = parseInt(req.query.limit, 10);

  if (!playerPosition) {
    return res.status(400).json({ error: "Falta el parámetro de posición" });
  }

  try {
    const playerResult = await PlayerServices.getPlayersFilteredPO("player_positions", playerPosition, limit)
    if (!playerResult?.length) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }

    const players = playerResult.map((player) => ({
      long_name: player.long_name,
      fifa_version: player.fifa_version,
      player_face_url: player.player_face_url ? encodeURI(player.player_face_url) : null,
      nationality_name: player.nationality_name,
      club_name: player.club_name,
      overall: player.overall,
      player_positions: player.player_positions,
      preferred_foot: player.preferred_foot,
      age: player.age,
    }));

    res.status(200).json(players);
  } catch (error) {
    console.error("Error al obtener jugadores por posición:", error);
    res.status(500).json({
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
async function  getPlayersByOverall(req, res){
  const overall = decodeURIComponent(req.params.overall);
  const limit = parseInt(req.query.limit, 10);
  if (!overall) {
    return res.status(400).json({ error: "Falta el parámetro de posición." });
  }
  
  try {
    const playerResult = await PlayerServices.getPlayersFilteredPO("overall", overall, limit)
    if (!playerResult?.length) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }
    
    const playerNames = playerResult.map((player) => ({
      long_name: player.long_name,
      fifa_version: player.fifa_version,
     // player_face_url: player.player_face_url,
       player_face_url: player.player_face_url ? encodeURI(player.player_face_url) : null,
      nationality_name: player.nationality_name,
      club_name: player.club_name,
      overall: player.overall,
      player_positions: player.player_positions,
      preferred_foot: player.preferred_foot,
      age: player.age,
    }));
    res.status(200).json(playerNames);
  } catch (error) {
    console.error("Error al buscar la valoración:", error);
    res.status(500).json({ error: "Error al obtener el jugador" });
  }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getOnePlayerByName(req, res){
  console.log('🔍 One-Player Backend - Parámetros recibidos:', {
    name: req.params.name,
    season: req.params.season,
    headers: {
      authorization: req.headers.authorization ? 'Token presente' : 'Sin token'
    }
  });

  const playerName = decodeURIComponent(req.params.name);
  const fifaVersion = decodeURIComponent(req.params.season);

  if (!playerName) {
    console.log('❌ Error: Falta parámetro de nombre');
    return res.status(400).json({ error: "Falta el parámetro de nombre" });
  }

  if (!fifaVersion) {
    console.log('❌ Error: Falta parámetro de temporada');
    return res.status(400).json({ error: "Falta el parámetro de temporada" });
  }
  
  try {
    // Dividide el nombre en palabras clave y las convertimos a minúsculas
    const nameArr = playerName.toLowerCase().split(" ").filter(term => term.length > 0);
    console.log('🔎 Términos de búsqueda:', nameArr);

    const playerResult = await PlayerServices.getOnePlayerByName(nameArr, fifaVersion);
    console.log('📋 Resultado de la búsqueda:', playerResult);
    
    // findOne devuelve null si no encuentra nada, no un array vacío
    if (!playerResult) {
      console.log('❌ Jugador no encontrado');
      return res.status(404).json({ error: "Jugador no encontrado" });
    }

    // FindOne devuelve un solo objeto, no un array, así que lo convertimos a array
    const player = [playerResult];

    console.log('✅ Enviando jugador encontrado:', player[0].long_name);
    res.status(200).json(player);
  } catch (error) {
    console.error("❌ Error al obtener jugador por nombre:", error);
    res.status(500).json({
      error: `Error al obtener el jugador: ${playerName}`,
    });
  }

}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function putPlayerById(req, res){
  const id = req.params.id;

  try {
    const [updated] = await player.update(req.body, { where: { id } });
    if (updated) {
      const updatedPlayer = await player.findByPk(id);
      res.json(updatedPlayer);
    } else {
      res.status(404).json({ error: "Jugador no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el jugador:", error);
    res.status(400).json({ error: "Error al actualizar el jugador" });
  }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function postPlayerById(req, res){
  try {
    const {
      fifa_version = 15,
      fifa_update = 2,
      player_face_url = "foto",
      long_name,
      player_positions,
      club_name,
      nationality_name,
      overall,
      potential = 50,
      value_eur = 0,
      wage_eur = 0,
      age,
      height_cm = 175,
      weight_kg = 70,
      preferred_foot = "Unknown",
      weak_foot = 3,
      skill_moves = 3,
      international_reputation = 1,
      work_rate = "Medium/Medium",
      body_type = "Normal",
      pace = 50,
      shooting = 50,
      passing = 50,
      dribbling = 50,
      defending = 50,
      physic = 50,
      attacking_crossing = 50,
      attacking_finishing = 50,
      attacking_heading_accuracy = 50,
      attacking_short_passing = 50,
      attacking_volleys = 50,
      skill_dribbling = 50,
      skill_curve = 50,
      skill_fk_accuracy = 50,
      skill_long_passing = 50,
      skill_ball_control = 50,
      movement_acceleration = 50,
      movement_sprint_speed = 50,
      movement_agility = 50,
      movement_reactions = 50,
      movement_balance = 50,
      power_shot_power = 50,
      power_jumping = 50,
      power_stamina = 50,
      power_strength = 50,
      power_long_shots = 50,
      mentality_aggression = 50,
      mentality_interceptions = 50,
      mentality_positioning = 50,
      mentality_vision = 50,
      mentality_penalties = 50,
      mentality_composure = 50,
      defending_marking = 50,
      defending_standing_tackle = 50,
      defending_sliding_tackle = 50,
      goalkeeping_diving = 50,
      goalkeeping_handling = 50,
      goalkeeping_kicking = 50,
      goalkeeping_positioning = 50,
      goalkeeping_reflexes = 50,
      goalkeeping_speed = 50,
      player_traits = "None",
    } = req.body;

    const newPlayer = await player.create({
      fifa_version,
      fifa_update,
      player_face_url,
      long_name,
      player_positions,
      club_name,
      nationality_name,
      overall,
      potential,
      value_eur,
      wage_eur,
      age,
      height_cm,
      weight_kg,
      preferred_foot,
      weak_foot,
      skill_moves,
      international_reputation,
      work_rate,
      body_type,
      pace,
      shooting,
      passing,
      dribbling,
      defending,
      physic,
      attacking_crossing,
      attacking_finishing,
      attacking_heading_accuracy,
      attacking_short_passing,
      attacking_volleys,
      skill_dribbling,
      skill_curve,
      skill_fk_accuracy,
      skill_long_passing,
      skill_ball_control,
      movement_acceleration,
      movement_sprint_speed,
      movement_agility,
      movement_reactions,
      movement_balance,
      power_shot_power,
      power_jumping,
      power_stamina,
      power_strength,
      power_long_shots,
      mentality_aggression,
      mentality_interceptions,
      mentality_positioning,
      mentality_vision,
      mentality_penalties,
      mentality_composure,
      defending_marking,
      defending_standing_tackle,
      defending_sliding_tackle,
      goalkeeping_diving,
      goalkeeping_handling,
      goalkeeping_kicking,
      goalkeeping_positioning,
      goalkeeping_reflexes,
      goalkeeping_speed,
      player_traits,
    });

    res.status(200).json(newPlayer);
  } catch (error) {
    console.error("Error al crear el jugador:", error);
    res.status(400).json({ error: "Error al crear el jugador" });
  }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function deletePlayerById(req, res){
  const id = req.params.id;
  try {
    const deleted = await player.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(204).send();
      console.log("el usuario se borro correctamente");
    } else {
      res.status(404).json({ error: "Jugador no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el jugador" });
  }
}


module.exports = {
  getPlayersByName, 
  getPlayersByTeam,
  getPlayersByCountry,
  getPlayersByPosition,
  getPlayersByOverall,
  getOnePlayerByName,
  putPlayerById: async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
      console.log('Intentando actualizar jugador:', {
        id: id,
        updateData: updateData
      });

      // Verificar si el jugador existe
      const playerToUpdate = await player.findByPk(id);
      
      if (!playerToUpdate) {
        console.log('Jugador no encontrado:', id);
        return res.status(404).json({ 
          error: "Jugador no encontrado",
          details: `No se encontró un jugador con el ID: ${id}`
        });
      }

      // Validación de campos requeridos del frontend
      const requiredFields = ['long_name', 'nationality_name', 'club_name', 'player_positions'];
      const missingFields = requiredFields.filter(field => !updateData[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: "Datos inválidos",
          details: `Los siguientes campos son requeridos: ${missingFields.join(', ')}`
        });
      }

      // Validar overall y age
      const overall = Number(updateData.overall);
      const age = Number(updateData.age);

      if (isNaN(overall) || overall < 0 || overall > 100) {
        return res.status(400).json({
          error: "Datos inválidos",
          details: "La valoración debe ser un número entre 0 y 100"
        });
      }

      if (isNaN(age) || age < 16 || age > 60) {
        return res.status(400).json({
          error: "Datos inválidos",
          details: "La edad debe ser un número entre 16 y 60"
        });
      }

      // Preparar datos para actualizar
      const updatePayload = {
        // Mantener los campos requeridos del modelo que no se actualizan
        fifa_version: playerToUpdate.fifa_version,
        fifa_update: playerToUpdate.fifa_update,
        player_face_url: playerToUpdate.player_face_url,
        // Campos actualizables
        long_name: updateData.long_name,
        nationality_name: updateData.nationality_name,
        club_name: updateData.club_name,
        player_positions: updateData.player_positions,
        overall: overall,
        age: age,
        // Mantener otros campos no actualizados
        potential: playerToUpdate.potential,
        value_eur: playerToUpdate.value_eur,
        wage_eur: playerToUpdate.wage_eur,
        height_cm: playerToUpdate.height_cm,
        weight_kg: playerToUpdate.weight_kg,
        preferred_foot: playerToUpdate.preferred_foot,
        weak_foot: playerToUpdate.weak_foot,
        skill_moves: playerToUpdate.skill_moves,
        international_reputation: playerToUpdate.international_reputation,
        work_rate: playerToUpdate.work_rate,
        body_type: playerToUpdate.body_type
      };

      // Actualizar el jugador
      await playerToUpdate.update(updatePayload);

      console.log('Jugador actualizado exitosamente:', {
        id: id,
        newData: updatePayload
      });

      // Obtener el jugador actualizado para retornar
      const updatedPlayer = await player.findByPk(id);

      res.status(200).json({
        message: "Jugador actualizado exitosamente",
        player: updatedPlayer
      });

    } catch (error) {
      console.error("Error al actualizar el jugador:", error);
      // Mejorar el manejo de errores específicos
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          error: "Error de validación",
          details: error.errors.map(e => e.message).join(', ')
        });
      }
      res.status(500).json({
        error: "Error al actualizar el jugador",
        details: error.message || 'Error interno del servidor'
      });
    }
  },
  postPlayerById, 
  deletePlayerById
};
