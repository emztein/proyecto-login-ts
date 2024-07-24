import * as Joi from 'joi';

//definir schema de validacion usando Joi
const envSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
}).options({ allowUnknown: true });;

//validar las variables de entorno
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Configuracion de variables de entorno invalida: ${error.message}`)
}

export const CONFIG = {
  JWT: envVars.JWT_SECRET,
  PORT: envVars.PORT,
  URI: envVars.URI,
  dbName: envVars.DBNAME
}
