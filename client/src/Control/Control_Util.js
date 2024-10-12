export function Test() {

    console.log('Test')
}

/*
    requestAnimationFrame()의 원형은 requestAnimationFrame(callback)이다. 즉 매개변수로 지정한 함수를 반복적으로 호출하는 것이다.

    requestAnimationFrame(Connect)과 같이 
*/

export function Connect() {

        const connect = navigator.getGamepads();
        const device = connect[0];

        return device;
}

export function GamepadCheck(device) {

        // 버튼 상태 확인
        for (let i = 0; i < device.buttons.length; i++) {
            if (device.buttons[i].pressed) return;
        }

        // 축 상태 확인
        for (let i = 0; i < device.axes.length; i++) {
            if (Math.abs(device.axes[i]) > 0.1) return;
        }
}