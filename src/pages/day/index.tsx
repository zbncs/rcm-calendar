import React, { useEffect, useState } from 'react';
import Common from '../common/index';
import {IDayProps, IDay, ISedules} from '../types';
import dayjs from 'dayjs';

// scss
import './index.scss';

Day.defaultProps = {
    isWhichHour: "24",
    date: dayjs(),
    name: 'day'
}

let moreTop: number = 0;
export default function Day(props: IDayProps) {
    let alldaySchedulesArr: ISedules[] = [];
    let notAlldaySchedulesArr: ISedules[] = [];
    const {
        name,
        isWhichHour,
        schedules,
        date,
        clickSchedule,
        clickBlank,
        dbclickBlank,
        rightMouseClick,
    }  = props;

    const [alldaySchedules, setAlldaySchedules] = useState<ISedules[]>([]);
    const [notAlldaySchedules, setNotAlldaySchedules] = useState<ISedules[]>([]);
    const [isShowMoreSchedules, setIsShowMoreSchedules] = useState<boolean>(false);

    useEffect(() => {
        schedules.forEach((item) => {
            const crossDay = dayjs.unix(item.end).diff(dayjs.unix(item.start), "day", true);
            if (item.end <= date.startOf("day").unix() || item.start > date.endOf("day").unix()) {
                return;
            }
            if (item.isAllDay || crossDay >= 1) {
                alldaySchedulesArr.push(item);
            }
            else {
                notAlldaySchedulesArr.push(item);
            }
        })
        setAlldaySchedules(alldaySchedulesArr);
        setNotAlldaySchedules(notAlldaySchedulesArr);
    }, [schedules, date])

    const handleClickMore = () => {
        setIsShowMoreSchedules(!isShowMoreSchedules);
    }

    const renderAlldayHeight = () => {
        if (alldaySchedules.length > 3 && !isShowMoreSchedules) { // 全天日程大于3,没展示全部日程时
            return `108px`;
        }
        else if (alldaySchedules.length > 3 && isShowMoreSchedules) { // 全天日程大于3,展示全部日程时
            return `${26 * alldaySchedules.length + 2 *(alldaySchedules.length - 1) + 26}px`;
        }
        else { // 全天日程小于3
            return `${26 * alldaySchedules.length + 2 *(alldaySchedules.length - 1)}px`;
        }
    }

    const handleClickSchedule = (event: React.MouseEvent, schedule: ISedules) => {
        clickSchedule && clickSchedule(event, schedule);
    }

    return (
        <div className="rm-calendar-day">
            <div className="rm-calendar-day-dayname">
                <span className="rm-calendar-day-dayname-area">
                    <span className="rm-calendar-day-date-num">
                        {date.date()}
                    </span>
                    <span className="rm-calendar-day-date-name">
                        {IDay[date.day()]}
                    </span>
                </span>
            </div>
            {
                !!alldaySchedules.length && <div className="rm-calendar-allday" style={{height: renderAlldayHeight()}}>
                    <span className="rm-calendar-allday-text-container">
                        <span className="rm-calendar-allday-text">全天</span>
                    </span>
                    <span className="rm-calendar-allday-schedules">
                        {
                            alldaySchedules.map((item, index) => {
                                if (index > 2 && !isShowMoreSchedules) return;
                                const top = index * 26 + 2*(index - 1) < 0 ? 0 : index * 28;
                                moreTop = top;
                                const scheduleItemStyle = {
                                    color: item.color,
                                    borderLeft: `2px solid ${item.borderColor}`,
                                    width: 'calc(100%)',
                                    height: '26px',
                                    top: `${top}px`,
                                    backgroundColor: item.bgColor,
                                    ...item.customStyle,
                                }
                                return (
                                    <div className="rm-calendar-schedule-item"
                                        style={scheduleItemStyle}
                                        key={index}
                                        onClick={(e) => handleClickSchedule(e, item)}
                                    >
                                        {item.title}
                                    </div>
                                )
                            })
                        }
                    </span>
                    {
                        alldaySchedules.length > 3 && <div style={{top: `${moreTop + 28}px`}} className="rm-calendar-allday-schedules-num">
                                <span onClick={handleClickMore} className="rm-calendar-allday-schedules-num-text">{isShowMoreSchedules ? '收起' : `还有${alldaySchedules.length - 3}项`}</span>
                            </div>
                    }
                </div>
            }
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