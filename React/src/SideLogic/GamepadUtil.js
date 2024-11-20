
import React, { useCallback, useEffect, useRef } from "react";

export function ControlData({onJoystick}) {

    // 이전 게임패드 상태를 저장하기 위한 useRef
    const prevGamePadStateRef = useRef({ buttons: [], axes: [] });

    // buttons 배열 비교 함수
    function buttonsEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i].pressed !== b[i].pressed) return false;
        }
        return true;
    }

    // axes 배열 비교 함수
    function axesEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    // GamePad 상태를 감지하는 함수
    const senseGamePad = useCallback(() => {
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[0];

        if (gamepad) {
            const currentGamePadState = {
                buttons: gamepad.buttons.map(button => ({
                    pressed: button.pressed
                })),
                axes: gamepad.axes
            };

            // 버튼이나 축(axes)이 변경되었는지 확인합니다.
            let buttonsChanged = !buttonsEqual(prevGamePadStateRef.current.buttons, currentGamePadState.buttons);
            let axesChanged = !axesEqual(prevGamePadStateRef.current.axes, currentGamePadState.axes);

            if (buttonsChanged || axesChanged) {
                // 상태 변화가 있을 경우 상위 컴포넌트에 데이터를 전달합니다.
                onJoystick(currentGamePadState);
                // 이전 상태를 현재 상태로 업데이트합니다.
                prevGamePadStateRef.current = currentGamePadState;
            }
        }
        
        // 다음 애니메이션 프레임에서 다시 상태를 감지합니다.
        requestAnimationFrame(senseGamePad);
    }, [onJoystick]); // 의존성 배열에 onJoystick을 추가하여 이 함수가 해당 prop이 변경될 때만 재생성되도록 합니다.

    useEffect(() => {
        // 컴포넌트가 마운트될 때 상태 감지 시작
        const animationFrameId = requestAnimationFrame(senseGamePad);
        
        // 컴포넌트가 언마운트될 때 애니메이션 프레임 요청을 취소합니다.
        return () => cancelAnimationFrame(animationFrameId);
    }, [senseGamePad]);

    return null; // 이 컴포넌트는 UI를 렌더링하지 않으므로 null을 반환합니다.
}

export function AxeData({onAxe}) {

    function ProcessAxe(array) {

        if (array[0] === 1)    onAxe("right")

        else if (array[0] === -1)   onAxe("left")

        else if (array[1] === 1)    onAxe("down")

        else if (array[1] === -1)   onAxe("up")

        else if (array[0] !== 1 && array[1] !== 1) onAxe(null)
    }

    function GetAxe(onJoystick) {

        const array = onJoystick.axes

        ProcessAxe(array)
        
    }

    return (

        <div>
            <ControlData onJoystick={GetAxe}/>
        </div>
    )
}

export function ButtonData({onButton}) {

    function ProcessButton(array) {

        if (array[0].pressed)  onButton("X")

        else if (array[1].pressed)  onButton("A")

        else if (array[2].pressed)  onButton("B")
            
        else if (array[3].pressed)  onButton("Y")

        else if (array[4].pressed)  onButton("L")

        else if (array[5].pressed)  onButton("R")

        else if (array[8].pressed)  onButton("SELECT")

        else if (array[9].pressed)  onButton("START")

        else onButton(null)

    }

    function GetButton(onJoystick) {

        const array = onJoystick.buttons

        ProcessButton(array)
        
    }

    return (

        <div>
            <ControlData onJoystick={GetButton}/>
        </div>
    )
}