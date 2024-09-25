import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FiSend } from "react-icons/fi";
import {
	ChatMessage,
	NextQuestionResponse,
	StartSessionResponse
} from "../types";

const ChatWidget: React.FC = () => {
	const [sessionId] = useState<string>("session_" + Date.now());
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [botLoading, setBotLoading] = useState<boolean>(false); // Loading state for model's response

	const lastMessageEnd = useRef<HTMLDivElement>(null);

	useEffect(() => {
		lastMessageEnd.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleStartSession = async () => {
		setLoading(true);
		try {
			const response = await axios.post<StartSessionResponse>(
				import.meta.env.VITE_API_URL + "chatbot/start-session",
				{ sessionId }
			);

			setMessages([
				...messages,
				{ role: "model", text: response.data.data.question }
			]);
		} catch (error) {
			console.error("Error starting session:", error);
		}
		setLoading(false);
	};

	const handleSendMessage = async () => {
		if (!input.trim()) return;

		const userMessage: ChatMessage = { role: "user", text: input };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");

		setBotLoading(true);
		try {
			const response = await axios.post<NextQuestionResponse>(
				import.meta.env.VITE_API_URL + "chatbot/next-question",
				{
					sessionId,
					userResponse: userMessage.text
				}
			);

			setMessages((prev) => [
				...prev,
				{ role: "model", text: response.data.data.question }
			]);
		} catch (error) {
			console.error("Error sending message:", error);
		} finally {
			setBotLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSendMessage();
		}
	};

	return (
		<div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
			<div className="space-y-4 mb-8 max-h-72 overflow-auto">
				{messages.length === 0 && (
					<div className="text-center">
						<p className="text-2xl">👋</p>
						<p className="text-xl">Chatbot via GeminiAPI</p>
						<p className="text-base">
							Generates question about cats
						</p>
					</div>
				)}
				{messages.map((message, index) => (
					<div
						key={index}
						className={`flex ${
							message.role === "model"
								? "justify-start"
								: "justify-end"
						} `}
					>
						<div
							className={`${
								message.role === "model"
									? "bg-gray-300 text-black"
									: "bg-blue-500 text-white"
							} p-3 rounded-lg max-w-xs`}
						>
							<span className="block"></span>
							<span>{message.text}</span>
						</div>
					</div>
				))}

				{botLoading && (
					<div className="flex justify-start">
						<div className="  text-black ml-3 rounded-lg w-fit">
							<div className="flex items-center justify-center space-x-2 animate-bounce">
								<div className="h-4 w-4 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
								<div className="h-4 w-4 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
								<div className="h-4 w-4 bg-gray-400 rounded-full animate-bounce"></div>
							</div>
						</div>
					</div>
				)}
				<div ref={lastMessageEnd} />
			</div>

			<div className="relative w-full">
				<input
					type="text"
					disabled={messages.length === 0 || loading || botLoading}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					className="w-full p-2 border border-gray-300 rounded-md pr-10"
					placeholder="Type a message..."
				/>
				<button
					onClick={handleSendMessage}
					disabled={messages.length === 0 || loading || botLoading}
					className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500"
				>
					<FiSend size={20} />
				</button>
			</div>

			{messages.length === 0 && (
				<button
					onClick={handleStartSession}
					className="bg-green-500 text-white p-2 rounded-md w-full"
					disabled={loading}
				>
					{loading ? (
						<div className="flex justify-center items-center">
							<svg
								className="animate-spin h-5 w-5 mr-3 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
								></path>
							</svg>
							Loading...
						</div>
					) : (
						<>Start Chat</>
					)}
				</button>
			)}
		</div>
	);
};

export default ChatWidget;
