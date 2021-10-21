import style from './styles.module.scss';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import logoImg from '../../assets/logo.svg';
import io from 'socket.io-client';

type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) =>{
    messagesQueue.push(newMessage);
})

export function MessageList(){
    const [messages, setMessages] = useState<Message[]>([]);
    
    useEffect(()=>{
        setInterval(()=>{
            if(messagesQueue.length > 0){
                setMessages(prevState => [
                    messagesQueue[0],
                    prevState[0],
                    prevState[1],
                ].filter(Boolean))

                messagesQueue.shift();
            }
        }, 3000)
    }, [])

    useEffect(()=>{
        api.get<Message[]>('messages/last3').then(response=> {
            setMessages(response.data);
        })
    }, [])
    
    return(
        <div className={style.messageListWrapper}>
            <img src={logoImg} alt="DoWhile 2021" />

            <ul className={style.messageList}>
                {messages.map(message =>{
                    return (
                        <li className={style.message} key={message.id}>
                            <p className={style.messageContent}>{message.text}</p>
                            <div className={style.messageUser}>
                                <div className={style.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>
                                <span>{message.user.name}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}