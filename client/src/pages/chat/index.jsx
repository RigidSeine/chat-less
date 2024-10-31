import styles from './styles.module.css';
import Messages from './messages';

const Chat = ({socket}) => {
    console.log('Chat started');
    return (
        <div className={styles.chatContainer}>
            <div>
                <Messages socket={socket}/>
            </div>
        </div>
    );
};

export default Chat;