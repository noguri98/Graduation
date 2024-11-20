
import React, { useState , useEffect} from 'react';

// npm install moment --legacy-peer-deps

import moment from 'moment';

import { Lunar } from "lunar-javascript";

import EventData from '../Calendar/EventData';

import './Widget1.css'

const solar = {
    
    1: { 1: "신정" },
    3: { 1: "삼일절" },
    5: { 5: "어린이날" },
    6: { 6: "현충일" },
    8: { 15: "광복절" },
    10: { 1: "국군의 날", 3: "개천절", 9: "한글날" },
    12: { 25: "크리스마스" }
};

const lunar = {

    1: { 1: "설날", 2: "설날" },
    4: { 8: "부처님오신날" },
    8: { 14: "추석", 15: "추석", 16: "추석" }
}

function ThisMonth({events}) {

    const Year = new Date().getFullYear()
    const Month = new Date().getMonth() + 1
    const Today = new Date().getDate()

    const [ Days, setDays ] = useState([]);

    useEffect(() => {

        // 매달 1일의 요일을 출력할 때에는 Month - 1로 해야함.
        const firstWeekday = new Date(Year, Month - 1, 1).getDay();

        const lastday = new Date(Year, Month, 0).getDate();

        let dayArray= []

        for (let i = 0; i < firstWeekday; i++) {

            dayArray.push('');
        }

        for (let i = 1; i <= lastday; i++) {

            dayArray.push(i);
        }

        setDays(dayArray);

    },[Year, Month])

    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    const FindEvent = (day) => {

        if (!events || events.length === 0) return false;

        const eventDate = moment(`${Year}-${Month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);

        return events.some(event => moment(event.start).isSame(eventDate, 'day'));
    }

    const FindHoliday = (day) => {
        // 양력 공휴일 확인
        if (solar[Month] && solar[Month][day]) return true;

        // 음력 공휴일 확인
        const lunarDate = Lunar.fromDate(new Date(Year, Month - 1, day));
        const lunarMonth = lunarDate.getMonth();
        const lunarDay = lunarDate.getDay();

        return lunar[lunarMonth] && lunar[lunarMonth][lunarDay];
    }

    const getDayClass = (day, index) => {

        if (day === '') return '';

        let classes = [];

        if (day === Today) classes.push('TODAY');
        if (FindEvent(day)) classes.push('EVENT');
        if (index % 7 === 0) classes.push('SUNDAY');
        if (index % 7 === 6) classes.push('SATURDAY');
        if (FindHoliday(day)) classes.push('HOLIDAY'); // 공휴일도 일요일과 같은 색상 사용

        return classes.join(' ');
    }

    return (

        <div className="Widget1-Monthly">
            <div className="Widget1-Head">
                <div className="Widget1-month"> {Month}월 </div>
                <div className="Widget1-year"> {Year}년 </div>
            </div>
            <div className="Widget1-Body">
            {Days.map((day, index) => (
                    <div key={`day-${index}`} className={`DAY ${FindEvent(day) ? 'EVENT' : ''}`}>
                        <div className={`TEXT ${getDayClass(day, index)}`}>
                            {day}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function NextMonth({events}) {

    const Year = new Date().getFullYear()
    const Month = new Date().getMonth() + 2
    const Today = new Date().getDate()

    const [ Days, setDays ] = useState([]);

    useEffect(() => {

        // 매달 1일의 요일을 출력할 때에는 Month - 1로 해야함.
        const firstWeekday = new Date(Year, Month - 1, 1).getDay();

        const lastday = new Date(Year, Month, 0).getDate();

        let dayArray= []

        for (let i = 0; i < firstWeekday; i++) {

            dayArray.push('');
        }

        for (let i = 1; i <= lastday; i++) {

            dayArray.push(i);
        }

        setDays(dayArray);

    },[Year, Month])

    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    const FindEvent = (day) => {

        if (!events || events.length === 0) return false;

        const eventDate = moment(`${Year}-${Month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);

        return events.some(event => moment(event.start).isSame(eventDate, 'day'));
    }

    const FindHoliday = (day) => {

        return solar[Month] && solar[Month][day] !== undefined;
    }

    const getDayClass = (day, index) => {

        if (day === '') return '';

        let classes = [];

        // if (day === Today) classes.push('TODAY');
        if (FindEvent(day)) classes.push('EVENT');
        if (index % 7 === 0) classes.push('SUNDAY');
        if (index % 7 === 6) classes.push('SATURDAY');
        if (FindHoliday(day)) classes.push('HOLIDAY'); // 공휴일도 일요일과 같은 색상 사용

        return classes.join(' ');
    }

    return (

        <div className="Widget1-Monthly">
            <div className="Widget1-Head">
                <div className="Widget1-month"> {Month}월 </div>
                <div className="Widget1-year"> {Year}년 </div>
            </div>
            <div className="Widget1-Body">
            {Days.map((day, index) => (
                    <div key={`day-${index}`} className={`DAY ${FindEvent(day) ? 'EVENT' : ''}`}>
                        <div className={`TEXT ${getDayClass(day, index)}`}>
                            {day}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const Widget1 = () => {
    
    const [ events , setEvents ] = useState([])

    function GetEvent(onEvent) {

        setEvents(onEvent);
    }

    return (

        <div>
            <EventData onEvent={GetEvent}/>
            <div className="WIDGET1">
                <div className="Widget1-split"> <ThisMonth events={events}/> </div>
                <div className="Widget1-split"> <NextMonth events={events}/> </div>
            </div>
        </div>
    )
}

export default Widget1;