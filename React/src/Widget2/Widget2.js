import { useState, useEffect } from 'react';
import './Widget2.css'

import EventData from '../Calendar/EventData';

const Widget2 = () => {

    const [events, setEvents] = useState([])
    const [todayEvents, setTodayEvents] = useState([])
    const [futureEvents, setFutureEvents] = useState([])

    function GetEvent(onEvent) {

        setEvents(onEvent);
    }

    useEffect(() => {

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const sortedEvents = events
            .map(event => ({
                ...event,
                date: new Date(event.start)
            }))
            .filter(event => event.date >= today)
            .sort((a, b) => a.date - b.date);

        const todayEvts = sortedEvents.filter(event => event.date >= today && event.date < tomorrow);
        const futureEvts = sortedEvents.filter(event => event.date >= tomorrow).slice(0, 3 - todayEvts.length);

        setTodayEvents(todayEvts);
        setFutureEvents(futureEvts);

    }, [events])

    const formatDate = (date) => {

        return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    }

    return (

        <div>
            <EventData onEvent={GetEvent}/>
            
            <div className="WIDGET2">
                <div className="FRAME">
                    {todayEvents.length > 0 && (
                        <div>
                        <div className="HEAD">오늘의 이벤트</div>
                        {todayEvents.map((event, index) => (
                            <div key={index} className="BODY">{event.name}</div>
                        ))}
                    </div>
                )}
                {futureEvents.length > 0 && (
                    <div>
                        <div className="HEAD">예정된 이벤트</div>
                        {futureEvents.map((event, index) => (
                            <div key={index} className="BODY">{formatDate(event.date)} {event.name}</div>
                        ))}
                    </div>
                )}
                {todayEvents.length === 0 && futureEvents.length === 0 && (
                    <div>
                        <div className="HEAD"></div>
                        <div className="BODY">예정된 일정이 없습니다.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Widget2;