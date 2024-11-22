from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO

# Lunch

import requests
from bs4 import BeautifulSoup
from datetime import datetime

# Camera

import cv2
from pyzbar.pyzbar import decode
import numpy as np
import sqlite3

# Photo

import base64

display = None
lastFrame = None

System = Flask(__name__)
CORS(System)
socketio = SocketIO(System, cors_allowed_origins="*")

# 데이터베이스 연결을 전역 변수로 설정
db_connection = sqlite3.connect("DashBoard.db")
db_cursor = db_connection.cursor()

# 프로그램이 시작될 때 웹 크롤링 정보를 클라이언트로 전송하는 라우팅 시스템
# (단방향)

@System.route('/lunch', methods=['GET'])

def transferLunch() :
    
    todayLunch, tomorrowLunch = lunchInfomation()
    
    return jsonify(todayLunch, tomorrowLunch)
    
def lunchInfomation() :
    
    url = "https://www.kopo.ac.kr/gumi/content.do?menu=4941"
    
    todayLunch = []
    tomorrowLunch = []
    
    weekList = ['월요일', '화요일', '수요일', '목요일', '금요일']
    weekindex = datetime.today().weekday()
    
    if weekindex >= 5:  # 5는 토요일, 6은 일요일
        return ["주말은 식사가 없습니다."], ["주말은 식사가 없습니다."]
    
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    
    table = soup.find('table', class_='tbl_table menu')
    
    if table is None:
        print("식단 테이블을 찾을 수 없습니다.")
        return
    
    for row in table.find_all('tr'):
        cells = row.find_all('td')
        if cells:
            date_cell = cells[0].text.strip()
            
            if date_cell == weekList[weekindex]:
                
                print(f"날짜: {date_cell}")
                meals = cells[1:]
                
                for i, meal in enumerate(meals):
                    menu_items = [item.strip() for item in meal.text.split(',')]
                    
                    if i == 1:
                        todayLunch.append(f"{', '.join(menu_items)}")
                        
            if date_cell == weekList[(weekindex + 1) % 5]:
                
                if date_cell == "월":
                    
                    continue
                
                meals = cells[1:]
                
                for i, meal in enumerate(meals):
                    menu_items = [item.strip() for item in meal.text.split(',')]
                    
                    if i == 1:
                        tomorrowLunch.append(f"{', '.join(menu_items)}")

    return todayLunch, tomorrowLunch

# 프로그램이 시작될 때 데이터베이스에서 예정된 이벤트를 클라이언트로 전송하는 라우팅 시스템
# (단뱡향)
    
@System.route("/event", methods=["GET"])

def transferEvent() :
    
    eventDatas = eventsInfomation()
    
    return jsonify(eventDatas)
    
def get_db_connection():
    connection = sqlite3.connect("DashBoard.db")
    connection.row_factory = sqlite3.Row  # 행을 딕셔너리 형태로 반환
    return connection

def eventsInfomation():
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT * FROM EVENTS")
        information = cursor.fetchall()
        
        events = []
        for event in information:
            data = {
                "start": event[1],
                "name": event[2],
                "time": event[3],
                "ex": event[4]
            }
            events.append(data)
        
        return events
    except sqlite3.Error as e:
        print(f"데이터베이스 오류: {str(e)}")  # 오류 로그 출력
        return []  # 빈 리스트 반환
    finally:
        cursor.close()
        connection.close()  # 연결 닫기

@System.route('/display', methods=['POST'])

def displayInfomation() :
    
    global display
    
    data = request.json
    display = data.get('display')
    # print(f"Received Display value: {display}")
    
    return jsonify({"message": "Display value received successfully."}), 200
    

# 연결된 Camera 장치로 읽어온 Frame을 클라이언트로 전송하는 라우팅 시스템

@System.route('/camera', methods=['GET'])

def transferFrame() :
    
    return Response(cameraFrame(), mimetype='multipart/x-mixed-replace; boundary=frame')

