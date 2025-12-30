import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

const Logout = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;
