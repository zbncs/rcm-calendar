import React, { useEffect, useState, useRef, Fragment } from 'react';
import { IWeekProps, IDay, ISedules, IDayCN} from '../types';
import {getWeekDate} from '../utils/weekDate';
import Common from '../common/index';
import dayjs from 'dayjs';
import c from 'classnames';

// css
import './index.scss';

Week.defaultProps = {
    name: 'week',
    alldayName: '全天',
    schedules: []
}
let moreTop: number = 0;
const totalCopies = 7 * 24;
export default function Week(props: IWeekProps) {
    let alldaySchedulesArr: ISedules[] = [];
    let notAlldaySchedulesArr: ISedules[] = [];
    let weekAlldaySchedulesArr: ISedules[] = [];
    const {
        name,
        date,
        schedules = [],
        isWhichHour,
        alldayName,
        isEnglish,
        clickBlank,
        clickSchedule,
        dbclickBlank,
        rightMouseClick,
        renderHeaderTemplate,
    } = props;
    const weeDateArr = date && getWeekDate(date);
    const weekdayStart = date.startOf('week').unix();
    const weekdayEnd = date.endOf('week').endOf('day').add(1, 'second').unix();
    const [alldaySchedules, setAlldaySchedules] = useState<ISedules[]>([]);
    const [notAlldaySchedules, setNotAlldaySchedules] = useState<ISedules[]>([]);
    const [isShowMoreSchedules, setIsShowMoreSchedules] = useState(false);
    const [weekAlldaySchedules, setWeekAlldaySchedules] = useState<ISedules[]>([]);
    // 利用useRef储存值
    const sameNumRef = useRef<number>(0);
    let maxNUm: number[]  = [];
    // 
    const dayNumMp = new Map();
    // 
    const alldayRef = useRef(null);
    const [alldayWidth, setAlldayWidth] = useState(0);

    useEffect(() => {
        schedules.forEach((item, index) => {
            // const crossDay = dayjs.unix(item.end).diff(dayjs.unix(item.start), "day", true);
            if (item.isAllDay) {
                alldaySchedulesArr.push(item);
            }
            else {
                notAlldaySchedulesArr.push(item);
            }
            // 本周的全天日程
            if (
                (item.start >= weekdayStart && item.start < weekdayEnd) ||
                (item.end >= weekdayStart && item.end < weekdayEnd) ||
                (item.start <= weekdayStart && item.end >= weekdayEnd)
            ) {
                if (item.isAllDay) {
                    weekAlldaySchedulesArr.push(item);
                }
            }
        })
        setWeekAlldaySchedules(weekAlldaySchedulesArr)
        setAlldaySchedules(alldaySchedulesArr);
        setNotAlldaySchedules(notAlldaySchedulesArr);
        return () => {
            sameNumRef.current = null;
            maxNUm = null;
        }
    }, [schedules])

    useEffect(() => {
        // 
        if (alldayRef && alldayRef.current) {
            setAlldayWidth(alldayRef.current.clientWidth);
        }
    })

    const getWeekAlldayHeight = () => {
        const max = sameNumRef.current;
        if (max > 3 && !isShowMoreSchedules) { // 全天日程大于3,没展示全部日程时
            return `${4 * 26}px`;
        }
        else if (max >= 3 && isShowMoreSchedules) { // 全天日程大于3,展示全部日程时
            return `${26 *max + 2 *(max - 1) + 26}px`;
        }
        else { // 全天日程小于3
            return `${26 * max + 2 *(max - 1)}px`;
        }
    }

    // 计算日程的位置
    const handleSchedulePlace = (scheduleId: number | string) => {
        // 记录同一时间出现最多的日程数量
        let maxNUm: number[] = [];
        // 记录同一时间内这个是第几个日程
        const dayNumMp = new Map();
        weeDateArr.forEach(itemDate => {
            const dayStart = itemDate.startOf('day').unix();
            const dayEnd = itemDate.endOf('day').unix();
            let i = 0;

            alldaySchedules.forEach(item => {
                if (
                    (item.start >= dayStart && item.start <= dayEnd) ||
                    (item.end >= dayStart && item.end <= dayEnd) ||
                    (item.start <= dayStart && item.end >= dayEnd)
                ) {
                        // 用id记录是第几个
                        i++;
                        // 用于储存本周每天的全天日程的数量
                        maxNUm.push(i);
                        if (!dayNumMp.get(item.id) || dayNumMp.get(item.id) <= i) {
                            dayNumMp.set(item.id, i);
                        }
                        else {
                            i--;
                        }
                }
            })
        });

        return {
            sameTimeMaxScheduleNum: Math.max(...maxNUm),
            sameTimeScheduleIndex: dayNumMp.get(scheduleId)
        }
    }

    // 
    const renderAllSchedule = (sameTimeScheduleIndex: number, scheduleStyle: any, item: any) => {
        if (isShowMoreSchedules) {
            return (
                <div 
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
            
        }
        
        return (<>
            {
                (sameTimeScheduleIndex <= 3 && !isShowMoreSchedules)
                ? (
                    <div 
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
                : null
            }
        </>)
    }

    const handleClickMore = (e: React.MouseEvent) => {
        e.preventDefault();
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
                            const clsContain = c('rm-calendar-week-date-container', {
                                'is-today': item.startOf('day').unix() === dayjs().startOf('day').unix()
                            })
                            const clsNum = c('rm-calendar-week-date-num', {
                                'is-today-num': item.startOf('day').unix() === dayjs().startOf('day').unix()
                            })
                            const clsName = c('rm-calendar-week-date-name', {
                                'is-today-name': item.startOf('day').unix() === dayjs().startOf('day').unix()
                            })
                            return (
                                <span className={clsContain} key={index}>
                                    <span className={clsNum}>
                                        {item.date()}
                                    </span>
                                    <span className={clsName}>
                                        {isEnglish ? IDay[item.day()] : IDayCN[item.day()]}
                                    </span>
                                    {
                                        renderHeaderTemplate && renderHeaderTemplate(item)
                                    }
                                </span>
                            )
                        })
                    }
                </div>
            </div>
            {weekAlldaySchedules.length !== 0 && <div className="rm-calendar-daygrid-layout" style={{height: getWeekAlldayHeight()}}>
                <div className="rm-calendar-allday-left">
                    <span className="rm-calendar-allday-left-text">{alldayName}</span>
                </div>
                <div className="rm-calendar-allday-right" ref={alldayRef}>
                    {/* 全天日程的grid */}
                    <div className="rm-calendar-week-allday-schedules-grid">
                        {
                            weeDateArr.map((itemDate, index) => {
                                const dayStart = itemDate.startOf('day').unix();
                                const dayEnd = itemDate.endOf('day').add(1, 'second').unix();
                                const cls = c('rm-calendar-week-allday-schedules-grid-item', {
                                    'is-today': itemDate.startOf('day').unix() === dayjs().startOf('day').unix()
                                });
                                let ind = 0;
                                
                                return (
                                    <span 
                                        key={index}
                                        onClick={(e) => handleBlank(e, itemDate.unix(), 'click')}
                                        onDoubleClick={(e) => handleBlank(e, itemDate.unix(), 'dbclick')}
                                        className={cls}
                                    >
                                        {
                                           weekAlldaySchedules.map((item, index) => {
                                                if (
                                                    (item.start >= dayStart && item.start < dayEnd) ||
                                                    (item.end >= dayStart && item.end < dayEnd) ||
                                                    (item.start <= dayStart && item.end >= dayEnd)
                                                ) {
                                                        // 记录是第几个
                                                        ind++;
                                                }
                                                const top = !isShowMoreSchedules ? 3 * 26 : ind * 26;

                                                return (
                                                    ind > 3 && 
                                                    <div
                                                        date-type="more" 
                                                        key={index} 
                                                        style={{top: `${top + 2}px`}} 
                                                        className="rm-calendar-week-allday-schedules-num"
                                                        onClick={handleClickMore}
                                                    >
                                                        <span date-type="more" className="rm-calendar-allday-week-schedules-num-text">{isShowMoreSchedules ? '收起' : `还有${ind - 3}项`}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </span>
                                )
                            })
                        }
                    </div>
                    {/* 全天的日程 */}
                    {
                        alldaySchedules.map((item, index) => {
                            // 不在本周范围内
                            if (item.end <= weekdayStart || item.start >= weekdayEnd) {
                                return;
                            }
                            // 按照小时把七天分成 7 * 24 份
                            // 开始时间的占的份数
                            const startNumCopies = dayjs.unix(item.start).diff(dayjs.unix(weekdayStart), 'hour');
                            // 结束时间的占的份数
                            const endNumCopies = dayjs.unix(item.end).diff(dayjs.unix(weekdayStart), 'hour');
                            //
                            const {sameTimeMaxScheduleNum, sameTimeScheduleIndex} = handleSchedulePlace(item.id);
                            
                            let scheduleStyle = {
                                borderLeft: `2px solid ${item.borderColor}`,
                                color: item.color,
                                height: '26px',
                                lineHeight: '26px',
                                width: `calc(${(endNumCopies - startNumCopies) / totalCopies} * 100%)`,
                                left: `${(startNumCopies / totalCopies) * alldayWidth}px`,
                                top: `${(sameTimeScheduleIndex - 1) * 26 + (sameTimeScheduleIndex - 1)}px`,
                                backgroundColor: item.bgColor,
                                ...item.customStyle,
                            }
                            
                            sameNumRef.current = sameTimeMaxScheduleNum;
                            
                            return (<Fragment key={item.id}>
                                {
                                    renderAllSchedule(sameTimeScheduleIndex, scheduleStyle, item)
                                }
                                
                            </Fragment>)
                        })
                    }
                </div>
            </div>}
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