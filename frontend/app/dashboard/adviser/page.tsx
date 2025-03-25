import ChatWindow from "./components/chat-window";
import ChatBox from "./components/chat-box";

function Adviser() {
    return (
        <div className="flex flex-col text-black h-full grow-1 border-box p-0 m-0 relative pb-20 overflow-hidden">
            <h1 className="text-3xl font-bold text-background">Adviser</h1>
            <p className="text-gray-500">Get recommendations on stocks to buy.</p>
            <ChatWindow />
            <ChatBox />
        </div>
    );
}

export default Adviser;