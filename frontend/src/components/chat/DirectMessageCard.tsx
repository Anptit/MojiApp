import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import UnreadCountBadge from "./UnreadCountBadge";
import { useSocketStore } from "@/store/useSocketStore";

const DirectMessageCard = ({ convo }: { convo: Conversation }) => {
    const { user } = useAuthStore();
    const { activeConversationId, setActiveConversation, messages, fetchMessages } = useChatStore();
    const { onlineUsers } = useSocketStore();

    if (!user) return null;

    const otherUser = convo.participants.find(p => p._id !== user._id);
    if (!otherUser) return null;

    const unreadCount = convo.unreadCounts[user._id];
    const lastMessage = convo.lastMessage?.content ?? "";

    const handleSelectConversation = async (id: string) => {
        setActiveConversation(id);
        if (!messages[id]) {
            await fetchMessages(id);
        }
    }
    return <ChatCard
        convoId={convo._id}
        name={otherUser.displayName ?? ""}
        timestamp={convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined}
        isActive={activeConversationId === convo._id}
        onSelect={handleSelectConversation}
        unreadCount={unreadCount}
        leftSection={
            <>
                <UserAvatar 
                    type="sidebar" 
                    name={otherUser.displayName ?? ""} 
                    avatarUrl={otherUser.avatarUrl ?? undefined} 
                />

                <StatusBadge status={onlineUsers.includes(otherUser?._id || "") ? "online" : "offline"}/>
                {
                    unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />
                }
            </>
        }
        subtitle={
            <p className={cn("text-sm truncate", unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground")}>
                {lastMessage}
            </p>
        }
    />
}

export default DirectMessageCard;