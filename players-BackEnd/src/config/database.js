const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const dbConfig = {
    database: 'fifa_local',
    username: 'root',
    password: '',
    host: 'localhost'
};

// Función para asegurar que la base de datos existe
async function ensureDatabase() {
    try {
        // Crear conexión sin seleccionar una base de datos
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.username,
            password: dbConfig.password
        });

        // Intentar crear la base de datos si no existe
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database};`);
        console.log('✅ Base de datos verificada/creada con éxito');
        await connection.end();
    } catch (error) {
        console.error('❌ Error al verificar/crear la base de datos:', error);
        throw error;
    }
}

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'mysql',
    logging: (msg) => console.log('Sequelize:', msg),
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const initDB = async () => {
    try {
        // Asegurar que la base de datos existe
        await ensureDatabase();

        // Verificar la conexión
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida con éxito.');
        
        // Sincronizar los modelos con la base de datos
        // No alteramos las tablas existentes y no forzamos recreación
        await sequelize.sync({ force: false, alter: false });
        console.log('✅ Modelos sincronizados con la base de datos.');
    } catch (error) {
        console.error('❌ Error detallado:', {
            message: error.message,
            code: error.original?.code,
            sqlState: error.original?.sqlState,
            sqlMessage: error.original?.sqlMessage
        });
        throw error;
    }
};

// Inicializar la base de datos
initDB().catch(console.error);

module.exports = sequelize;