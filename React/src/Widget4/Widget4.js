
import { useContext } from 'react';
import { SystemContext } from '../ClientSystem';

import { useState , useEffect , useRef } from 'react';

import './Widget4.css';

import { io } from 'socket.io-client'; 
import { QRCodeCanvas } from "qrcode.react"

const Widget4 = () => {

    /*
        getSignal = {

            null : 가장 초기 상태로 로그인 상태도 QR 상태도 아닌 카메라 프레임 출력만 존재하는 상태,
            True : 로그인이 된 상태,
            False : 로그인이 실패한 상태로 이때에는 '/adduser'로 이동하는 QR을 표시
        }
    */
    const { setState } = useContext(SystemContext)
    const { Display } = useContext(SystemContext)

    const [ User , setUser ] = useState(null)
    const [ Signal , setSignal] = useState(null)

    const timerRef = useRef(null);
    const [ widget4time , setWidget4Time] = useState(15);

    const host = window.location.hostname

    useEffect(() => {

        fetch('http://localhost:5001/display', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ display: Display }),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    
    }, [Display]);

    useEffect(() => {

        const socket = io(`http://${host}:5001`)

        socket.on('SearchUser', (transferData) => [
            
            setUser(transferData.User),
            setSignal(transferData.Signal)
        ])
    },[host])

    useEffect(() => {

        if (Signal === null) {

            // 만약 타이머가 존재한다면 타이머 삭제
            if (timerRef.current) {

                clearTimeout(timerRef.current);
            }
        }

        else if (Signal === "false" || Signal === "true") {
            setState(Signal === "false" ? "AddUser" : "Login");
            setWidget4Time(15); // 타이머 초기화

            // 타이머 시작
            timerRef.current = setInterval(() => {

                setWidget4Time(prevTime => {

                    if (prevTime <= 1) {

                        clearInterval(timerRef.current);
                        setSignal(null); // 타이머가 끝나면 Signal 초기화
                        setUser("");
                        return 0;
                    }
                    return prevTime - 1; // 남은 시간 감소
                });
            }, 1000); // 1초마다 호출
        }

        return () => {

            clearInterval(timerRef.current); // 컴포넌트 언마운트 시 타이머 정리
        };
    },[Signal, setState])

    return (

        <div className='WIDGET4'>
            <div className='Widget4Frame'>
                {Signal === null ? 
                <div className="Widget4FrameShow">
                    <img src={`http://${host}:5001/camera`} alt="MAINCAMERA" className= "GetFrameData" />
                </div> : ""}
                {Signal === "true" ?
                <div className="Widget4QRShow">
                    <QRCodeCanvas value={`http://${host}:3000/user?userName=${User}`} className="ShowAddUser" />
                </div> : ""}
                {Signal === "false" ?
                <div className="Widget4QRShow">
                    <QRCodeCanvas value={`http://${host}:3000/adduser?userID=${User}`} className="ShowAddUser" />
                </div> : ""}

                <div className="Widget4Noti">
                {Signal === null ?
                    ""
                : ""}
                {Signal === "true" ?
                <>
                    {User}로 로그인되었습니다. <br /> 
                    QR을 통해 사용자 옵션을 사용할 수 있습니다. <br />
                    {widget4time}초 후 기본상태로 돌아갑니다.
                </>
                : ""}
                {Signal === "false" ?
                <>
                    {User} 사용자를 찾지 못 했습니다. <br />
                    사용자를 등록하십시오. <br />
                    {widget4time}초 후 기본상태로 돌아갑니다.
                </>
                : ""}
                </div>
            </div>
        </div>
    )
}

export default Widget4;