def cameraFrame():
    
    global lastFrame, display
    
    cap = cv2.VideoCapture(0)
    
    while True:
        
        ret, frame = cap.read()
        if not ret:
            continue

        frame = cv2.flip(frame, 1)  # frame에 저장된 프레임을 좌우반전
        
        # 서버에서 전달 받은 Display 값이 사용되는 위치
        if display == "mainscreen" :
            frame = maincameraUtil(frame)
        
        # display === "selectscreen"
        elif display == "normal" :
            frame = normalCamera(frame)
            
        elif display == "gray" :
            frame = grayCamera(frame)
            
        elif display == "emboss" :
            frame = emboss(frame)
        
        elif display == "cartoon" :
            frame = cartoon(frame)
            
        elif display == "vibrant" :
            frame = vibrant(frame)
            
        lastFrame = frame
            
        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        
# insertAttend() 생성

def maincameraUtil(frame) :
    
    scan = decode(frame)
            
    if scan:
        for obj in scan:
            points = obj.polygon
            if len(points) > 4:
                hull = cv2.convexHull(np.array([point for point in points], dtype=np.float32))
                points = hull
            
            n = len(points)
            for j in range(n):
                cv2.line(frame, (points[j].x, points[j].y), (points[(j + 1) % n].x, points[(j + 1) % n].y), (255, 0, 0), 3)
            
            # QR 코드 데이터 디코딩
            decodeData = obj.data.decode("utf-8")
            decodeData = decodeData.split('+')
            
            if len(decodeData) > 1:
                decodeData = decodeData[1]
                
                try:
                    file = sqlite3.connect("DashBoard.db")
                    conn = file.cursor()
                    
                    # 데이터베이스에 접근하여 decodeData와 같은 값을 가진 User가 있는지 확인
                    conn.execute("SELECT StudentName FROM STUDENT WHERE DecodeData = ?", (decodeData,))
                    searchData = conn.fetchone()
                    
                    if searchData is None:
                        transferDecodeData = decodeData
                        socketio.emit('SearchUser', {"User": transferDecodeData, "Signal": "false"})
                    else:
                        studentName = searchData[0]
                        socketio.emit('SearchUser', {"User": studentName, "Signal": "true"})
                        insertAttend(decodeData, studentName)
                        
                    
                    file.close()
                except Exception as e:
                    print(f"데이터베이스 처리 중 오류 발생: {str(e)}")
                    
    return frame
 
def normalCamera(frame) :
    
    return frame

def grayCamera(frame) :
    
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    return frame

def emboss(frame) :
    kernel = np.array([[0,-1,-1],
                       [1,0,-1],
                       [1,1,0]])
    return cv2.filter2D(frame, -1, kernel) + 128

def cartoon(frame) :
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 5)
    edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 9)
    color = cv2.bilateralFilter(frame, 9, 300, 300)
    
    return cv2.bitwise_and(color, color, mask=edges)

