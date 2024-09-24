//#region Import
import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";

// Router
import { UserRouter } from "../routes/user/user.routes";

//#endregion

//#region Configuration

// Const variable
const App: Express = express();

// Compress Bundle
App.use(compression());

// Middle for protection in vulnerabilities
App.use(helmet());

// Use cors
App.use(cors());

// Parse incoming request with json payload
App.use(express.json());

// Get the json payload with Content-Type header
// Preventing to get undefined value in request
App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());

// Run Cron
// cronStart();

//#endregion

//#region Routes Config

// For checking if the api is working
App.get("/", (req, res) => {
	res.status(200).send("Hello");
});



// Users
App.use("/api/user", UserRouter);


//#endregion

export default App;
