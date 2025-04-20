"use client";
import SendButton from "./send-button";
import { useState, useRef } from "react";

function ChatBox() {
    const [message, setMessage] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);

        // Adjust the height of the textarea dynamically
        if (textareaRef.current && textareaRef.current.scrollHeight < 200) {
            textareaRef.current.style.height = "auto"; // Reset height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
        }
    };

    return (
        <div className="flex flex-row bottom-0 h-auto w-full bg-white justify-center items-center gap-3 rounded p-3">
            <textarea
                ref={textareaRef}
                placeholder="Ask me anything..."
                className="h-[50px] w-[80%] p-3 box-border bg-white resize-none overflow-hidden rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleInputChange}
                value={message}
                rows={1} // Start with one row
                maxLength={200} // Limit to 200 characters
            />
            <SendButton messageToSend={message} onSend={() => setMessage("")} />
        </div>
    );
}

export default ChatBox;