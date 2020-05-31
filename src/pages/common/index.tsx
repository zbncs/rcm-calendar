import React, { useEffect, useState, useRef } from 'react';
import TimeGrid from './timeGrid/index';
import TimeGridLine from './timeGridLine/index';
import {ICommonProps} from '../types';
import dayjs from 'dayjs';

// scss
import './index.scss';

export default function Common(props: ICommonProps) {
    const {
        name,
        date,
        isWhichHour = "24",
        schedules,
        clickSchedule,
        clickBlank,
        dbclickBlank,
        rightMouseClick,
    } = props;

    const totalHeight = 52 * 24; // 总高度
    const dayMinute = 24 * 60; // 一天的总分钟数
    const [currentTime, setCurrentTime] = useState(dayjs());
    const scrollRef = useRef(null);
    // 第几天
    const [hasDay, setHasDay] = useState<number>(0);
    // 时刻线的位置
    const top = totalHeight / dayMinute * (currentTime.hour() * 60 + currentTime.minute());
    useEffect(() => {
        const timer = setInterval(function() {
            setCurrentTime(dayjs());
           }, 1000)
           if (scrollRef.current) {
                // 定位到当前时刻
                (scrollRef.current! as any).scrollTop = top - 307;
                if (name === 'week') {
                    setHasDay(dayjs().day());
                }
                else {
                    setHasDay(0);
                }
                
           }
           return () => {
               clearInterval(timer)
           }
    }, [])

    return (
        <div className="rm-calendar-timegrid-common" ref={scrollRef}>
            <TimeGrid 
                isWhichHour={isWhichHour}
            />
            <TimeGridLine
                name={name}
                date={date}
                isWhichHour={isWhichHour}
                schedules={schedules}
                clickSchedule={clickSchedule}
                clickBlank={clickBlank}
                dbclickBlank={dbclickBlank}
                rightMouseClick={rightMouseClick}
            />
            <div 
                className="rm-calendar-timegrid-guide"
                style={{top: top}}
            >
                <div className="rm-calendar-timegrid-guide-number">{currentTime.format('HH:mm')}</div>
                <div className="rm-calendar-timegrid-guide-line-today" style={{left: `calc(${(100 / 7 * hasDay)}% + 74px)`}}></div>
                <div className="rm-calendar-timegrid-guide-line"></div>
            </div>
        </div>
    )
}