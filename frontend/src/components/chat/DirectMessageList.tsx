import { useChatStore } from "@/store/useChatStore";
import React from "react";
import DirectMessageCard from "./DirectMessageCard";

const DirectMessageList: React.FC = () => {
    const { conversations } = useChatStore();

    if (!conversations) return;

    const directConversations = conversations.filter(c => c.type === "direct");

    return (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {directConversations.map(convo => (
                <DirectMessageCard key={convo._id} convo={convo} />
            ))}
        </div>
    )
}

export default DirectMessageList;