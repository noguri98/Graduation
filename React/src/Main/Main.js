
import { useContext } from 'react';
import { SystemContext } from '../ClientSystem';

import { useState, useEffect , useRef } from 'react';

import "../Client.css"
import './Main.css'

import DynamicBar from '../DynamicBar/DynamicBar';

import Widget1 from "../Widget1/Widget1"
import Widget2 from '../Widget2/Widget2';
import Widget3 from "../Widget3/Widget3";
import Widget4 from '../Widget4/Widget4';
import Widget5 from "../Widget5/Widget5";

function AxeControlMain({timerRef}) {

    const { Axe } = useContext(SystemContext);
    const { Icon , setIcon } = useContext(SystemContext);
    const { setDisplay } = useContext(SystemContext);

    // 만약 타이머가 존재한다면 타이머 삭제
    if (timerRef.current) {

        clearTimeout(timerRef.current);
    }

    useEffect(() => {

        if (Icon === null) {

            if (Axe === "down" || Axe === "up")  setIcon("calendar")
    
            else return
    
        }
    
        else if (Icon === "calendar") {

            if (Axe === "down") setIcon("camera")

            else if (Axe === "up")  setIcon("setting")

            else return
        }

        else if (Icon === "camera") {

            if (Axe === "down") setIcon("commue")

            else if (Axe === "up")  setIcon("calendar")

            else return
        }

        else if (Icon === "commue") {

            if (Axe === "down") setIcon("setting")

            else if (Axe === "up")  setIcon("camera")

            else return
        }

        else if (Icon === "setting") {

            if (Axe === "down") setIcon("calendar")

            else if (Axe === "up")  setIcon("commue")

            else return
        }

        else return

    },[Axe])

    // 타이머 재설정
    timerRef.current = setTimeout(() => {

        // 10초 동안 감지가 없다면 실행할 함수의 내용을 입력
        setIcon(null)
        setDisplay('mainscreen')
        

    }, 10000);  // 10초 설정
}

function ButtonControlMain({ timerRef }) {

    const { setDisplay } = useContext(SystemContext);
    const { Icon } = useContext(SystemContext);
    const { Button } = useContext(SystemContext);

    useEffect(() => {
        if (Button === "X") {
            if (Icon === null) return;

            // 타이머 제거
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            if (Icon === "calendar") setDisplay("selectscreen");
            else if (Icon === "camera") setDisplay("selectscreen");
            else if (Icon === "commue") setDisplay('selectscreen');
        }
    });
}

const Main = () => {

    const { Icon } = useContext(SystemContext);

    const timerRef = useRef(null);

    return(

        <div>
            <AxeControlMain timerRef={timerRef} />
            <ButtonControlMain timerRef={timerRef} />
            <div className='ClientScreen'>
                <div className='ClientHead'>
                    <div className='NOTI'> 로직을 따로 작성하여 추후 추가 예정  </div>
                    <div className='BAR'> <DynamicBar /> </div>
                </div>
                <div className='ClientBody'>
                    <div className='ClientMenu'>
                        <div className={`ClientIcon ${Icon === "calendar" ? "active" : ""}`}> 📅 </div>
                        <div className={`ClientIcon ${Icon === "camera" ? "active" : ""}`}> 📷 </div>
                        <div className={`ClientIcon ${Icon === "commue" ? "active" : ""}`}> 📋 </div>
                    </div>
                    <div className='ClientBoard'>
                        <div className='MainScreen'>
                            <div className='WIDGET1'> <Widget1/> </div>
                            <div className='MainScreen-right'>
                                <div className='MainScreen-split'>
                                    <div className='MainScreen-left'>
                                        <div className='WIDGET2'> <Widget2/> </div>
                                        <div className='WIDGET3'> <Widget3/> </div>
                                    </div>
                                    <div className='WIDGET4'>
                                        <Widget4 />
                                    </div>
                                </div>
                                <div className='WIDGET5'> <Widget5/> </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Main;