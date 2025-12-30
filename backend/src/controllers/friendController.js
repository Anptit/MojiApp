import Friend from "../models/Friend.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const sendFriend = async (req, res) => {
    try {
        const {to, message} = req.body;
        const from = req.user._id;

        if (from === to) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }

        const userExists = await User.exists({_id: to});

        if (!userExists) {
            return res.status(404).json({ message: "The user you are trying to add does not exist." });
        }

        let userA = from.toString();
        let userB = to.toString();

        if (userA > userB) {
            [userA, userB] = [userB, userA];
        }

        const [alreadyFriends, existingRequest] = await Promise.all([
            Friend.findOne({ userA, userB }),
            FriendRequest.findOne({
                $or: [
                    { from, to },
                    { from: to, to: from }
                ]
            })
        ])

        if (alreadyFriends) {
            return res.status(400).json({ message: "You are already friends with this user." });
        }

        if (existingRequest) {
            return res.status(400).json({ message: "A friend request already exists between you and this user.", friendRequest });
        }

        const friendRequest = await FriendRequest.create({ from, to, message });

        return res.status(201).json({ message: "Friend request sent successfully." });

    } catch (error) {
        console.error('Error adding friend:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const acceptFriend = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Friend request not found." });
        }

        if (request.to.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request." });
        }

        const friend = await Friend.create({
            userA: request.from,
            userB: request.to
        })

        await FriendRequest.findByIdAndDelete(requestId);

        const from = await User.findById(request.from).select('_id displayName avatarUrl').lean();

        return res.status(201).json({ message: "Friend request accepted.", newFriend: {
            _id: from?._id,
            displayName: from?.displayName,
            avatarUrl: from?.avatarUrl
        } });
    } catch (error) {
        console.error('Error adding friend:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const declineFriend = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Friend request not found." });
        }

        if (request.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to decline this friend request." });
        }

        await FriendRequest.findByIdAndDelete(requestId);

        return res.status(204).json({ message: "Friend request declined." });
    } catch (error) {
        console.error('Error adding friend:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAllFriends = async (req, res) => {
    try {

    } catch (error) {
        console.error('Error adding friend:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getFriends = async (req, res) => {
    try {

    } catch (error) {
        console.error('Error adding friend:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}