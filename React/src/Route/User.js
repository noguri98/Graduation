
import { useState , useEffect } from "react";

import "./User.css"

// import axios from 'axios';

import io from 'socket.io-client';
import axios from "axios";

import SavePhoto from "../Camera/SavePhoto";

import { useLocation } from "react-router-dom";

const User = () => {

    const location = useLocation(); // 현재 위치 가져오기

    const queryParams = new URLSearchParams(location.search); // 쿼리 파라미터 가져오기

    const userName = queryParams.get("userName")

    const host = window.location.hostname

    const [User, ] = useState(userName); // userID 상태 설정

    const [eventDate, setEventDate] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDescription, setEventDescription] = useState('');

    const [socket, setSocket] = useState(null);
    
    const submitAddEvent = async (e) => {

        e.preventDefault();
        try {
            const response = await axios.post(`http://${host}:5001/addevent`, {
                userName: User,
                eventDate: eventDate,
                eventName: eventName,
                eventTime: eventTime,
                eventDescription: eventDescription
            });
            console.log('서버 응답:', response.data);
            alert('이벤트가 성공적으로 추가되었습니다.');
            // 입력 필드 초기화
            setEventDate('');
            setEventName('');
            setEventTime('');
            setEventDescription('');
        } catch (error) {
            console.error('에러 발생:', error);
            alert('이벤트 추가 중 오류가 발생했습니다.');
        }
    };

    const [selectDate, setSelectDate] = useState('');
    
    const [attendanceData, setAttendanceData] = useState(null);

    const submitSelectAtt = async (e) => {

        e.preventDefault();
        try {
            const response = await axios.post(`http://${host}:5001/selectattendance`, {

                userName: User,
                selectDate: selectDate
            });

            console.log('서버 응답:', response.data);
            alert('요청이 성공적으로 처리되었습니다.');

            if (response.data.message === "출석 정보를 찾았습니다.") {
                // 출석 정보가 있는 경우
                const attendanceInfo = response.data.attendanceInfo;
                // 여기서 attendanceInfo를 사용하여 UI 업데이트
                updateAttendanceDisplay(attendanceInfo);
            } else {
                // 출석 정보가 없는 경우
                console.log(response.data.message);
                // UI에 "출석 정보 없음" 메시지 표시
                displayNoAttendanceMessage();
            }
    
            // 입력 필드 초기화
            setSelectDate('');
        } catch (error) {
            console.error('에러 발생:', error);
            alert('서비스 요청 중 오류가 발생했습니다.');
        }
    };

    // 출석 정보를 표시하는 함수
    const updateAttendanceDisplay = (attendanceInfo) => {
        // 예: 출석 정보를 테이블이나 리스트로 표시
        // 이 부분은 실제 UI 구조에 따라 구현해야 합니다.
        setAttendanceData(attendanceInfo);
        // 예시: setAttendanceData(attendanceInfo); // 상태 업데이트
    };

    // 출석 정보가 없을 때 메시지를 표시하는 함수
    const displayNoAttendanceMessage = () => {
        // 예: "해당 날짜의 출석 정보가 없습니다" 메시지를 UI에 표시
        setAttendanceData(null);
        // 예시: setAttendanceData(null); // 상태 초기화
    };

    const [messageData, setMessageData] = useState('');

    const submitAddMessage = async (e) => {

        e.preventDefault();

        try {
            const response = await axios.post(`http://${host}:5001/addmessage`, {
                userName: User,
                messageData: messageData
            });
            console.log('서버 응답:', response.data);
            alert('메시지가 성공적으로 전송되었습니다.');
            // 입력 필드 초기화
            setMessageData('');
        } catch (error) {
            console.error('에러 발생:', error);
            alert('메시지 전송 중 오류가 발생했습니다.');
        }
    };
    

    return (

        <div>
            <div className="User">
                <div className="UserScreen1">
                    <div className="UserHead"> 
                        <code> 사용자 옵션 </code>
                    </div>
                    <div className="UserInfo">
                        <div className="UserName">
                            <code> 사용자 이름 : {User} </code>
                        </div>
                    </div>
                </div>
                <div className="ScrollContainer">
                    <div className="UserScreen2">
                        <div className="UserAddEvent">
                            <div className="UserEventHead">
                                <code className="UserEventMenu"> Event Menu </code>
                            </div>
                            <div className="UserEventBody">
                                <div className="UserAddEventMenu">
                                    <code> 이벤트 날짜 : </code>
                                    <input 
                                        className="InputEvent" 
                                        type="date"
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                    />
                                </div>
                                <div className="UserAddEventMenu">
                                    <code> 이벤트 시간 : </code>
                                    <input 
                                        className="InputEvent" 
                                        type="time"
                                        value={eventTime}
                                        onChange={(e) => setEventTime(e.target.value)}
                                    />
                                </div>
                                <div className="UserAddEventMenu">
                                    <code> 이벤트 이름 : </code>
                                    <input 
                                        className="InputEvent" 
                                        type="text"
                                        value={eventName}
                                        onChange={(e) => setEventName(e.target.value)}
                                    />
                                </div>
                                <div className="UserAddEventMenu">
                                    <code> 이벤트 설명 : </code>
                                    <input 
                                        className="InputEventex" 
                                        type="text"
                                        value={eventDescription}
                                        onChange={(e) => setEventDescription(e.target.value)}
                                    />
                                </div>
                                <button className="UserSubmit" onClick={submitAddEvent}> 제출 </button>
                            </div>
                        </div>
                    </div>
                    <div className="UserScreen2">
                        <div className="UserAttendance">
                            <div className="UserAttendanceHead">
                                <code className="UserAttendanceMenu"> Attendance Menu </code>
                            </div>
                            <div className="UserSelectAttMenu">
                                <code> 출석 날짜 : </code>
                                <input 
                                    className="InputAttendance" 
                                    type="date" 
                                    value={selectDate}
                                    onChange={(e) => setSelectDate(e.target.value)}
                                />
                            </div>
                            <button className="UserSubmit" onClick={submitSelectAtt}> 제출 </button>
                                <div className="AttendanceDisplay">
                                    {attendanceData && attendanceData.length > 0 ? (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>날짜</th>
                                                    <th>시간</th>
                                                    <th>수업명</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attendanceData.map((info, index) => (
                                                    <tr key={index}>
                                                        <td>{info.date}</td>
                                                        <td>{info.time}</td>
                                                        <td>{info.className}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p> 날짜를 선택하여 출석정보를 확인하세요. </p>
                                    )}
                            </div>
                        </div>
                    </div>
                    <div className="UserScreen2">
                        <div className="UserAttendance">
                            <div className="UserAttendanceHead">
                                <code className="UserMessageMenu"> Messge Menu </code>
                            </div>
                             <div className="UserAddMessageMenu">
                                <code> 메시지 입력 : </code>
                                <input 
                                    className="InputMessage" 
                                    type="text"
                                    value={messageData}
                                    onChange={(e) => setMessageData(e.target.value)}
                                    
                                />
                            </div>
                            <button className="UserSubmit" onClick={submitAddMessage}> 제출 </button>
                        </div>
                    </div>
                    <div className="UserScreen2">
                        <div className="UserSavePhoto">
                            <div className="UserPhotoHead">
                                <div className="UserPhotoMenu">
                                    <code> Photo Menu </code>
                                </div>
                            </div>
                            <div className="UserSavePhotoMenu">
                                <SavePhoto />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User