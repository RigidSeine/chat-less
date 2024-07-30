// client/src/pages/home/index.jsx

import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

const Home = ({username, setUsername, room, setRoom, socket}) => {
  const navigate = useNavigate(); //Method that allows for navigation to the specified path

  //Behaviour for clicking on the Join Room button
  const joinRoom = () =>{
    if (room != '' && username != ''){
      //If the room and username aren't empty then emit the join_room event and pass the username and room values along in an object.
      socket.emit('join_room', {username, room});
      navigate('/chat', {replace:true});
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{'DevRooms'}</h1>
        <input 
          className={styles.input} 
          placeholder='Username...'
          onChange={(e) => setUsername(e.target.value)} //Set the username using the onChange event 
        />

        <select 
          className={styles.input}
          onChange={(e) => setRoom(e.target.value)} //Set the room using the onChange event
        >
          <option>-- Select Room --</option>
          <option value='javascript'>JavaScript</option>
          <option value='node'>Node</option>
          <option value='express'>Express</option>
          <option value='react'>React</option>
        </select>

        <button 
          className='btn btn-secondary width-full'
          onClick={joinRoom} //Trigger the joinRoom function
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
