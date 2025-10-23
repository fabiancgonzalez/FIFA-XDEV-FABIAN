const player = require("../models/player");
const { Op } = require("sequelize");

/**
 * Obtener jugadores por nombre desde la BD.
 * @param {*} playerName
 * @param {*} amount
 */
async function getPlayersByName(playerName, amount) {
  const query = {
    where: {
      [Op.and]: playerName.map((term) => ({
        long_name: { [Op.like]: `%${term}%` },
      })),
    },
    limit: amount,
  };

  console.log('🗄️ Consulta SQL generada:', {
    playerName,
    amount,
    query: JSON.stringify(query, null, 2)
  });

  const result = await player.findAll(query);
  console.log('📊 Resultados de la consulta:', result?.length || 0);
  
  return result;
}
/**
 *
 * @param {*} playerAttribute
 * @param {*} playerValue
 * @param {*} fifaVersion
 * @param {*} amount
 * @returns
 */
async function getPlayersFilteredTC(
  playerAttribute,
  playerValue,
  fifaVersion,
  amount
) {
  const query = {
    where: {
      [playerAttribute]: {
        [Op.like]: `%${playerValue}%`,
      },
      fifa_version: fifaVersion,
    },
    limit: amount,
  };
  return player.findAll(query);
}
/**
 *
 * @param {*} playerAttribute
 * @param {*} playerValue
 * @param {*} amount
 * @returns
 */
async function getPlayersFilteredPO(playerAttribute, playerValue, amount) {
  const query = {
    where: { [playerAttribute]: playerValue },
    limit: amount,
  };
  return player.findAll(query);
}

/**
 *
 * @param {*} nameArr
 * @param {*} fifaVersion
 * @returns
 */

async function getOnePlayerByName(nameArr, fifaVersion) {
  const query = {
    where: {
      [Op.and]: [
        // Condiciones para el nombre (cada término debe estar presente)
        ...nameArr.map((name) => ({
          long_name: {
            [Op.like]: `%${name}%`,
          }
        })),
        // Condición para la versión FIFA (solo una vez)
        {
          fifa_version: fifaVersion,
        }
      ]
    },
  };

  console.log('🗄️ One-Player - Consulta SQL generada:', {
    nameArr,
    fifaVersion,
    query: JSON.stringify(query, null, 2)
  });

  const result = await player.findOne(query);
  console.log('📊 One-Player - Resultado:', result ? `Encontrado: ${result.long_name}` : 'No encontrado');
  
  return result;
}

module.exports = {
  getPlayersByName,
  getPlayersFilteredTC,
  getPlayersFilteredPO,
  getOnePlayerByName,
};
