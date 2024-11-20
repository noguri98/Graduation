
import { useContext } from 'react';
import { SystemContext } from '../ClientSystem';

import { useState , useEffect , useRef } from 'react';

import moment from 'moment';
import { Lunar } from "lunar-javascript";

import './SelectCalendar.css';

import EventData from '../Calendar/EventData';

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
    12:{ 29 : "설날" },
    1: { 1: "설날", 2: "설날" },
    4: { 8: "부처님오신날" },
    8: { 14: "추석", 15: "추석", 16: "추석" }
}

function Monthly({events , currentDate}) {

    const Year = currentDate.getFullYear()
    const Month = currentDate.getMonth() + 1
    const Today = currentDate.getDate()

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

    const FindEvent = (day) => {

        if (!events || events.length === 0) return false;

        const eventDate = moment(`${Year}-${Month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);

        return events.some(event => moment(event.start).isSame(eventDate, 'day'));
    }

    const FindHoliday = (day) => {
        // 양력 공휴일 확인
        if (solar[Month] && solar[Month][day]) {
            
            return solar[Month][day];
        }

        // 음력 공휴일 확인
        const lunarDate = Lunar.fromDate(new Date(Year, Month - 1, day));
        const lunarMonth = lunarDate.getMonth();
        const lunarDay = lunarDate.getDay();

        if (lunar[lunarMonth] && lunar[lunarMonth][lunarDay]) {
            return lunar[lunarMonth][lunarDay];
        }

        return null;
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
        
        <div className="CALENDARFRAME">
            <div className="CALENDARHEAD">
            <div className="CALENDARMONTH"> {Month}월 </div>
            <div className="CALENDARYEAR"> {Year}년 </div>
        </div>
        <div className="CALENDARBODY">
        {Days.map((day, index) => (
            <div key={`day-${index}`} className={`CALENDARDAY ${day === '' ? 'EMPTY' : ''} ${FindEvent(day) ? 'EVENT' : ''}`}>
                <div className={`CALENDARTEXT ${getDayClass(day, index)}`}>
                    {day}
                </div>
                {FindHoliday(day) && (
                    <div className="HOLINAME">
                        {FindHoliday(day)}
                    </div>
                )}
            </div>
        ))}
        </div>
    </div>  
    )
}

function Detail({events, currentDate}) {

    const Year = currentDate.getFullYear()
    const Month = currentDate.getMonth() + 1
    const Today = currentDate.getDate()

    const WeekIndex = new Date(Year, Month-1, Today).getDay()
    const WeekDays = ['일', '월', '화', '수', '목', '금', '토'];

    function FindEvent() {

        const today = moment(`${Year}-${Month.toString().padStart(2, '0')}-${Today.toString().padStart(2, '0')}`);

        return events.filter(event => moment(event.start).isSame(today, 'day'));
    }

    const todayEvents = FindEvent();

    console.log(events)

   return (

        <div className="DETAILFRAME">
            <div className='DETAILHEAD'>
                <div className='DETALDATE'> {Year}년 {Month}월 {Today}일  ({WeekDays[WeekIndex]}) </div>
            </div>
            <div className='DETAILBODY'>
            {todayEvents.length > 0 ? (
                    todayEvents.map((event, index) => (
                        <div key={index} className="DETAILINFO">
                            <div className='DETALTEXT'> {event.name} </div>
                            <div className='DETALTEXT'> {event.time} </div>
                            <div className='DETALTEXT'> {event.ex} </div>
                        </div>
                    ))
                ) : (
                    <div>오늘의 이벤트가 없습니다.</div>
                )}
            </div>
        </div>
    )
}

function AxeControlCalendar({timerRef, currentDate, setCurrentDate}) {

    const { Axe , setAxe } = useContext(SystemContext);
    const { Icon , setIcon } = useContext(SystemContext);
    const { setDisplay } = useContext(SystemContext);

    useEffect(() => {

        const newDate = new Date(currentDate);

        switch (Axe) {

            case 'left':
                newDate.setDate(newDate.getDate() - 1);
                break;
            case 'right':
                newDate.setDate(newDate.getDate() + 1);
                break;
            case 'up':
                newDate.setDate(newDate.getDate() - 7);
                break;
            case 'down':
                newDate.setDate(newDate.getDate() + 7);
                break;
        }
        setCurrentDate(newDate);
    },[Axe])
}

function ButtonControlCalendar({timerRef, currentDate, setCurrentDate}) {

    const { Button , setButton } = useContext(SystemContext);
    const { setIcon } = useContext(SystemContext);
    const { setDisplay } = useContext(SystemContext);


    useEffect(() => {

        const newDate = new Date(currentDate);

        switch (Button) {

            case 'L':
                newDate.setMonth(newDate.getMonth() - 1);
                break;
            case 'R':
                newDate.setMonth(newDate.getMonth() + 1);
                break;
            case 'X':
                
                break;
            case 'Y':
                setDisplay('mainscreen');
                break;
        }
        setCurrentDate(newDate);
    },[Button])
}

const SelectCalendar = () => {

    const [ events , setEvents ] = useState([])
    const [ currentDate, setCurrentDate ] = useState(new Date());

    const timerRef = useRef(null);

    function GetEvent(onEvent) {

        setEvents(onEvent);
    }

    return (

        <div>
            <EventData onEvent={GetEvent}/>
            <AxeControlCalendar timerRef={timerRef} currentDate={currentDate} setCurrentDate={setCurrentDate} />
            <ButtonControlCalendar timerRef={timerRef} currentDate={currentDate} setCurrentDate={setCurrentDate} />
            <div className="SELECTSCREEN">
                <div className="CALENDAR">
                    <div className="CALENDARFRAME">
                        <Monthly events={events} currentDate={currentDate} />
                    </div>
                </div>
                <div className="DETAIL">
                    <div className="DETAILFRAME">
                        <Detail events={events} currentDate={currentDate}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectCalendar;