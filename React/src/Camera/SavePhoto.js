
import React, { useEffect, useState } from 'react';

import { io } from 'socket.io-client';



const SavePhoto = () => {

    const socket = io(`http://${window.location.hostname}:5001`); // 서버 주소에 맞게 수정하세요.

    const [image, setImage] = useState(null);
    const [refresh, setRefresh] = useState(false); // 리렌더링을 위한 상태 추가

    useEffect(() => {
        // 서버로부터 사진이 촬영되었을 때 수신
        socket.on('PhotoCaptured', (data) => {

            setImage(`data:image/jpeg;base64,${data.image}`); // base64로 인코딩된 이미지를 설정
            
            // 10초 후에 refresh 상태를 변경하여 리렌더링
            const timer = setTimeout(() => {

                setRefresh(prev => !prev); // 상태를 반전시켜 리렌더링 유도
                setImage(null); // 이미지 상태를 초기화

            }, 15000);

            // 컴포넌트 언마운트 시 타이머 클리어
            return () => clearTimeout(timer);
        });

        // 컴포넌트 언마운트 시 소켓 이벤트 제거
        return () => {

            socket.off('PhotoCaptured');
        };

    }, []);

    return (
        <>
        {image && <img src={image} alt="촬영된 사진" style={{ width: '100%', height: '100%' }} />}
        </>
    )
}

export default SavePhoto;