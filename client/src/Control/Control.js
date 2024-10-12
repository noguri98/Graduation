
/*
    지금 Control.js 컴포넌트에서는 Control은 한 번 실핼한다. 그렇기 때문에 현재 Connect 함수 또한 한 번 실행한다고 할 수 있다.
*/

import { Connect , GamepadCheck } from './Control_Util'

const Control = () =>{

    const device = Connect();

    if (device) {

        GamepadCheck(device);

        console.log(device);
    }

    else {

        requestAnimationFrame(Control);
    }

    
}

export default Control