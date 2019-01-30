import dotenv from 'dotenv';
import mapValues from 'lodash/mapValues';

const getDotenvObj = (context) => {
  const config = dotenv.config(context);
  const envConfig = config.parsed;

  return mapValues(envConfig);
};


export default (context) => getDotenvObj(context);
