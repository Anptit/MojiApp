import { useFriendStore } from "@/store/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";

const SendRequest = () => {
  const { sentList } = useFriendStore();

  if (!sentList || sentList.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Bạn chưa gửi lời mời kết bạn nào
      </p>
    );
  }
  return (
    <div className="space-y-4 mt-4">
      <>
        {sentList.map((request) => (
          <FriendRequestItem
            key={request._id}
            requestInfo={request}
            type="sent"
            actions={
              <p className="text-muted-foreground text-sm">Đang chờ trả lời</p>
            }
          />
        ))}
      </>
    </div>
  );
};

export default SendRequest;
