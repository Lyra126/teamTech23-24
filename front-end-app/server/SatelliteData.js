import * as dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import satelliteRouter from './routes/Satellite.routes.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req,res) => {
    res.send({message: 'Hello World'});
})

app.use('/api/satellite', satelliteRouter);

const startServer = async () => {
    try{
        connectDB(process.env.MONGO_URL);
        app.listen(8080, () => console.log('Server started on port http://localhost:8080'));
    } catch (error){
        console.log(error);
    }
}

startServer();

