import { MongoClient, Db } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'app_database';

let db: Db;

export const connectToDatabase = async () => {
  if (db) return db;

  const client = new MongoClient(uri);

  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`Conectado a la base de datos: ${dbName}`);
    return db;
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    throw error;
  }
};

export const getDb = () => {
  if (!db) {
    throw new Error('No conectado a la base de datos');
  }
  return db;
};
