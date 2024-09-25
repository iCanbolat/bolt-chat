export interface ChatMessage {
	role: "user" | "model";
	text: string;
}

export interface StartSessionResponse {
	data: {
		question: string;
	};
}

export interface NextQuestionResponse {
	data: {
		question: string;
	};
}