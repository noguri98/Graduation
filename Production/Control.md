# Control 컴포넌트

컴퓨터에 연결된 Gamepad의 입력을 감지하고 그 값을 코드 작성에 용이하도록 가공하여 App.js로 전달하는 컴포넌트이다.

## 기능

> 게임패드 연결

> 게임패드 입력 감지

> 감지된 데이터 가공

> 가공된 데이터 전달

## 기록

> 2024.08.13

    - Create Control.js

        > Control 폴더 내에 최상위에 위치한 컴포넌트
    
    - Connect App & Control

        > React 실행할 때 Control.js 컴포넌트를 로드하도록 설정

    - Create Control_Util.js

        > Control.js에서 사용될 유틸리티 함수들을 모아놓은 모듈

    - Connect Control & Control_Util

        > Control.js 컴포넌트가 로드될 때 Control_Util.js 모듈을 불러오도록 설정

    - Update Control_Util.js

        > Test 함수를 생성하여 콘솔 출력을 확인

    {/*
        확인 결과 콘솔 출력이 정상적으로 확인되었고 출력은 단 한 번만 이루어졌다.
        코드를 수정하고 저장한다고 콘솔 출력이 자동으로 이루어지는 것이 아니라 웹 페이지를 새로고침해야 콘솔 출력이 변화되었다.
    */}

    | Commit Control v0.0.0

    - Update Control & Control_Util

        > Connect 함수를 생성하고 게임패드 연결 로직을 구현

        > Control 컴포넌트에서 Connect 함수를 호출하고 반환 값을 변수에 저장하는 로직을 구현

        > GamepadCheck 함수를 생성하고 게임패드 입력 감지 로직을 구현

        > Control 컴포넌트에서 GamepadCheck 함수를 호출하는 감지된 값을 출력하는 로직을 구현

    | Commit Control v0.0.1


## 정보

    - requestAnimationFrame()의 원형은 requestAnimationFrame(callback)이다. 즉 매개변수로 지정한 함수를 반복적으로 호출하는 것이다.

    - 
