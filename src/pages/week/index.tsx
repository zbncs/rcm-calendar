import React, { useEffect, useState, useRef } from 'react';
import { IWeekProps, IDay, ISedules } from '../types';
import {getWeekDate} from '../utils/weekDate';
import Common from '../common/index';
import dayjs from 'dayjs';

// css
import './index.scss';

Week.defaultProps = {
    name: 'week'
}
let moreTop: number = 0;
export default function Week(props: IWeekProps) {
    let alldaySchedulesArr: ISedules[] = [];
    let notAlldaySchedulesArr: ISedules[] = [];
    let weekAlldaySchedulesArr: ISedules[] = [];
    const {
        name,
        date,
        schedules,
        isWhichHour,
        clickBlank,
        clickSchedule,
        dbclickBlank,
        rightMouseClick
    } = props;
    const weeDateArr = date && getWeekDate(date);
    const weekdayStart = date.startOf('week').unix();
    const weekdayEnd = date.endOf('week').endOf('day').add(1, 'second').unix();
    const [alldaySchedules, setAlldaySchedules] = useState<ISedules[]>([]);
    const [notAlldaySchedules, setNotAlldaySchedules] = useState<ISedules[]>([]);
    const [isShowMoreSchedules, setIsShowMoreSchedules] = useState(false);
    const [weekAlldaySchedules, setWeekAlldaySchedules] = useState<ISedules[]>([]);
    // 利用useRef储存值
    const sameNumRef = useRef<number[]>([]);
    let maxNUm: number[]  = [];

    useEffect(() => {
        schedules.forEach((item, index) => {
            const crossDay = dayjs.unix(item.end).diff(dayjs.unix(item.start), "day", true);
            if (item.isAllDay || crossDay >= 1) {
                alldaySchedulesArr.push(item);
            }
            else {
                notAlldaySchedulesArr.push(item);
            }
            if (item.start >= weekdayStart && item.end <= weekdayEnd && (item.isAllDay || crossDay >= 1)) {
                weekAlldaySchedulesArr.push(item);
            }
        })
        setWeekAlldaySchedules(weekAlldaySchedulesArr)
        setAlldaySchedules(alldaySchedulesArr);
        setNotAlldaySchedules(notAlldaySchedulesArr);
    }, [schedules])

    const getWeekAlldayHeight = () => {
        const max = Math.max.apply(null, sameNumRef.current);
        if (max >= 3 && !isShowMoreSchedules) { // 全天日程大于3,没展示全部日程时
            return `${4 * 26}px`;
        }
        else if (max >= 3 && isShowMoreSchedules) { // 全天日程大于3,展示全部日程时
            return `${26 *max + 2 *(max - 1) + 26}px`;
        }
        else { // 全天日程小于3
            return `${26 * max + 2 *(max - 1)}px`;
        }
    }

    const handleClickMore = () => {
        setIsShowMoreSchedules(!isShowMoreSchedules);
    }

    const handleClickSchedule = (event: React.MouseEvent, schedule: ISedules) => {
        clickSchedule && clickSchedule(event, schedule);
    }

    const handleContextMenu = (event: React.MouseEvent, schedule: ISedules) => {
        event.preventDefault();
        rightMouseClick && rightMouseClick(event, schedule);
    }

    const handleBlank = (e: React.MouseEvent, time: number, type: string) => {
       // 点击或者双击的是否是日程
       const isSchedule = (e.target as any).hasAttribute('date-type');
       if (type === 'click' && !isSchedule) {
           clickBlank && clickBlank(e, time);
       }
       else if (type === 'dbclick' && !isSchedule) {
           dbclickBlank && dbclickBlank(e, time);
       }
    }

    return (
        <div className="rm-calendar-week-container">
            <div className="rm-calendar-week-dayname-container">
                <div className="rm-calendar-week-dayname">
                    {
                        weeDateArr.map((item, index) => {
                            return (
                                <span className="rm-calendar-week-date-container" key={index}>
                                    <span className="rm-calendar-week-date-num">
                                        {item.date()}
                                    </span>
                                    <span className="rm-calendar-week-date-name">
                                        {IDay[item.day()]}
                                    </span>
                                </span>
                            )
                        })
                    }
                </div>
            </div>
            <div className="rm-calendar-daygrid-layout" style={{height: getWeekAlldayHeight()}}>
                <div className="rm-calendar-allday-left">
                    <span className="rm-calendar-allday-left-text">all day</span>
                </div>
                {alldaySchedules.length !== 0 && <div className="rm-calendar-allday-right">
                    {
                        weeDateArr.map((itemDate, index) => {
                            const dayStart = itemDate.startOf('day').unix();
                            const dayEnd = itemDate.endOf('day').add(1, 'second').unix();
                            let sameTimeNum = 0;
                            return (
                                <span 
                                    key={index}
                                    onClick={(e) => handleBlank(e, itemDate.unix(), 'click')}
                                    onDoubleClick={(e) => handleBlank(e, itemDate.unix(), 'dbclick')}
                                    className="rm-calendar-week-allday-schedules"
                                >
                                    {
                                        alldaySchedules.map((item, index) => {
                                            if (item.end <= dayStart || item.start >= dayEnd) {
                                                return;
                                            }
                                            if (
                                                (item.start >= dayStart && item.start <= dayEnd) ||
                                                (item.end >= dayStart && item.end <= dayEnd) ||
                                                (item.start <= dayStart && item.end >= dayEnd)
                                                ) {
                                                sameTimeNum++;
                                                // 用于储存本周每天的全天日程的数量
                                                maxNUm.push(sameTimeNum);
                                            }
                                            if (sameTimeNum > 3 && !isShowMoreSchedules) return;
                                            const top = !isShowMoreSchedules ? 3 * 26 : sameTimeNum * 26;
                                            moreTop = top;
                                            const scheduleStyle = {
                                                borderLeft: `2px solid ${item.borderColor}`,
                                                color: item.color,
                                                height: '26px',
                                                lineHeight: '26px',
                                                top: `${(sameTimeNum- 1) * 26 + (sameTimeNum- 1)}px`,
                                                backgroundColor: item.bgColor,
                                                ...item.customStyle,
                                            }
                                            sameNumRef.current = maxNUm;
                                            return (
                                                <div 
                                                    key={index}
                                                    date-type="schedule"
                                                    className="rm-calendar-week-allday-schedule"
                                                    style={scheduleStyle}
                                                    onClick={(e) => handleClickSchedule(e, item)}
                                                    onContextMenu={(e) => handleContextMenu(e, item)}
                                                >
                                                    <span date-type="schedule" className="rm-calendar-week-allday-schedule-title">
                                                        {item.title}
                                                    </span>
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        weekAlldaySchedules.map((item, index) => {
                                            return (
                                                sameTimeNum > 3 && item.start === dayStart && <div date-type="more" key={index} style={{top: `${moreTop + 2}px`}} className="rm-calendar-week-allday-schedules-num">
                                                <span date-type="more" onClick={handleClickMore} className="rm-calendar-allday-week-schedules-num-text">{isShowMoreSchedules ? '收起' : `还有${sameTimeNum - 3}项`}</span>
                                            </div>
                                            )
                                        })
                                    }
                                </span>
                            )
                        })
                    }
                </div>}
            </div>
            <Common 
                name={name}
                date={date} 
                isWhichHour={isWhichHour}
                schedules={notAlldaySchedules}
                clickSchedule={clickSchedule}
                clickBlank={clickBlank}
                dbclickBlank={dbclickBlank}
                rightMouseClick={rightMouseClick}
            />
        </div>
    )
}