def vibrant(frame) :
    # BGR to LAB 색공간 변환
    lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)

    # L, A, B 채널 분리
    l, a, b = cv2.split(lab)

    # CLAHE (Contrast Limited Adaptive Histogram Equalization) 적용
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)

    # 채널 합치기
    limg = cv2.merge((cl, a, b))

    # LAB to BGR 색공간 변환
    final = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)

    # 채도 증가
    hsv = cv2.cvtColor(final, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    s = cv2.add(s, 20)  # 채도 증가 (20으로 적당히 설정)
    final_hsv = cv2.merge((h, s, v))
    final = cv2.cvtColor(final_hsv, cv2.COLOR_HSV2BGR)

    # 대비 약간 증가
    alpha = 1.2  # 대비 증가 정도 (1.0-3.0)
    beta = 0  # 밝기 조정 (0으로 설정하여 밝기 유지)
    final = cv2.convertScaleAbs(final, alpha=alpha, beta=beta)

    return final

def insertAttend(decodeValue, data) :   # data는 DecodeValue, decodeValue는 StudentName
    global db_cursor  # 전역 커서 사용
    day = datetime.now().strftime('%Y-%m-%d')
    weekList = ['월', '화', '수', '목', '금']
    weekindex = datetime.now().weekday()
    
    if weekindex < 5:  # Monday to Friday (0 to 4)
        db_cursor.execute("SELECT ClassName FROM CLASS WHERE ClassWeek LIKE ?", (weekList[weekindex],))
        className = db_cursor.fetchall()
        
        if className:
            classAM = className[0][0]
            classPM = className[1][0] if len(className) > 1 else None
            
            db_cursor.execute("SELECT * FROM ATTENDANCE WHERE DecodeData = ? AND AttendDate = ?", (data, day))
            existing_data = db_cursor.fetchone()

            if not existing_data:
                hh = datetime.now().strftime("%H")
                mm = datetime.now().strftime("%M")
                
                if int(hh) == 9 and int(mm) in range(60):  # 오전
                    db_cursor.execute("INSERT INTO ATTENDANCE (StudentName, ClassName, AttendDate, AttendTime) VALUES(?, ?, ?, ?)", (decodeValue, classAM, day, f"{hh}:{mm}")) 
                elif int(hh) == 14 and int(mm) in range(60):  # 오후
                    db_cursor.execute("INSERT INTO ATTENDANCE (StudentName, DecodeData, ClassName, AttendDate, AttendTime) VALUES(?, ?, ?, ?, ?)", (decodeValue, data, classAM, day, f"{hh}:{mm}")) 
                
                db_connection.commit()

@socketio.on('PhotoCapture')

def photoCapture():
    
    global lastFrame
    
    if lastFrame is not None:
        
        # 마지막 프레임을 JPEG로 인코딩
        _, buffer = cv2.imencode('.jpg', lastFrame)
        imgfile = base64.b64encode(buffer).decode('utf-8')  # 이미지를 base64로 인코딩
        
        # 클라이언트로 이미지 전송
        socketio.emit('PhotoCaptured', {'image': imgfile})
        # print("사진 촬영 완료 및 전송")
        
    else:
        print("사진 촬영 실패: 프레임이 없습니다.")
    
# /adduser에서 전달되는 데이터를 데이터베이스에 저장하는 라우팅 시스템

@System.route('/adduser', methods=['POST'])

def add_User() :
    
    data = request.json
    
    UserID = data.get('UserID')
    UserName = data.get('InputUserName')
    UserPhone = data.get('InputUserPhone')
    
    print("Parsed data:", UserID, UserName, UserPhone)

    if not all([UserID, UserName, UserPhone]):
        return jsonify({"error": "모든 필드를 입력해주세요."}), 400

    try:
        file = sqlite3.connect("/Users/nogyumin/Noguri/Project/졸업작품/DashBoard.db")
        conn = file.cursor()

        # STUDENT 테이블에 새 사용자 추가
        conn.execute("INSERT INTO STUDENT (DecodeData, StudentName, Phone) VALUES (?, ?, ?)", (UserID, UserName, UserPhone))
        file.commit()
        
        file.close()

        return jsonify({"message": "사용자가 성공적으로 추가되었습니다."}), 201

    except sqlite3.Error as e:
        return jsonify({"error": f"데이터베이스 오류: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"서버 오류: {str(e)}"}), 500

# /addevent에서 전달되는 데이터를 데이터베이스에 저장하는 라우팅 시스템

@System.route('/addevent', methods=['POST'])

def add_Event() :
    data = request.json
    userName = data.get('userName')
    eventDate = data.get('eventDate')
    eventTime = data.get('eventTime')
    eventName = data.get('eventName')
    eventDescription = data.get('eventDescription')

    # print("Received event data:", data)

    if not all([userName, eventDate, eventTime, eventName]):
        return jsonify({"error": "설명을 제외한 모든 필드를 입력해주세요."}), 400

    try:
        file = sqlite3.connect("/Users/nogyumin/Noguri/Project/졸업작품/DashBoard.db")
        conn = file.cursor()

        # EVENTS 테이블에 새 이벤트 추가
        conn.execute("INSERT INTO EVENTS (DecodeData, EventDate, EventName, EventTime, EventEx) VALUES (?, ?, ?, ?, ?)", (userName, eventDate, eventName, eventTime, eventDescription))
        
        file.commit()
        file.close()
        
        # 새로운 이벤트가 추가되었음을 클라이언트에 알림
        socketio.emit('new_event', data)
        
        return jsonify({"message": "이벤트가 성공적으로 추가되었습니다."}), 201

    except sqlite3.Error as e:
        print(f"데이터베이스 오류: {str(e)}")  # 디버깅을 위한 출력
        return jsonify({"error": f"데이터베이스 오류: {str(e)}"}), 500

    except Exception as e:
        print(f"서버 오류: {str(e)}")  # 디버깅을 위한 출력
        return jsonify({"error": f"서버 오류: {str(e)}"}), 500
    
# /selectattendance에서 전달되는 데이터를 데이터베이스에 저장하는 라우팅 시스템

@System.route('/selectattendance', methods=['POST'])

def select_Attendance() :
    
    data = request.json
    userName = data.get('userName')
    selectDate = data.get('selectDate')

    print("Received attendance data:", data)  # 디버깅을 위한 출력

    if not all([selectDate]):
        return jsonify({"error": "날짜를 입력해주세요."}), 400

    try:
        file = sqlite3.connect("/Users/nogyumin/Noguri/Project/졸업작품/DashBoard.db")
        conn = file.cursor()

        # ATTENDANCE 테이블에서 해당 사용자의 특정 날짜 출석 정보 조회
        conn.execute("SELECT AttendDate, AttendTime, ClassName FROM ATTENDANCE WHERE StudentName = ? AND AttendDate = ?", (userName, selectDate))
        result = conn.fetchall()
        
        file.close()
        
        if result:
            attendance_info = []
            for row in result:
                attendance_info.append({
                    "date": row[0],
                    "time": row[1],
                    "className": row[2]
                })
            file.close()
            return jsonify({
                "message": "출석 정보를 찾았습니다.",
                "userName": userName,
                "attendanceInfo": attendance_info
            }), 200
        else:
            file.close()
            return jsonify({
                "message": "해당 날짜의 출석 정보가 없습니다.",
                "userName": userName,
                "date": selectDate
            }), 404

    except sqlite3.Error as e:
        print(f"데이터베이스 오류: {str(e)}")  # 디버깅을 위한 출력
        return jsonify({"error": f"데이터베이스 오류: {str(e)}"}), 500

    except Exception as e:
        print(f"서버 오류: {str(e)}")  # 디버깅을 위한 출
        return jsonify({"error": f"서버 오류: {str(e)}"}), 500

# /addmessage에서 전달되는 데이터를 데이터베이스에 저장하는 라우팅 시스템

@System.route('/addmessage', methods=['POST'])

def add_message() :
    
    todayDate = datetime.now().strftime('%Y-%m-%d')
    todayTime = datetime.now().strftime("%H:%M:%S")
    
    data = request.json
    userName = data.get('userName')
    messageData = data.get('messageData')
    
    print("받은 메시지 데이터:", messageData)  # 디버깅 출력
    
    if not messageData:
        return jsonify({"error": "메시지 내용을 입력하세요."}), 400
    
    try:
        file = sqlite3.connect("/Users/nogyumin/Noguri/Project/졸업작품/DashBoard.db")
        conn = file.cursor()
        
        conn.execute("INSERT INTO MESSAGE (Date, User, Word, Time) VALUES (?, ?, ?, ?)", (todayDate, userName, messageData, todayTime))
    
        file.commit()
        file.close()

        socketio.emit('new_message', data)
        
        return jsonify({"message": "메시지가 성공적으로 전송되었습니다."}), 201
    
    except sqlite3.Error as e:
        print(f"데이터베이스 오류: {str(e)}")  # 디버깅을 위한 출력
        return jsonify({"error": f"데이터베이스 오류: {str(e)}"}), 500

    except Exception as e:
        print(f"서버 오류: {str(e)}")  # 디버깅을 위한 출력
        return jsonify({"error": f"서버 오류: {str(e)}"}), 500

@System.route("/messages", methods=["GET"])

def get_messages():
    
    file = sqlite3.connect("/Users/nogyumin/Noguri/Project/졸업작품/DashBoard.db")
    conn = file.cursor()
    
    conn.execute("SELECT * FROM MESSAGE")
    information = conn.fetchall()
    column_names = [description[0] for description in conn.description]
    result = [dict(zip(column_names, row)) for row in information]
    
    file.close()
    
    return jsonify(result)

if __name__ == "__main__" :
    socketio.start_background_task(transferFrame)
    socketio.run(System, debug=True, host="0.0.0.0", port=5001)
    
# 프로그램 종료 시 데이터베이스 연결 닫기
import atexit
atexit.register(lambda: db_connection.close())
    
    
