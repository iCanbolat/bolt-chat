import { Document } from "mongoose";

export interface ISession extends Document {
	sessionId: string;
	questions: string[];
	answers: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IStartSessionRequest {
  sessionId: string;
}

export interface INextQuestionRequest {
  sessionId: string;
  userResponse: string;
}

export interface IStartSessionResponse {
  question: string;
}

export interface INextQuestionResponse {
  question: string;
}
 
