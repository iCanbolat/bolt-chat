import { model, Schema } from "mongoose";
import ISession from "../../interface/session/session.interface";

const sessionSchema = new Schema({
	sessionId: { type: String, required: true, unique: true },
	questions: [{ type: String }],
	answers: [{ type: String }],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});
const SessionModel = model<ISession>("User", sessionSchema);

export { SessionModel };
