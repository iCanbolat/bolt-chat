import { Document } from "mongoose";

interface ISession extends Document {
	sessionId: string;
	questions: string[];
	answers: string[];
	createdAt: Date;
	updatedAt: Date;
}

export default ISession;
