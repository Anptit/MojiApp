import type { Socket } from "socket.io-client";
import type { Conversation, Message } from "./chat";
import type { User } from "./user";

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;
    clearState: () => void;
    setAccessToken: (accessToken: string) => void;

    signUp: (
        username: string,
        password: string,
        email: string,
        firstName: string,
        lastName: string
    ) => Promise<void>;

    signIn: (
        username: string,
        password: string
    ) => Promise<void>;

    signOut: () => Promise<void>;
    fetchMe: () => Promise<void>;
    refreshToken: () => Promise<void>;
}

export interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (isDark: boolean) => void;
}

export interface ChatState {
    conversations: Conversation[];
    messages: Record<string, {
        items: Message[],
        hasMore: boolean,
        nextCursor: string | null,
    }>;
    activeConversationId: string | null;
    convoLoading: boolean;
    messageLoading: boolean;
    reset: () => void;
    setActiveConversation: (conversationId: string | null) => void;
    fetchConversations: () => Promise<void>;
    fetchMessages : (conversationId: string) => Promise<void>;
    sendDirectMessage: (recipientId: string, content: string, imgUrl?: string, conversationId?: string) => Promise<void>;
    sendGroupMessage: (conversationId: string, content: string, imgUrl?: string) => Promise<void>;
    addMessage: (message: Message) => Promise<void>;
    updateConversation: (conversation: Conversation) => void;
}

export interface SocketState {
    socket: Socket | null;
    onlineUsers: string[];
    connectSocket: () => void;
    disconnectSocket: () => void;
}
