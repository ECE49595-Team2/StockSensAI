import ChatWindow from "./chat-window";
import ChatBox from "./chat-box";

function Adviser() {
    return (
        <>
            <h1 className="text-3xl font-bold text-background">Adviser</h1>
            <p className="text-gray-500">Get recommendations on stocks to buy.</p>
            <div className="flex flex-col text-black h-full grow-1 border-box p-0 m-0 overflow-hidden justify-center items-center">

                <ChatWindow />
                <ChatBox />
            </div>
        </>
    );
}

export default Adviser;