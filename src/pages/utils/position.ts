import { Dayjs } from 'dayjs';
import { ISedules } from '../types';

export const positionSchedules = (schedules: ISedules[], start: number, end: number) => {
    let num: number = 0;
    schedules.forEach((item) => {
        if (!(item.end < start || item.start > end)) {
            num++;
        }
    })
    return num;
}

export const monthSchedulePlace = (scheduleId: number | string, weeDateArr: Dayjs[], schedules: ISedules[]) => {
    // 记录同一时间出现最多的日程数量
    let maxNUm: number[] = [];
    // 记录同一时间内这个是第几个日程
    const dayNumMp = new Map();
    weeDateArr.forEach(itemDate => {
        const dayStart = itemDate.startOf('day').unix();
        const dayEnd = itemDate.endOf('day').unix();
        let i = 0;

        schedules.forEach(item => {
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
    })
    return {
        sameTimeMaxScheduleNum: Math.max(...maxNUm),
        sameTimeScheduleIndex: dayNumMp.get(scheduleId)
    }
}
