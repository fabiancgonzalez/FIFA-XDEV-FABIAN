const {Sequelize} =require('sequelize')
//parametros de conexion a la db
const sequelize = new Sequelize('fifa_local', 'root', '',{
    host:'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
.then(()=>{
    console.log('Conexión exitosa');
})
.catch(error =>{
    console.log("La conexión fallo: " + error)
});

module.exports = {sequelize};