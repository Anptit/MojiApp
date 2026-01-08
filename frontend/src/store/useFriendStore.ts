import {create} from "zustand";
import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";

export const useFriendStore = create<FriendState>((set) => ({
    loading: false,
    friends: [],
    receivedList: [],
    sentList: [],
    searchByUsername: async (username) => {
        try {
            set({loading: true});
            const user = await friendService.searchByUsername(username);
            return user;
        } catch (error) {
            console.error("Error searching user by username:", error);
            return null;
        } finally {
            set({loading: false});
        }
    },
    addFriend: async (to, message = "") => {
        try {
            set({loading: true});
            const responseMessage = await friendService.sendFriendRequest(to, message);
            return responseMessage;
        } catch (error) {
            console.error("Error sending friend request:", error);
            return "Failed to send friend request.";
        } finally {
            set({loading: false});
        }
    },
    getAllFriendRequests: async () => {
        try {
            set({loading: true});

            const result = await friendService.getAllFriendRequest();

            if (!result) return;

            const {received, sent} = result;

            set({
                receivedList: received,
                sentList: sent
            });
        } catch (error) {
            console.error("Error getting all friend requests:", error);
        } finally {
            set({loading: false});
        }
    },
    acceptRequest: async (requestId) => {
        try {
            set({loading: true});
            await friendService.acceptRequest(requestId);

            set((state) => ({
                receivedList: state.receivedList.filter(req => req._id !== requestId)
            }));
        } catch (error) {
            console.error("Error accepting friend request:", error);
        } finally {
            set({loading: false});
        }
    },
    declineRequest: async (requestId) => {
        try {
            set({loading: true});
            await friendService.declineRequest(requestId);

            set((state) => ({
                receivedList: state.receivedList.filter(req => req._id !== requestId)
            }));
        } catch (error) {
            console.error("Error declining friend request:", error);
        } finally {
            set({loading: false});
        }
    }, 
    getFriends: async () => {
        try {
            set({loading: true});
            const friends = await friendService.getFriendsList();
            set({friends: friends});
        } catch (error) {
            console.error("Error getting friends list:", error);
            set({friends: []});
        } finally {
            set({loading: false});
        }
    },
}));