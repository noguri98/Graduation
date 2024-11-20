
import React, { useState, useEffect, useCallback, useContext } from 'react';

import axios from 'axios';

import './SelectCommue.css'

import MessageData from '../Commue/MessageData';
import { SystemContext } from '../ClientSystem';

function AxeControlSelect() {

    const { Axe } = useContext(SystemContext);

}

function ButtonControlSelect() {

    const { Button } = useContext(SystemContext);
    const { setDisplay } = useContext(SystemContext);

    useEffect(() => {

        if (Button === "Y") {

            setDisplay("mainscreen");
        }
    },[Button])
}

function MessageList({messages}) {

    return (
        <div className="MESSAGELIST">
            {messages.map((message, index) => (
                <div key={index} className="MESSAGEITEM">
                    <code className="MessageText"> {message.User} </code>
                    <code className="MessageText"> {message.Word} </code>
                    <code className="MessageText"> {message.Time} </code>
                </div>
            ))}
        </div>
    );
}

const SelectCommue = () => {

    const host = window.location.hostname

    const [messages, setMessages] = useState([]); // 메시지를 저장할 상태

    const fetchMessages = useCallback(async () => {
        try {
            const response = await axios.get(`http://${host}:5001/messages`);
            setMessages(response.data); // 서버에서 받은 메시지를 상태에 저장

        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, []);

    useEffect(() => {
        fetchMessages(); // 컴포넌트가 마운트될 때 메시지를 가져옴
    }, [fetchMessages]);

    return (

        <>
        <ButtonControlSelect />
        <div className="SELECTSCREEN">
            <div className="COMMUE">
                <MessageData />
            </div>
            <div className='LIST'>
                <div className='LISTFRAME'>
                    <MessageList messages={messages}/>
                </div>
            </div>
        </div>
        </>
    )
}

export default SelectCommue;