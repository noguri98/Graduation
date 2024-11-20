
import { useState , useEffect } from "react"


import "./AddUser.css"

import axios from 'axios';

import { useLocation, useNavigate } from "react-router-dom";

const AddUser = () => {

    const location = useLocation(); // 현재 위치 가져오기
    const queryParams = new URLSearchParams(location.search); // 쿼리 파라미터 가져오기
    const userID = queryParams.get("userID")

    const navigate = useNavigate();

    const [UserID, setUserID] = useState(userID); // userID 상태 설정
    const [UserName, setUserName] = useState('');
    const [UserPhone, setUserPhone] = useState('');

    const host = window.location.hostname

    const submitAddUser = async () => {
        try {

            const response = await axios.post(`http://${host}:5001/adduser`, {
                UserID: UserID,
                InputUserName: UserName,
                InputUserPhone: UserPhone
            });

           // 서버에서 받은 메시지를 alert로 표시
           alert(response.data.message);

           // User.js로 이동
           navigate(`/user?userName=${UserName}`); // UserName을 쿼리 파라미터로 전달

        } catch (error) {

           // 오류 발생 시 오류 메시지를 alert로 표시
           alert(error.response?.data?.error || "An error occurred");
        }
    };

    return (
        <div>
            <div className="AddUser">
                <div className="AddUserScreen">
                    <div className="AddUserHead"> 사용자 추가 옵션 </div>
                    <div className="AddUserBody">
                        <div className="AddUserMenu"> 
                            <code> 사용자 ID </code>
                            <div className="AddUserID"> 
                                <code className="UserID"> {UserID} </code>
                            </div>
                        </div>
                        <div className="AddUserMenu"> 
                            <code> 학생 이름 </code>
                            <input 
                                className="InputUserName"
                                value={UserName}
                                onChange={(e) => setUserName(e.target.value)}
                            /> 
                        </div>
                        <div className="AddUserMenu"> 
                            <code> 휴대 전화 </code>
                            <input 
                                className="InputUserPhone" type="tel" pattern="[0-9]*" inputMode="numeric"
                                value={UserPhone}
                                onChange={(e) => setUserPhone(e.target.value)}
                            />
                        </div>
                        <button className="transferData" onClick={submitAddUser}> 제출 </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddUser