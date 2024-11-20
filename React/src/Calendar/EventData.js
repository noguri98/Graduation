
import { useState, useEffect } from 'react';

import axios from 'axios';
import io from 'socket.io-client';

const EventData = ({onEvent}) => {

  const [events , setEvents] = useState([]);

  const host = window.location.hostname

  const socket = io(`http://${host}:5001`);

  useEffect(() => {
    
    const fetchEvents = async () => {

      try {

        const response = await axios.get(`http://${host}:5001/event`);

        setEvents(response.data);

        // 전달된 값이 그대로 출력됨을 확인
        console.log(response.data);
        onEvent(response.data);
      } 
      
      catch (error) {

        console.error('이벤트를 불러오는 중 오류 발생:', error);
      }
    };

    fetchEvents();

    // 새로운 이벤트를 수신하기 위한 리스너
    socket.on('new_event', (newEvent) => {

      // newEvent가 객체 형태로 전달된다고 가정
      setEvents((prevEvents) => [...prevEvents, newEvent]); // 새 이벤트를 목록에 추가
      onEvent(events)

  });

  return () => {

      socket.disconnect(); // 언마운트 시 정리
  };

}, [events]); // events를 의존성 배열에 추가하여 최신 상태를 반영

}

export default EventData;