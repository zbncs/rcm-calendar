import React, { useRef } from 'react';
import {IMonthProps, IDay, ISedules} from '../types';
import {getMonthDate} from '../utils/weekDate';
import dayjs, { Dayjs } from 'dayjs';
import c from 'classnames';
// @ts-ignore
import solarlunar from 'solarlunar';
// css
import './index.scss';

Month.defaultProps = {
    name: 'month',
    monthVisibleWeeksCount: 2,
    isVisibleSolar2lunar: false
}
export default function Month(props: IMonthProps) {
    const {
        date,
        schedules,
        monthVisibleWeeksCount,
        isVisibleSolar2lunar,
        monthHeaderTemplate,
        clickSchedule,
        rightMouseClick,
        clickBlank,
        dbclickBlank,
        monthClickMore,
    } = props;
    const monthDate = getMonthDate(date);
    const monthSchedules = schedules ? schedules : [];
    
    // 点击日程
    const handlClickSchedule = (e: React.MouseEvent, scheduleItem: ISedules) => {
        clickSchedule && clickSchedule(e, scheduleItem);
    }
    // 右键日程
    const handleRightClickSchedule = (e: React.MouseEvent, scheduleItem: ISedules) => {
        e.preventDefault();
        rightMouseClick && rightMouseClick(e, scheduleItem);
    }
    // 点击护着双击空白处事件
    const handleBlank = (e: React.MouseEvent, time: number, type: string) => {
        const isSchedule = (e.target as any).hasAttribute('date-type');
        if (type === 'click' && !isSchedule) {
            clickBlank && clickBlank(e, time);
        }
        else if (type === 'dbclick' && !isSchedule) {
            dbclickBlank && dbclickBlank(e, time);
        }
    }
    // 月视图点击还有几项按钮事件
    const handleClickMore = (e: React.MouseEvent, schedules: ISedules[]) => {
        monthClickMore && monthClickMore(e, schedules);
    }
    // 渲染月视图日程
    const renderSchedules = (schedules: ISedules[], dayTime: Dayjs) => {
        // 记录某一天的日程数量
        let visibleWeeksCount: number = 0;
        let daySchedules: ISedules[] = [];
        return <div 
                    className="rm-calendar-month-week-item-schedules-container"
                    onClick={(e) => handleBlank(e, dayTime.unix(), 'click')}
                    onDoubleClick={(e) => handleBlank(e, dayTime.unix(), 'dbclick')}
                >
            {
                schedules && schedules.map((scheduleItem, scheduleIndex) => {
                    // 日程的开始和结束时间
                    const itemStartTime = scheduleItem.start;
                    const itemEndTime = scheduleItem.end;
                    // 这一天的开始和结束时间
                    const start = dayTime?.startOf('day').unix();
                    const end = dayTime?.endOf('day').unix();

                    // todo 跨天日程的问题=================================================
                    // const dayjsStart = dayjs.unix(itemStartTime).startOf('day');
                    // const dayjsEnd = dayjs.unix(itemEndTime - 1).startOf('day');
                    // const hasCrossDay = dayjsEnd.diff(dayjsStart, 'day') > 0 ? dayjsEnd.diff(dayjsStart, 'day') + 1 : 1;

                    const scheduleStyle = {
                        borderLeft: `2px solid ${scheduleItem.borderColor}`,
                        color: scheduleItem.color,
                        backgroundColor: scheduleItem.bgColor,
                        // width: `calc(100% * ${hasCrossDay} + ${5 * hasCrossDay}px)`,
                        ...scheduleItem.customStyle,
                    }
        
                    if (
                        ((itemEndTime >= start && itemEndTime <= end) || 
                        (itemStartTime >= start && itemStartTime <= end) || 
                        (itemStartTime <= start && itemEndTime >= end))
                        // (itemStartTime >= start && itemStartTime <= end)
                    ) {
                        visibleWeeksCount++;
                        daySchedules.push(scheduleItem);
                        if (visibleWeeksCount > monthVisibleWeeksCount) {
                            return;
                        }
                        return (
                            <div className="rm-calendar-month-week-schedules-item"
                                date-type="schedule" 
                                style={scheduleStyle}
                                key={scheduleIndex}
                                onClick={(e) => handlClickSchedule(e, scheduleItem)}
                                onContextMenu={(e) => handleRightClickSchedule(e, scheduleItem)}
                            >
                                <span date-type="schedule" className="rm-calendar-month-week-schedules-title">{scheduleItem.title}</span>
                            </div>
                        )
                    }
                })
            }
            {   visibleWeeksCount - monthVisibleWeeksCount > 0 &&
                <span 
                    date-type="more" 
                    className="rm-calendar-month-week-item-schedules-num"
                    onClick={(e) => handleClickMore(e, daySchedules)}
                >
                    {`还有${visibleWeeksCount - monthVisibleWeeksCount}项`}
                </span>
            }
        </div>
    }
    return (
        <div className="rm-calendar-month">
            <div className="rm-calendar-month-date-week">
                {
                    monthDate[0].map((item: Dayjs, index: number) => {
                        return (
                            <div className="rm-calendar-month-dayname-item" key={index}>
                                {IDay[item.day()]}
                            </div>
                        )
                    })
                }
            </div>
            {
                monthDate.map((weekItem, weekIndex) => {
                    return (
                        <div className="rm-calendar-month-week" key={weekIndex}>
                            {
                                weekItem.map((dayItem: Dayjs, dayIndex: number) => {
                                    const solar2lunarData = solarlunar.solar2lunar(dayItem.year(), dayItem.month() + 1, dayItem.date());
                                    const isToday = dayjs()
                                                        .startOf('day')
                                                        .isSame(dayItem.startOf('day'));
                                    const cls = c('rm-calendar-month-week-item-header-date', {
                                        'rm-calendar-month-week-item-today': isToday
                                    })
                                    return (
                                        <div className="rm-calendar-month-week-item" key={dayIndex}>
                                            <div className="rm-calendar-month-week-item-header">
                                                <span className={cls}>{dayItem.date()}</span>
                                                {/* 农历 */}
                                                { isVisibleSolar2lunar &&
                                                    <span className="rm-calendar-month-week-item-header-dayCn">
                                                        {solar2lunarData.term ? solar2lunarData.term : solar2lunarData.dayCn}
                                                    </span>
                                                }
                                                {/* 月视图自定义头部 */}
                                                <span className="rm-calendar-month-week-item-header-holiday">
                                                    {
                                                        monthHeaderTemplate && monthHeaderTemplate(dayItem)
                                                    }
                                                </span>
                                            </div>
                                            <div className="rm-calendar-month-week-item-schedules">
                                                {
                                                   renderSchedules(monthSchedules, dayItem)
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}