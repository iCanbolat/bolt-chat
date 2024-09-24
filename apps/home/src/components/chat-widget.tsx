import React, { useState } from "react";

const ChatWidget: React.FC = () => {
	const [messages, setMessages] = useState<{ role: string; text: string }[]>([
		{
			role: "bot",
			text: "Welcome! Let’s talk about cats. What is your favorite breed of cat, and why?"
		}
	]);
	const [input, setInput] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [previousAnswers, setPreviousAnswers] = useState<string[]>([]); // To keep track of user responses

	const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!input.trim()) return;

		setMessages((prev) => [...prev, { role: "user", text: input }]);

		setPreviousAnswers((prev) => [...prev, input]);
		setInput("");

    //fetch next question
	};

	return (
		<>
			<div className="w-full max-w-md bg-white rounded-lg shadow-lg flex flex-col mx-auto">
				<div
					className="flex-1 p-4 overflow-y-auto"
					style={{ maxHeight: "500px" }}
				>
					{messages.map((message, index) => (
						<div
							key={index}
							className={`mb-2 ${
								message.role === "bot"
									? "text-left"
									: "text-right"
							}`}
						>
							<div
								className={`inline-block p-2 rounded-lg ${
									message.role === "bot"
										? "bg-gray-200"
										: "bg-blue-500 text-white"
								}`}
							>
								{message.text}
							</div>
						</div>
					))}
				</div>

				<form
					onSubmit={handleSendMessage}
					className="flex items-center border-t border-gray-200 p-2"
				>
					<input
						type="text"
						className="flex-1 bg-gray-100 rounded-lg px-4 py-2 focus:outline-none"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type your answer..."
						disabled={loading}
					/>
					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-blue-600"
						disabled={loading}
					>
						{loading ? "..." : "Send"}
					</button>
				</form>
			</div>
		</>
	);
};

export default ChatWidget;
