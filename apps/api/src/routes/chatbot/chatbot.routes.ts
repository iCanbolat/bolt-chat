import { Router } from "express";
import { CreateNextQuestion, StartSession } from "../../controller/chatbot/chatbot.controller";

const ChatbotRouter = Router();

ChatbotRouter.post("/start-session", StartSession);
ChatbotRouter.post("/next-question", CreateNextQuestion);
ChatbotRouter.get("/", (req, res) => {
	res.status(200).send("Hello");
});

export { ChatbotRouter };
