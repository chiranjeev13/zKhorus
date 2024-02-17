import express from 'express';
import Cors from 'cors';
import mongoose from 'mongoose';
import aiRoutes from "./routes/aiRoutes"
import proposalRoutes from "./routes/proposalRoutes"
import userRoutes from "./routes/userRoutes"

//dotenv to load env bbg..
require('dotenv').config()


//app setup bbg ...
const app = express();
const port = 8001;
const connection_url = process.env.MONGODB_URL;

// middleware here bbg..
app.use(express.json());
app.use(Cors());

// DB Config bbg...
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as any);


//Endpoint go here bbg ..
app.use("/api/ai", aiRoutes)
app.use("/api/proposal", proposalRoutes)
app.use("/api/user", userRoutes)


// listen for logs bbg.
app.listen(port, () => {
    console.log(`Server started. Listening to port - ${port}`);
});
