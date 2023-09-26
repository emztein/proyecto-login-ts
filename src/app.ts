import express from 'express';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(express.json());
app.use(authRoutes);

app.listen(3001)
console.log('server on port 3001 ...')
