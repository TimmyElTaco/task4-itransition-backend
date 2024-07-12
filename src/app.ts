import express from 'express';
import authRoutes from './routes/authRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import cors from "cors"


const app = express();
const port = 3000;
app.use(express.json());

app.use(cors());

app.use('/auth', authRoutes);
app.use('/', userRoutes);

app.listen(port, () => {
    return console.log(`Server is running at http://localhost:${port}`);
});