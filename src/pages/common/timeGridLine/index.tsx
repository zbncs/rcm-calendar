import React, { useMemo } from 'react';
import {getTimeZone} from '../../utils/timeLine';
import {ITimeGridLineProps} from '../../types';
import AlignSchedulesLine from '../alignLine/index';
import SchedulesData from '../data/index';

// scss
import './index.scss';


export default function TimeGridLine(props: ITimeGridLineProps) {
    const {
        name,
        isWhichHour = "24",
        schedules,
        date,
        clickSchedule,
        clickBlank,
        dbclickBlank,
        rightMouseClick,
    } = props;
    const time = getTimeZone(isWhichHour);
    // 单击空白处
    const handleClickBlank = (event: React.MouseEvent, timeStart: string) => {
        const hour = timeStart.slice(0, 2);
        // 获取点击空白时刻的开始时间
        const timeSeconds = new Date().setHours(Number(hour), 0, 0, 0) / 1000;
        clickBlank && clickBlank(event, timeSeconds);
    }
    // 双击空白处
    const handleDbClickBlank = (event: React.MouseEvent, timeStart: any) => {
        const hour = timeStart.slice(0, 2);
        // 获取点击空白时刻的开始时间
        const timeSeconds = new Date().setHours(Number(hour), 0, 0, 0) / 1000;
        dbclickBlank && dbclickBlank(event, timeSeconds);
    }

    return useMemo(() => (
        <div className="rm-calendar-timegrid-right" style={{height: 52 * 24}}>
            <div className="rm-calendar-timegrid-grid">
                {
                    time.map((item, index) => (
                        <div className="rm-calendar-timegrid-gridline"
                            onClick={(e) => handleClickBlank(e, item)} 
                            onDoubleClick={(e) => handleDbClickBlank(e, item)}
                            key={index}>
                        </div>
                    ))
                    
                }
            </div>
            { name === 'week' ?
                <AlignSchedulesLine 
                    date={date}
                    schedules={schedules}
                    clickSchedule={clickSchedule}
                    rightMouseClick={rightMouseClick}
                    clickBlank={clickBlank}
                    dbclickBlank={dbclickBlank}
                /> : 
                <SchedulesData
                    clickSchedule={clickSchedule}
                    date={date} 
                    schedules={schedules}
                    rightMouseClick={rightMouseClick}
                />
            }
        </div>
    ), [schedules, date])
}