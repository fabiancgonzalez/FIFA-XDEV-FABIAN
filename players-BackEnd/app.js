// app.js
const express = require('express');
const cors = require('cors') //es para habilitar que el puerto 4200 pueda acceder al puerto 3000
const player = require('./src/models/player');
const app = express();
const playerRoutes = require('./src/routes/players');
const passport = require('passport');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/auth');

require('./src/config/passport')(passport);

app.use(cors())
app.use(express.json());
app.use('/api/players', playerRoutes);
app.use('/auth', authRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor corriendo en el puerto:.. ${PORT}`);
});
