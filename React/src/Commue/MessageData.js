
// npm install react-wordcloud@1.2.7 --legacy-peer-deps

import React, { useState, useEffect, useCallback } from 'react';
import ReactWordcloud from 'react-wordcloud';
import io from 'socket.io-client';
import axios from 'axios';

const MessageData = () => {

  const [words, setWords] = useState([]);
  const [cloudWords, setCloudWords] = useState([]);
  const [, setSocket] = useState(null);

  const processMessages = useCallback((messages) => {
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const today = koreaTime.toISOString().split('T')[0];

    const todayMessages = messages.filter(message => message.Date === today);

    const wordFreq = todayMessages.reduce((acc, message) => {
      const word = message.Word;
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});
    
    const wordCloudData = Object.entries(wordFreq).map(([text, value]) => ({ text, value }));
    setWords(wordCloudData);
  }, []);

  useEffect(() => {
    // 기존 단어 유지하면서 새 단어 추가
    setCloudWords(prevWords => {
      const newWords = words.filter(word => 
        !prevWords.some(prevWord => prevWord.text === word.text)
      );
      return [...prevWords, ...newWords];
    });
  }, [words]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5001/messages');
      processMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [processMessages]);

  useEffect(() => {
    fetchMessages();

    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    // 새로운 메시지를 수신하기 위한 리스너
    newSocket.on('new_message', (newMessage) => {
      console.log('새로운 메시지 수신:', newMessage);
      // 수신된 메시지를 처리하여 단어 구름 업데이트
      processMessages([newMessage]); // 단일 메시지를 배열로 감싸서 처리
    });

    return () => newSocket.close();
  }, [fetchMessages, processMessages]);

  const options = {
    deterministic: true, // 위치 일관성 유지
    enableOptimizations: true,
    fontSizes: [20, 30],
    rotations: 0, // 회전 없음
    spiral: 'rectangular',
    padding: 5,
  };

  const callbacks = {
    onWordClick: console.log,
    onWordMouseOver: console.log,
    getWordTooltip: word => `${word.text} (${word.value})`,
  };

  return (
    <div>
      <div style={{ width: '100%', height: '100%', padding: '10px' }}>
        <ReactWordcloud words={cloudWords} options={options} callbacks={callbacks} />
      </div>
    </div>
  );
};

export default MessageData;