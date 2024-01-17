import express from 'express';
import dotenv from 'dotenv';
import authController from './routes/auth/controllers/index';
import cors from "cors"
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.post('/api/auth/register', authController.createUser)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export {
  app
}