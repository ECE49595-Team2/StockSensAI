import { Card } from "@/shadcn/ui/card";

export enum ChatBubbleType {
    User,
    Assistant,
}

function ChatBubble({ type, text }: { type: ChatBubbleType; text: string }) {
    return (
        <div className={`flex flex-row grow-1 shrink-0 ${type === ChatBubbleType.Assistant ? "justify-start" : "justify-end"} mb-2`}>
            <Card
                className={`${type === ChatBubbleType.User ? "bg-background text-white" : "bg-accent text-black"} p-4 rounded-lg shadow-md mb-2 min-h-[50px] max-w-[60%]`}
                style={{
                    wordBreak: "break-word", // Ensures long words break properly
                    whiteSpace: "normal",   // Allows text to wrap
                }}
            >
                <p>{text}</p>
            </Card>
        </div>
    );
}

export default ChatBubble;