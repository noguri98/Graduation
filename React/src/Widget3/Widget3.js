
import { useState, useEffect } from 'react';
import axios from 'axios';

import './Widget3.css'

const Widget3 = () => {

    const host = window.location.hostname
    
    const [ lunch, setlunch ] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://${host}:5001/lunch`);
                if (response.data) {
                    setlunch(response.data);
                }
            } catch (error) {
                console.error("Error fetching lunch data:", error);
            }
        };

        fetchData(); // 컴포넌트가 마운트될 때 한 번만 실행

    }, [host]);

    const renderMenu = (menu) => {
        return menu.split(', ').map((item, index) => (
            <li key={index}>{item}</li>
        ));
    };

    return (

        <div className="WIDGET3">
            <div className="Widget3Frame">
            {lunch && (
                    <div className="lunch-container">
                        <div className="lunch-column">
                            <h2> 오늘 점심</h2>
                            <ul>{renderMenu(lunch[0][0])}</ul>
                        </div>
                        <div className="lunch-column">
                            <h2> 내일 점심 </h2>
                            <ul>{renderMenu(lunch[1][0])}</ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

}

export default Widget3;