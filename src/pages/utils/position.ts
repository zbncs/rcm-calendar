import {ISedules} from '../types';

export const positionSchedules = (schedules: ISedules[], start: number, end: number) => {
    let num: number = 0;
    schedules.forEach((item) => {
        if (!(item.end < start || item.start > end)) {
            num++;
        }
    })
    return num;
}
