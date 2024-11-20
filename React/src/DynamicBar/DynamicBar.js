

import { useContext } from "react"
import { SystemContext } from "../ClientSystem"

import { useEffect, useState } from "react"

import "./DynamicBar.css"

import { useSpring, animated, config } from 'react-spring'


function DynamicIcon({onDynamicIcon}) {

    const { Icon } = useContext(SystemContext)

    useEffect(() => {

        if (Icon === null)  onDynamicIcon(null);

        else if (Icon === "calendar") onDynamicIcon("📅")

        else if (Icon === "camera") onDynamicIcon("📷")

        else if (Icon === "commue") onDynamicIcon("📋")

        else return

    },[onDynamicIcon])
}

function DynamicMessage({onDynamicMessage}) {

    const { Display } = useContext(SystemContext)
    const { Icon } = useContext(SystemContext)

    useEffect(() => {

        if (Display === "mainscreen") {
            
            if (Icon == null) onDynamicMessage("MAIN 화면입니다.")

            else if (Icon === "calendar")   onDynamicMessage("캘린더에 진입하려면 Ⓧ 누르세요.")

            else if (Icon === "camera")   onDynamicMessage("카메라에 진입하려면 Ⓧ 누르세요.")

            else if (Icon === "commue")   onDynamicMessage("커뮤니티에 진입하려면 Ⓧ 누르세요.")
        }
    
        else if (Display !== "mainscreen") {

            if (Icon === "calendar")    onDynamicMessage(" Ⓛ : 이전달  Ⓡ : 다음달 Ⓨ : 나가기")

            else if (Icon === "camera") onDynamicMessage("Ⓛ : 이전 필터 Ⓡ : 다음 필터 Ⓐ : 촬영 선택 Ⓨ : 나가기")

            else if (Icon === "commue") onDynamicMessage("Ⓨ ; 나가기")
        }
    })
}

const DynamicBar = () => {

    const { Icon } = useContext(SystemContext)
    const { Display } = useContext(SystemContext)

    const [ IconData , setIconData ] = useState(null)
    const [ MessageData , setMessageData ] = useState(null)

    const [ Show , setShow ] = useState(false)

    // 애니메이션 속도 제어를 위한 설정
    const slowConfig = {
        ...config.molasses,
        duration: 350 // 애니메이션 지속 시간 (밀리초)
    }

    const [standardProps, standardApi] = useSpring(() => ({
        iconLeft: '0vw',
        messageRight: '0vw',
        opacity: 1,
        config: slowConfig // 느린 애니메이션 설정 적용
    }))

    const [fullProps, fullApi] = useSpring(() => ({

        width: '35.5vw',
        opacity: 0,
        config: slowConfig, // 느린 애니메이션 설정 적용
        onRest: () => {
            if (fullProps.opacity.get() === 1) {
                setShow(true)
            }
            else {
                setShow(false)
            }
        }
    }))

    function GetDynamicIcon(onDynamicIcon) {

        setIconData(onDynamicIcon)
    }

    function GetDynamicMessage(onDynamicMessage) {

        setMessageData(onDynamicMessage)
    }

    useEffect(() => {

        setShow(false)

        if (Icon === null || Display === "selectscreen") {

            standardApi.start({ iconLeft: '1vw', messageRight: '1vw', opacity: 0 })
            fullApi.start({ width: '35.5vw', opacity: 1 })
        } 
        
        else if (Icon !== "main" && Display === "mainscreen") {

            standardApi.start({ iconLeft: '0vw', messageRight: '0vw', opacity: 1 })
            fullApi.start({ width: '0vw', opacity: 0 })
        }

    },[Icon, Display, standardApi, fullApi])

    return (

        <>
        <DynamicIcon onDynamicIcon={GetDynamicIcon} />
        <DynamicMessage onDynamicMessage={GetDynamicMessage}/>

        <div className="dynamic_bar">
            <animated.div style={{ opacity: standardProps.opacity }}>
                <animated.div className="split_bar_icon" style={{left: standardProps.iconLeft}}> 
                    <div className="icon_text"> {IconData} </div>
                </animated.div>
                <animated.div className="split_bar_message" style={{right: standardProps.messageRight}}>
                    <div className="message_text"> {Display === "mainscreen" && Icon !== null ? MessageData : null} </div>
                </animated.div>
            </animated.div>
            <animated.div className="full_bar_message" style={{width: fullProps.width,opacity: fullProps.opacity}}>
                {Show && (<div className="message_text"> {Display === "selectscreen" || Icon === null ? MessageData : null} </div>)}
            </animated.div>
            </div>
        </>
    )
}

export default DynamicBar


