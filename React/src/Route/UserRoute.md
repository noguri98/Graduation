
# 2024-11-04

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