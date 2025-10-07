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

  return player.findAll(query);
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
      [Op.and]: nameArr.map((name) => ({
        long_name: {
          [Op.like]: `%${name}%`,
        },
        fifa_version: fifaVersion,
      })),
    },
  };
  return player.findOne(query);
}

module.exports = {
  getPlayersByName,
  getPlayersFilteredTC,
  getPlayersFilteredPO,
  getOnePlayerByName,
};
