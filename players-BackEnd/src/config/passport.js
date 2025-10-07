const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const secret = "claveSecretaQueSoloElServerConoce";

module.exports = (passport) => {
  const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
  };

  passport.use(
    new JWTStrategy(opts, (jwtPayload, done) => {
      const usuario = {};

      const tokenNoEsValido = false;
      const usuarioNoExiste = !usuario;
      const passwordIncorrecto = false;

      if (tokenNoEsValido) {
        return done(null, false, { message: "El token no es válido" });
      }
      if (usuarioNoExiste) {
        return done(null, false, { message: "El usuario no existe" });
      }
      if (passwordIncorrecto) {
        return done(null, false, { message: "Autenticación inválida" });
      }

      return done(null, usuario);
    })
  );
};
