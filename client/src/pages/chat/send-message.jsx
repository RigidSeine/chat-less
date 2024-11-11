// client/src/pages/chat/send-message.jsx

import styles from './styles.module.css';
import { useState } from 'react';

const SendMessage = ({ socket, username, room}) => {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if (message.trim() != '') {
            const createdTime = Date.now();

            //Send a message to the server. We can't specify who we send the message to
            //from the front-end. But we'll handle the recipients on the server-side.
            socket.emit('send_message', {username, room, message, createdTime});
            setMessage('');
        }
    }

    const handleKeyPress = (key) => {
        switch (key) {
            case 'Enter':
                sendMessage();
                break;
            default:
                null;
        }
        
    }

    return(
        <div className={styles.sendMessageContainer}>
            <input
                name="messageBox"
                className={styles.messageInput}
                placeholder='Message'
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                onKeyDown={(e) => handleKeyPress(e.key)}

            />
            <button className='btn btn-primary' onClick={sendMessage}>
                Send Message
            </button>
        </div>
    );
};

export default SendMessage;