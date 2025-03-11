import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_URI);

try {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('Database connection successful');
} catch (error) {
  console.error('Database connection error: ', error);
  process.exit(1);
}

export default sequelize;
