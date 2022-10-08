import styles from './styles.module.css';
import { useState, useEffect } from 'react';

const Messages = ({ socket }) => {
    const [messagesReceived, setMessagesReceived] = useState([]);

    // Runs whenever a socket event is recieved from the server
    useEffect(() => {
      socket.on('receive_message', (data) => {
        console.log(data);
        setMessagesReceived((state) => [
            ...state,
            {
                message: data.message,
                username: data.username,
                __createdtime__: data.__createdtime__,
            },
        ]);
      });
    
      // Remove event listener on component unmount
      return () => socket.off('receive_message');
    }, [socket]);
    
    // dd/mm/yyyy, hh:mm:ss
    function formatDateFromTimeStamp(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

    return (
        <div className={styles.messagesColumn} >
            {messagesReceived.map((msg, i) => (
                <div className={styles.message} key={i} >
                    <div style={{ display: 'flex', justifyContent: 'space-between'}} >
                        <span className={styles.msgMeta}>{msg.username}</span>
                        <span className={styles.msgMeta}>
                            {formatDateFromTimeStamp(msg.__createdtime__)}
                        </span>
                    </div>
                    <p className={styles.msgText}>{msg.message}</p>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default Messages;