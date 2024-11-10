// client/src/pages/chat/messages.jsx

import styles from './styles.module.css';
import {useState, useEffect, useRef} from 'react';

const Messages = ({ socket }) => { //Unpack the socket property from the passed in object i.e. destructuring
    const [messagesReceived, setMessagesReceived] = useState([]); //Array for messagesReceived
    
    //Ref value to manipulate the DOM object this function returns
    const messagesColumnRef = useRef(null);

    // Runs when the Messages component is mounted
    //Receive Message event
    useEffect(() => {
        socket.on('receive_message', (data) => {
            
            //Append a new message object to messagesReceived from the data argument
            setMessagesReceived((state) => [ //Using state as the state updater to separate it from useEffect's dependencies
                ...state, 
                {
                    message: data.message,
                    username: data.username,
                    createdTime: data.createdTime
                },
            ]);

        });

        //Remove event listener on component unmount as a form of cleanup
        return () => socket.off('receive_message');

    }, [socket]);  //The socket being passed in as the dependency means this will rerun whenever the socket reference changes

    //Display last 100 messages event
    useEffect(() => {
        socket.on('last_100_messages', (last100Messages) => {
            setMessagesReceived((state) => [...last100Messages, ...state]);
        });

        return () => socket.off('last_100_messages');
    }, [socket]); //The socket being passed in as the dependency means this will rerun whenever the socket reference changes
    
    //Scroll to the most recent message event
    useEffect(() => {
        messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
    }, [messagesReceived]);

    // dd/mm/yyyy, hh:mm:ss
    function formatDateFromTimestamp(timestamp){
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <div className={styles.messagesColumn} ref={messagesColumnRef}>
            {messagesReceived.map((msg, i) => (
                <div className={styles.message} key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                        <span className={styles.msgMeta}>{msg.username}</span>
                        <span className={styles.msgMeta}>{formatDateFromTimestamp(msg.createdTime)}</span>
                    </div>
                    <p className={styles.msgText}>{msg.message}</p>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default Messages;