
import { useContext } from 'react';
import { SystemContext } from '../ClientSystem';

import "../Client.css"

import DynamicBar from '../DynamicBar/DynamicBar';

import SelectCalendar from "../SelectCalendar/SelectCalendar"
import SelectCamera from "../SelectCamera/SelectCamera"
import SelectCommue from "../SelectCommue/SelectCommue"

const Select = () => {

    const { Icon } = useContext(SystemContext);

    return(

        <div>
            <div className='ClientScreen'>
                <div className='ClientHead'>
                    <div className='NOTI'> 로직을 따로 작성하여 추후 추가 예정  </div>
                    <div className='BAR'><DynamicBar/> </div>
                </div>
                <div className='ClientBody'>
                    <div className='ClientMenu'>
                        <div className={`ClientIcon ${Icon === "calendar" ? "active" : ""}`}> 📅 </div>
                        <div className={`ClientIcon ${Icon === "camera" ? "active" : ""}`}> 📷 </div>
                        <div className={`ClientIcon ${Icon === "commue" ? "active" : ""}`}> 📋 </div>
                    </div>
                    <div className='ClientBoard'>
                        {Icon === "calendar" ? <SelectCalendar/> : null}
                        {Icon === "camera" ? <SelectCamera/> : null}
                        {Icon === "commue" ? <SelectCommue/> : null}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Select;