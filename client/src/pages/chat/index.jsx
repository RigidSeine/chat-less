import styles from './styles.module.css';
import Messages from './messages';
import SendMessage from './send-message';
import RoomAndUsers from './room-and-users';

const Chat = ({socket, username, room}) => {
    return (
        <div className={styles.chatContainer}>
            <RoomAndUsers socket={socket} room={room} username={username}/>
            <div>
                <Messages socket={socket}/>
                <SendMessage socket={socket} username={username} room={room}/>
            </div>
        </div>
    );
};

export default Chat;