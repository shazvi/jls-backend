import express from 'express';
import * as dotenv from 'dotenv'
import {router} from "./router";
import {requestLogger} from "./middleware";
dotenv.config();

// App Variables
const port = parseInt(process.env.PORT as string, 10);
const app = express();

// App Configuration
app.use(requestLogger);
app.use(express.json());
app.use("/product", router);

// Server Activation
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
