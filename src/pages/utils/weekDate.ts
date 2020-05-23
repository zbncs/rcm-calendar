import { Dayjs } from "dayjs";

export const getWeekDate = (date: Dayjs) => {
    let weekDateArr: any[] = [];
    const weekStart = date.startOf("week");
    let tempTime = weekStart;
    for (let i = 0; i < 7; i++) {
        tempTime = weekStart.add(i, 'day')
        weekDateArr.push(tempTime);
    }
    return weekDateArr;
}

// month
type Count = 5 | 6;
export const getMonthDate = (date: Dayjs, visibleWeeksCount: Count = 6) => {
    let monthDateArr: any[] = [];
    let monthDateItemArr: Dayjs[] = [];
    // 月份的第一周的第一天
    const weekStartOfMonthStart = date
                                    .startOf('month')
                                    .startOf('week');
    
    for (let i = 0; i < visibleWeeksCount; i++) {
        monthDateItemArr = getWeekDate(weekStartOfMonthStart.add(i, 'week'))
        monthDateArr.push(monthDateItemArr);
    }
    return monthDateArr;
}
