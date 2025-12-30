import Logout from "@/components/auth/Logout";
import { useAuthStore } from "@/store/useAuthStore";
import React from "react";

const ChatAppPage: React.FC = () => {
  const { user } = useAuthStore();
  return (
    <div>
      <h1>Welcome to the Chat App, {user?.displayName || user?.username}!</h1> 
      <Logout />
    </div>
  );
};

export default ChatAppPage;
