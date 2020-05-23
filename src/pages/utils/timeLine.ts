enum timeParam {
    is24Hour = '24',
    is12Hour = '12'
}

export function getTimeZone(type: string) {
    const timeArr = [];

    for (let i = 0; i < 24; i++) {
        if (type === timeParam.is24Hour) {
            if (i < 10) {
                timeArr.push(`0${i}:00`);
            }
            else {
                timeArr.push(`${i}:00`);
            }
        }
        else {
            if (i <= 12) {
                timeArr.push(`${i}am`);
            }
            else {
                timeArr.push(`${i - 12}pm`);
            }
        }

    }
    return timeArr;
}

