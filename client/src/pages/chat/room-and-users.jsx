//client/src/pages/chat/room-and-users.jsx

//Need the room's name
//Need a list of users and state that changes whenever a person enters or leaves the room
//Need a button that emits a leave-room event

import styles from './styles.module.css';
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const RoomAndUsers = ({socket, room, username}) => {
    const [roomUsers, setRoomUsers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        //Listen for event that's emitted whenever a user joins the room to signal a user list update
        socket.on('chatroom_users', (data) => {
            setRoomUsers(data);
        });

        return () => socket.off('chatroom_users');
    }, [socket]);

    const leaveRoom = () => {
        const createdTime = Date.now();

        //Say goodbye to the room
        socket.emit('leave_room', {username, room, createdTime});
        //Go back to the home page
        navigate('/', {replace: true});
    };

    return (
        <div className={styles.roomAndUsersColumn}>
            <h2 className={styles.roomTitle}>{room}</h2>
            <div>
                {roomUsers.length > 0 && <h5 className={styles.usersTitle}>Users:</h5>}
                <ul className={styles.usersList}>
                    {roomUsers.map((user) => (
                        <li style={{fontWeight: user.username === username ? 'bold' : 'normal'}} key={user.id}>
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>

            <button className='btn btn-outline' onClick={leaveRoom}>
                Leave
            </button>
        </div>
    );

};

export default RoomAndUsers;