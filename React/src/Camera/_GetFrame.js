
// 서버의 '/camera'에게 프레임 요청

import "./Camera.css"

export default function GetFrame() {

    const host = window.location.hostname

    return (

        <div className="ShowFrame">
            <img src={`http://${host}:5001/camera`} alt="MAINCAMERA" className= "GetFrameData" />
        </div>
    )
}