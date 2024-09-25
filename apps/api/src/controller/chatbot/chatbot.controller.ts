import { Request, Response } from "express";
import { SingleApiResponse } from "../../helpers/response.helper";
import * as dotenv from "dotenv";
import { SessionModel } from "../../models/session/session.models";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
	INextQuestionRequest,
	IStartSessionRequest
} from "../../interface/session/session.interface";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * @name StartSession
 * @description Function to create a new session and ask the first question.
 */
const StartSession = async (
  req: Request<{}, {}, IStartSessionRequest>,
  res: Response
): Promise<Response> => {
  try {
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Start chatbot session." }] }
      ]
    });

    const result = await chat.sendMessage(
      "Generate a cat-related question."
    );
    const firstQuestion = result.response.text();

    const session = new SessionModel({
      sessionId: req.body.sessionId,
      questions: [firstQuestion],
      responses: []  
    });
    await session.save();

    return res.status(200).json(
      SingleApiResponse({
        success: true,
        data: { question: firstQuestion },
        statusCode: 200
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      SingleApiResponse({
        success: false,
        data: null,
        statusCode: 500
      })
    );
  }
};

/**
 * @name CreateNextQuestion
 * @description Function to generate a new question based on user input and save the response.
 */
const CreateNextQuestion = async (
  req: Request<{}, {}, INextQuestionRequest>,
  res: Response
): Promise<Response> => {
  try {
    const { sessionId, userResponse } = req.body;

    const session = await SessionModel.findOne({ sessionId });
    if (!session) {
      return res.status(404).json(
        SingleApiResponse({
          success: false,
          data: "Session not found",
          statusCode: 404
        })
      );
    }

    session.answers.push(userResponse);

    // Build the chat history, ensuring the first role is 'user' because GeminiAI says that
    const history = [];
    for (let i = 0; i < session.questions.length; i++) {
      history.push({ role: "user", parts: [{ text: session.questions[i] }] }); 
      if (i < session.answers.length) {
        history.push({ role: "model", parts: [{ text: session.answers[i] }] });  
      }
    }

    history.push({ role: "user", parts: [{ text: userResponse }] });

    const chat = model.startChat({ history });

    const result = await chat.sendMessage(
      "Based on the user's response, generate the next relevant question or statement."
    );
    const nextQuestion = result.response.text();

    session.questions.push(nextQuestion);
    await session.save();

    return res.status(200).json(
      SingleApiResponse({
        success: true,
        data: { question: nextQuestion },
        statusCode: 200
      })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      SingleApiResponse({
        success: false,
        data: null,
        statusCode: 500
      })
    );
  }
};


export { CreateNextQuestion, StartSession };
