import React from 'react';
import {getWeekDate} from '../../utils/weekDate';
import {IAlignLineProps} from '../../types';
import SchedulesData from '../data/index';

// css
import './index.scss';
import { Dayjs } from 'dayjs';

export default function AlignSchedulesLine(props: IAlignLineProps) {
    const {
        date,
        schedules,
        clickSchedule,
        rightMouseClick,
        clickBlank,
        dbclickBlank,
    } = props;
    const weeDateArr = date && getWeekDate(date);
    const handleBlank = (e: React.MouseEvent, timeStart: Dayjs, type: string) => {
        // 根据位置判断是哪个小时
        const scrollToTop = e.currentTarget.getBoundingClientRect().top - 133;
        const positionY = scrollToTop >= 0 ? e.pageY - 133 : e.pageY - 133 - scrollToTop;
        // 小时数
        const hour = Math.floor(positionY / 52);
        // 点击或者双击的是否是日程
        const isSchedule = (e.target as any).hasAttribute('date-type');
        if (type === 'click' && !isSchedule) {
            clickBlank && clickBlank(e, timeStart.hour(hour).unix());
        }
        else if (type === 'dbclick' && !isSchedule) {
            dbclickBlank && dbclickBlank(e, timeStart.hour(hour).unix());
        }
        
    }

    return (
        <div className="rm-calendar-timegrid-schedules-alignlines">
            {
                weeDateArr.map((item, index) => {
                    return (
                        <div className="rm-calendar-timegrid-align-item"
                            key={index}
                            onClick={(e) => handleBlank(e, item, 'click')}
                            onDoubleClick={(e) => handleBlank(e, item, 'dbclick')}
                        >
                            <SchedulesData
                                clickSchedule={clickSchedule}
                                date={item} 
                                schedules={schedules}
                                rightMouseClick={rightMouseClick}
                            />
                        </div>
                    )
                })
            }
        </div>
    )
}