import express from 'express';

import {
    acceptFriend, 
    sendFriend, 
    declineFriend, 
    getAllFriends, 
    getFriends
} from './../controllers/friendController.js';

const router = express.Router();

router.post('/requests', sendFriend);

router.post('/requests/:requestId/accept', acceptFriend);


router.post('/requests/:requestId/decline', declineFriend);

router.get('/', getAllFriends);

router.get('/requests', getFriends);

export default router;