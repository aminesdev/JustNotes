import app from "./app.js";
import dotenv from "dotenv";
import { connectDb } from "./config/database.js";

dotenv.config();
connectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
