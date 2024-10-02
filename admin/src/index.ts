import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index';
import rabbitService from "./messageBroker";

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/admin', routes.adminRoutes);
app.use('/device', routes.deviceRoutes);

(async () => {
    await rabbitService.connect();
})()

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
