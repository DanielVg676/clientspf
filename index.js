import app from "./src/app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000; // Usa PORT de Railway, con 3000 como fallback
const HOST = "0.0.0.0"; // Necesario para Railway

app.listen(PORT, HOST, () => {
    console.log(`Servicio escuchando en http://${HOST}:${PORT}`);
});
