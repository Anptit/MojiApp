import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create<AuthState>()(persist((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    setAccessToken: (accessToken: string) => {
        set({ accessToken });
    },

    clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        localStorage.clear();
        useChatStore.getState().reset();
    },

    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true });
            await authService.signUp(username, password, email, firstName, lastName);
            toast.success("Đăng ký thành công!");
        } catch (error) {
            console.error("Sign up error:", error);
            toast.error("Đăng ký thất bại. Vui lòng thử lại.");
        } finally {
            set({ loading: false });
        }
    },

    signIn: async (username, password) => {
        try {
            set({ loading: true });

            localStorage.clear();
            useChatStore.getState().reset();

            const { accessToken } = await authService.signIn(username, password);
            get().setAccessToken(accessToken);

            await get().fetchMe();
            useChatStore.getState().fetchConversations();

            toast.success("Đăng nhập thành công!");
        } catch (error) {
            console.error("Sign in error:", error);
            toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        try {
            get().clearState();
            await authService.signOut();
            toast.success("Đăng xuất thành công!");
        } catch (error) {
            console.error("Sign out error:", error);
            toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
        }
    },

    fetchMe: async () => {
        try {
            set({ loading: true });
            const user = await authService.fetchMe();
            set({ user });
        } catch (error) {
            console.error("Fetch me error:", error);
            set({ user: null, accessToken: null });
            toast.error("Phiên đã hết hạn. Vui lòng đăng nhập lại.");
        } finally {
            set({ loading: false });
        }
    },

    refreshToken: async () => {
        try {
            const { user, fetchMe } = get();
            const accessToken = await authService.refreshToken();
            get().setAccessToken(accessToken);

            if (!user) {
                await fetchMe();
            }
        } catch (error) {
            console.error("Refresh token error:", error);
            get().clearState();
        } finally {
            set({ loading: false });
        }
    }
}), {
    name: "auth-storage",
    partialize: (state) => ({ user: state.user })
}));