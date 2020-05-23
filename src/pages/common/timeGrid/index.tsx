import React from 'react';
import {ITimeGridProps} from '../../types';
import {getTimeZone} from '../../utils/timeLine';

// scss
import './index.scss';

export default function TimeGrid(props: ITimeGridProps) {
    const {
        isWhichHour
    } = props;
    const time = getTimeZone(isWhichHour);

    return (
        <div className="rm-calendar-timegrid-time"
            style={{height: 52 * 24}}
        >
            {
                time.map((itemTime, index) => {
                    return (
                        <div className="rm-calendar-timegrid-hour" key={index}>
                            <span className="rm-calendar-timegrid">{itemTime}</span>
                        </div>
                    )
                })
            }
            
        </div>
    )
}