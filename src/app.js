import bodyParser from "body-parser";
import express from "express";
import clientRoutes from "./routes/clientRoute.js";



const app = express();
app.use(bodyParser.json());
app.use('/clients', clientRoutes);

export default app;