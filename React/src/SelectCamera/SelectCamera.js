
import { useContext, useEffect } from 'react';
import { SystemContext } from '../ClientSystem';

import "../Select/Select.css"

import { useState, useRef } from 'react';

import io from 'socket.io-client';

import SavePhoto from '../Camera/SavePhoto';

function AxeControlSelect({menu, setMenu}) {

    const { Axe } = useContext(SystemContext);

    useEffect(() => {

        if (menu === null) {

            switch (Axe) {
    
                case 'left':
    
                case 'right':
    
                case 'up':
    
                case 'down':
    
                    setMenu('button1')
                    break
            } 
        }
    
        if (menu === 'button1') {
    
            switch (Axe) {
    
                case 'left':
                    break
    
                case 'right':
                    setMenu('button4')
                    break
    
                case 'up':
                    break
    
                case 'down':
                    setMenu('button2')
                    break
            }
        }
    
        if (menu === 'button2') {
    
            switch (Axe) {
    
                case 'left':
                    break

                case 'right':
                    setMenu('button5');
                    break
    
                case 'up':
                    setMenu('button1');
                    break
    
                case 'down':
                    setMenu('button3');
                    break
    
            } 
        }

        if (menu === 'button3') {

            switch (Axe) {
    
                case 'left':
                    break
    
                case 'right':
                    setMenu('button6');
                    break
    
                case 'up':
                    setMenu('button2');
                    break
    
                case 'down':
                    break
    
            } 
        }

        if (menu === 'button4') {

            switch (Axe) {
    
                case 'left':
                    setMenu('button1')
                    break
    
                case 'right':
                    break
    
                case 'up':
                    break
    
                case 'down':
                    setMenu('button5')
                    break
    
            } 
        }

        if (menu === 'button5') {

            switch (Axe) {
    
                case 'left':
                    setMenu('button2')
                    break
    
                case 'right':
                    break
    
                case 'up':
                    setMenu('button4')
                    break
    
                case 'down':
                    setMenu('button6')
                    break
    
            } 
        }

        if (menu === 'button6') {

            switch (Axe) {
    
                case 'left':
                    setMenu('button3')
                    break
    
                case 'right':
                    break
    
                case 'up':
                    setMenu('button5')
                    break
    
                case 'down':
                    break
    
            } 
        }
    },[Axe])
    
}

function ButtonControlSelect({menu, camMode, setCamMode}) {
    
    const { setDisplay, Button } = useContext(SystemContext);

    const [socket] = useState(() => io(`http://${window.location.hostname}:5001`));

    useEffect(() => {

        if (Button === "Y") {
            setDisplay("mainscreen");
        }

        if (Button === "A") {

            switch (menu) {

                case 'button1':
                    console.log("3초 타이머");
                    setTimeout(() => {
                        
                        socket.emit('PhotoCapture');
        
                    }, 3000);
                    
                    break;

                case 'button2':
                    setTimeout(() => {
                        socket.emit('PhotoCapture');
        
                    }, 5000);
                    
                    break;

                case 'button3':
                    setTimeout(() => {
                        socket.emit('PhotoCapture');
        
                    }, 10000);
                    
                    break;

                default:
                    return;
            }

            
        }

        if (Button === "L") {

            switch (camMode) {

                case 'normal' :
                    setCamMode('gray')
                    break

                case 'emboss' :
                    setCamMode('normal')
                    break
                
                case 'cartoon' :
                    setCamMode('emboss')
                    break

                case 'vibrant' :
                    setCamMode('cartoon')
                    break

                case 'gray' :
                    setCamMode('vibrant')
                    break
                
            }
        }

        if (Button === "R") {

            switch (camMode) {

                case 'normal' :
                    setCamMode('emboss')
                    break

                case 'emboss' :
                    setCamMode('cartoon')
                    break

                case 'cartoon' :
                    setCamMode('vibrant')
                    break

                case 'vibrant' :
                    setCamMode('gray')
                    break

                case 'gray' :
                    setCamMode('normal')
                    break
            }
        }

    }, [Button, setCamMode]);

    useEffect(() => {

        fetch('http://localhost:5001/display', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ display: camMode }),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    
    }, [camMode]);

    return null;
}

const SelectCamera = () => {

    const host = window.location.hostname

    const [menu, setMenu] = useState(null)
    const [camMode, setCamMode] = useState("normal")

    const timerRef = useRef(null);

   

    return (

        <div className="SelectScreen">
            <AxeControlSelect menu={menu} setMenu={setMenu} />
            <ButtonControlSelect menu={menu} camMode={camMode} setCamMode={setCamMode} />
            <div className="SelectCamera">
                <div className="CameraShow">
                    <img src={`http://${host}:5001/camera`} alt="SELECTCAMERA" className= "CameraFrame"/>
                </div>
            </div>
            <div className="CameraOption">
                <div className="OptionFrame">
                    <div className="CameraMenu">
                        <div className='CameraMenu-split'>
                            {/* Button1 */}
                            {/* <div className="CameraButton"> */}
                            <div className={`CameraButton ${menu === "button1" ? "active" : ""}`}>
                                <code className="CameraButtonText"> 3초 타이머 촬영 </code>
                            </div>
                            {/* Button2 */}
                            <div className={`CameraButton ${menu === "button2" ? "active" : ""}`}>
                                <code className="CameraButtonText"> 5초 타이머 촬영 </code>
                            </div>
                            {/* Button3 */}
                            <div className={`CameraButton ${menu === "button3" ? "active" : ""}`}>
                                <code className="CameraButtonText"> 10초 타이머 촬영 </code>
                            </div>
                        </div>
                        {/*<div className='CameraMenu-split'>
                           
                            <div className={`CameraButton ${menu === "button4" ? "active" : ""}`}>
                                <code className="CameraButtonText"> 인생한방컷 </code>
                            </div>
                           
                            <div className={`CameraButton ${menu === "button5" ? "active" : ""}`}>
                                <code className="CameraButtonText"> 인생반컷 </code>
                            </div>
                           
                            <div className={`CameraButton ${menu === "button6" ? "active" : ""}`}>
                                <code className="CameraButtonText"> 인생네컷 </code>
                            </div>
                        </div>*/}
                    </div>
                    <div className="PhotoBox">
                        <SavePhoto />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectCamera