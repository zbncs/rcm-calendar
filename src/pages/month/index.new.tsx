/**
 * 月视图
 * 重新设计中
 * 
 * 
 * 
 */

import React, { useEffect, useRef, useState } from 'react';
import { IMonthProps, IDay, ISedules, IDayCN } from '../types';
import { getMonthDate } from '../utils/weekDate';
import dayjs, { Dayjs } from 'dayjs';
import c from 'classnames';
// @ts-ignore
import solarlunar from 'solarlunar';
import { monthSchedulePlace } from '../utils/position'
// css
import './index.scss';

Month.defaultProps = {
    name: 'month',
    monthVisibleWeeksCount: 2,
    isVisibleSolar2lunar: false
}

const totalCopies = 7;
export default function Month(props: IMonthProps) {
    const {
        date,
        schedules,
        monthVisibleWeeksCount,
        isVisibleSolar2lunar,
        isEnglish,
        renderHeaderTemplate,
        clickSchedule,
        rightMouseClick,
        clickBlank,
        dbclickBlank,
        monthClickMore,
    } = props;
    const monthDate = getMonthDate(date);
    const monthSchedules = schedules ? schedules : [];
    // 总宽度
    const totalMonthRef = useRef(null);
    const [totalHeight, setTotalHeight] = useState(0);
    // 月视图头部日期高度
    const monthHeaderRef = useRef(null);
    const [monthHeaderHeight, setMonthHeaderHeight] = useState(0);
    const [totalWidth, setTotalWidth] = useState(0);

    useEffect(() => {
        if (totalMonthRef.current) {
            setTotalHeight(totalMonthRef.current.clientHeight);
            setTotalWidth(totalMonthRef.current.clientWidth);
        }
    }, [totalMonthRef.current])

    useEffect(() => {
        if (monthHeaderRef.current) {
            setMonthHeaderHeight(monthHeaderRef.current.clientHeight);
        }
    }, [monthHeaderRef.current])

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
    const renderSchedules = (schedules: ISedules[], weekItem: Dayjs[], weekIndex: number) => {
        // 记录某一天的日程数量
        let visibleWeeksCount: number = 0;
        let daySchedules: ISedules[] = [];
        const weekdayStart = weekItem[0];
        // 每日的日期头部高度
        const weekHeaderHeight = 26;
        const topStyle = Math.floor((weekIndex * totalHeight / 6) + monthHeaderHeight + weekHeaderHeight + 8);
        const heightStyle = Math.floor((totalHeight - monthHeaderHeight) / 6 - weekHeaderHeight - 4 - 6)

        const containerStyle = {
            top: topStyle,
            height: heightStyle
        }

        return (
            <div
                className="rm-calendar-month-week-item-schedules-container"
                style={containerStyle}
            // onClick={(e) => handleBlank(e, dayTime.unix(), 'click')}
            // onDoubleClick={(e) => handleBlank(e, dayTime.unix(), 'dbclick')}
            >
                {
                    schedules && schedules.map((scheduleItem, scheduleIndex) => {
                        // 日程的开始和结束时间
                        const itemStartTime = scheduleItem.start;
                        const itemEndTime = scheduleItem.end;
                        // 这一天的开始和结束时间
                        // const start = dayTime?.startOf('day').unix();
                        // const end = dayTime?.endOf('day').unix();

                        // 把七天分成 7 份
                        // 开始时间占的份数
                        let startNumCopies = dayjs.unix(itemStartTime).startOf('day').diff(weekdayStart, 'day');
                        // 结束时间的占的份数
                        const endNumCopies = Math.ceil(dayjs.unix(itemEndTime).diff(weekdayStart, 'day', true));

                        //如果日程的结束时间大于了这周的结束时间
                        if (itemStartTime < weekdayStart.unix()) {
                            startNumCopies = 0;
                        }

                        const { sameTimeMaxScheduleNum, sameTimeScheduleIndex } = monthSchedulePlace(scheduleItem.id, weekItem, schedules);
                        visibleWeeksCount = sameTimeMaxScheduleNum;

                        const scheduleStyle = {
                            borderLeft: `2px solid ${scheduleItem.borderColor}`,
                            color: scheduleItem.color,
                            backgroundColor: scheduleItem.bgColor,
                            width: `calc(${(endNumCopies - startNumCopies) / totalCopies} * 100%)`,
                            left: `calc(${(startNumCopies / totalCopies)} * 100%)`,
                            top: `${(sameTimeScheduleIndex - 1) * 18 + (sameTimeScheduleIndex - 1)}px`,
                            ...scheduleItem.customStyle,
                        }

                        // if (sameTimeScheduleIndex > monthVisibleWeeksCount) {
                        //     const style = {
                        //         left: `calc(${(startNumCopies / totalCopies)} * 100% + ${totalWidth / 7 / 2 - 6 - 2 * 7}px)`,
                        //         top: `${(sameTimeScheduleIndex - 1) * 18 + (sameTimeScheduleIndex - 1)}px`
                        //     }

                        //     return (
                        //         <span
                        //             style={style}
                        //             date-type="more"
                        //             className="rm-calendar-month-week-item-schedules-num"
                        //             onClick={(e) => handleClickMore(e, daySchedules)}
                        //         >
                        //             {`还有${visibleWeeksCount - monthVisibleWeeksCount}项`}
                        //         </span>
                        //     )
                        // }

                        if (sameTimeScheduleIndex > monthVisibleWeeksCount) {
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


                        // if (
                        //     ((itemEndTime >= start && itemEndTime <= end) ||
                        //         (itemStartTime >= start && itemStartTime <= end) ||
                        //         (itemStartTime <= start && itemEndTime >= end))
                        //     // (itemStartTime >= start && itemStartTime <= end)
                        // ) {
                        //     visibleWeeksCount++;
                        //     daySchedules.push(scheduleItem);
                        //     if (visibleWeeksCount > monthVisibleWeeksCount) {
                        //         return;
                        //     }
                        //     return (
                        //         <div className="rm-calendar-month-week-schedules-item"
                        //             date-type="schedule"
                        //             style={scheduleStyle}
                        //             key={scheduleIndex}
                        //             onClick={(e) => handlClickSchedule(e, scheduleItem)}
                        //             onContextMenu={(e) => handleRightClickSchedule(e, scheduleItem)}
                        //         >
                        //             <span date-type="schedule" className="rm-calendar-month-week-schedules-title">{scheduleItem.title}</span>
                        //         </div>
                        //     )
                        // }
                    })
                }
                {
                    weekItem.map((weeksCountItem, weeksCountInd) => {
                        const dayStart = weeksCountItem.startOf('day').unix();
                        const dayEnd = weeksCountItem.endOf('day').add(1, 'second').unix();
                        let ind = 0;

                        schedules.map((scheduleItem, index) => {
                            if (
                                (scheduleItem.start >= dayStart && scheduleItem.start < dayEnd) ||
                                (scheduleItem.end >= dayStart && scheduleItem.end < dayEnd) ||
                                (scheduleItem.start <= dayStart && scheduleItem.end >= dayEnd)
                            ) {
                                // 记录是第几个
                                ind++;
                                daySchedules.push(scheduleItem);
                            }

                            const style = {
                                left: `calc(${(weeksCountInd + 1) / 7} * 100% + ${totalWidth / 7 / 2 - 6 - 2 * 7}px)`,
                                top: `${(ind - 1) * 18 + (ind - 1)}px`,
                                background: 'red'
                            }

                            console.log(99999, ind + 1 > monthVisibleWeeksCount)

                            return (
                                <>
                                    {
                                        // ind + 1 > monthVisibleWeeksCount ?
                                        <span
                                            style={style}
                                            date-type="more"
                                            className="rm-calendar-month-week-item-schedules-num"
                                            onClick={(e) => handleClickMore(e, daySchedules)}
                                        >
                                            {`还有${ind - monthVisibleWeeksCount}项`}
                                        </span>
                                        // : null
                                    }
                                </>
                            )

                        })

                    })
                }
            </div>
        )
    }
    return (
        <div className="rm-calendar-month" ref={totalMonthRef}>
            <div className="rm-calendar-month-date-week" ref={monthHeaderRef}>
                {
                    monthDate[0].map((item: Dayjs, index: number) => {
                        return (
                            <div className="rm-calendar-month-dayname-item" key={index}>
                                {isEnglish ? IDay[item.day()] : IDayCN[item.day()]}
                            </div>
                        )
                    })
                }
            </div>
            {
                monthDate.map((weekItem, weekIndex) => {
                    return (<React.Fragment key={weekIndex}>
                        <div className="rm-calendar-month-week">
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
                                                {isVisibleSolar2lunar && !isEnglish &&
                                                    <span className="rm-calendar-month-week-item-header-dayCn">
                                                        {solar2lunarData.term ? solar2lunarData.term : solar2lunarData.dayCn}
                                                    </span>
                                                }
                                                {/* 月视图自定义头部 */}
                                                <span className="rm-calendar-month-week-item-header-holiday">
                                                    {
                                                        renderHeaderTemplate && renderHeaderTemplate(dayItem)
                                                    }
                                                </span>
                                            </div>
                                            <div className="rm-calendar-month-week-item-schedules">
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {
                            renderSchedules(monthSchedules, weekItem, weekIndex)
                        }
                    </React.Fragment>)
                })
            }
        </div>
    )
}