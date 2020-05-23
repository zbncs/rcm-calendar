import {ISedules} from '../types';

export const positionSchedules = (schedules: ISedules[], start: number, end: number) => {
    let num: number = 0;
    schedules.forEach((item) => {
        if ((item.start >= start && item.start <= end) || (item.end >= start && item.end <= end)) {
            num++;
            item.sort = num;
        }
    })
    return num;
}

