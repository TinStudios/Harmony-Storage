require('dotenv').config();

const Joi = require('joi');

const schema = Joi.object({
  // NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  NODE_ENV: Joi.string().valid('production', 'development').required(),
  SVR_PORT: Joi.number().default(3001),
  STORAGE_API_KEY: Joi.string().required(),
})
  .unknown();

const { error, value } = schema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) console.error(error);

export default {
  env: value.NODE_ENV,
  server: {
    port: value.SVR_PORT,
    apiKey: value.STORAGE_API_KEY,
  },
};