import React, { useEffect, useState } from 'react';
import { ISchedulesDataProps, ISedules } from '../../types';
import { positionSchedules } from '../../utils/position';
import dayjs from 'dayjs';

// scss
import './index.scss';

export default function SchedulesData(props: ISchedulesDataProps) {
    const {
        schedules = [],
        date,
        clickSchedule,
        rightMouseClick,
    } = props;
    // 相同时间内是第几个日程
    let sortNumber = 0;
    // 计算相同时间段内的日程数
    const [sameTimeScheduleNumber, setSameTimeScheduleNumber] = useState(0);

    useEffect(() => {
        const sameNum = positionSchedules(schedules, date.unix(), date.endOf('day').unix());
        setSameTimeScheduleNumber(sameNum);
    }, [date, schedules])

    const handleContextMenue = (e: React.MouseEvent, schedule: ISedules) => {
        if (e.preventDefault) {
            e.preventDefault();
        }

        rightMouseClick && rightMouseClick(e, schedule);
    }

    const handleClickSchedule = (event: React.MouseEvent, schedule: ISedules) => {
        clickSchedule && clickSchedule(event, schedule);
    }
    return (
        <>
            {
                schedules.map((item: ISedules, index: number) => {
                    // 在时间范围内的日程
                    if (item.end <= date.startOf("day").unix() || item.start > date.endOf("day").unix()) {
                        return;
                    }
                    // 计算相同时间段内的该日程是第几个
                    sortNumber++;
                    
                    // 日程经历的时间小时数
                    const goingDuration = dayjs.unix(item.end).diff(dayjs.unix(date.unix()), "hour", true);
                    let scheduleAllStyle: any;
                    // 时间轴的总高度
                    const totalHeight = 52 * 24;
                    // 一天的分钟数
                    const dayMinute = 24 * 60;
                    // 日程开始时间换算成分钟数
                    let startMinute = dayjs.unix(item.start).hour() * 60 + dayjs.unix(item.start).minute();
                    if (item.start < date.unix()) {
                        startMinute = 0
                    }

                    scheduleAllStyle = {
                        color: item.color,
                        borderLeft: `2px solid ${item.borderColor}`,
                        top: `${totalHeight / dayMinute * startMinute}px`,
                        width: `calc(${100 / sameTimeScheduleNumber}% - 1px)`,
                        left: `${(sortNumber - 1) * (100 / sameTimeScheduleNumber)}%`,
                        height: `${54 * goingDuration}px`,
                        minHeight: '27px',
                        maxHeight: 52 * 24,
                        ...item.customStyle,
                    }

                    const scheduleRightStyle = {
                        backgroundColor: item.bgColor,
                        height: '100%',
                        ...item.customStyle
                    }
                    
                    return <div
                        date-type="schedule"
                        className="rm-calendar-schedule-block"
                        style={scheduleAllStyle}
                        key={index}
                        title={item.title}
                        onClick={(e) => handleClickSchedule(e, item)}
                        onContextMenu={(e) => handleContextMenue(e, item)}
                    >
                        <div
                            date-type="schedule"
                            className="rm-calendar-schedule-right"
                            style={scheduleRightStyle}
                        >
                            <div date-type="schedule" className="rm-calendar-schedule-title">
                                {item.title}
                            </div>
                            <div date-type="schedule" className="rm-calendar-schedule-location">
                                {item.location}
                            </div>
                        </div>
                    </div>
                })
            }
        </>
    )
}