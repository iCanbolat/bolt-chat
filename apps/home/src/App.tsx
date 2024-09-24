import ChatWidget from "./components/chat-widget";

const App = () => {
	return (
		<div className="bg-slate-900 h-screen">
			<div className="bg-gradient-to-b from-violet-600/[.15] via-transparent">
				<div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24 h-screen space-y-10">
					<div className="mt-5 max-w-3xl text-center mx-auto">
						<h1 className="block font-black bg-clip-text bg-gradient-to-tl from-blue-500 to-violet-600 text-transparent text-7xl">
							ChatBo(l)t
						</h1>
					</div>

					<ChatWidget />
				</div>
			</div>
		</div>
	);
};

export default App;
