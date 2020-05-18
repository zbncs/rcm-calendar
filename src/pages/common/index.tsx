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
        isWhichHour,
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
    // 时刻周的每天的宽度
    const [dayWidth, setDayWidth] = useState<number>(0);
    // 时刻线的位置
    const top = totalHeight / dayMinute * (currentTime.hour() * 60 + currentTime.minute());
    useEffect(() => {
        const timer = setInterval(function() {
            setCurrentTime(dayjs());
           }, 1000)
           if (scrollRef.current) {
               // 左侧时间的间距和每天的border
                const leftWidth = 74 + 7; 
                // 每一天的宽度
                const dWidth = ((scrollRef.current! as any).getBoundingClientRect().width - 74) / 7;
                // 几天是本周的第几天
                const nowDate = dayjs().day() + 1;
                (scrollRef.current! as any).scrollTop = top - 307;
                setDayWidth(dWidth * nowDate - leftWidth);
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
                <div className="rm-calendar-timegrid-guide-line-today" style={{left: `${dayWidth}px`}}></div>
                <div className="rm-calendar-timegrid-guide-line"></div>
            </div>
        </div>
    )
}