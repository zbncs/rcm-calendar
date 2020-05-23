import { Dayjs } from "dayjs";

export interface ISedules {
    id?: string;
    calendarId?: string;
    recurrenceId?: string;
    title: string;
    start: number;
    end: number;
    isAllDay: boolean;
    location: string;
    attendees?: any[];
    color: string;
    bgColor: string;
    borderColor: string;
    customStyle: any;
    state: string;
    raw: any;
    sort?: number;

}

export type IviewType = 'day' | 'week' | 'month' | 'list';

export interface ICalendarProps {
    /**
     * 视图类型
     */
    viewType: IviewType;
    /**
     * 日程数据
     */
    schedules: Array<ISedules>;
    /**
     * 日视图和周视图的时间小时制
     */
    isWhichHour: '12' | '24';
    /**
     * 
     */
    date: Dayjs;
    /**
     * 月视图每天显示的日程数
     */
    monthVisibleWeeksCount?: number;
    /**
     * 是否显示农历
     */
    isVisibleSolar2lunar?: boolean;
    /**
     * 日视图或者周视图的全天名称
     */
    alldayName?: string;
    /**
     * 月视图头部的自定义
     */
    renderHeaderTemplate?: (time: Dayjs) => React.ReactNode;
    /**
     * 点击日程事件
     */
    clickSchedule?: (event: React.MouseEvent, schedule: ISedules) => void;
    /**
     * 点击空白处
     */
    clickBlank?: (event: React.MouseEvent, timeStart: number) => void;
    /**
     * 双击空白处
     */
    dbclickBlank?: (event: React.MouseEvent, timeStart: number) => void;
    /**
     * 右键日程
     */
    rightMouseClick?: (event: React.MouseEvent, schedule: ISedules) => void;
    /**
     * 月视图点击还有几项按钮事件
     */
    monthClickMore?: (event: React.MouseEvent, schedule: ISedules[]) => void;
}

interface ISameProps {
    readonly name: string;
    isWhichHour: '12' | '24';
    schedules: Array<ISedules>;
    date: Dayjs;
    clickSchedule?: (event: React.MouseEvent, schedule: ISedules) => void;
    clickBlank?: (event: React.MouseEvent, timeStart: number) => void;
    dbclickBlank?: (event: React.MouseEvent, timeStart: number) => void;
    rightMouseClick?: (event: React.MouseEvent, schedule: ISedules) => void;
}

export interface IDayProps extends ISameProps {
    alldayName: string;
    renderHeaderTemplate?: (time: Dayjs) => React.ReactNode;
}

export interface IWeekProps extends IDayProps {}

export interface IMonthProps {
    name: string;
    date: Dayjs;
    schedules?: Array<ISedules>;
    monthVisibleWeeksCount: number;
    isVisibleSolar2lunar?: boolean;
    renderHeaderTemplate?: (time: Dayjs) => React.ReactNode;
    clickSchedule?: (event: React.MouseEvent, schedule: ISedules) => void;
    rightMouseClick?: (event: React.MouseEvent, schedule: ISedules) => void;
    clickBlank?: (event: React.MouseEvent, timeStart: number) => void;
    dbclickBlank?: (event: React.MouseEvent, timeStart: number) => void;
    monthClickMore?: (event: React.MouseEvent, schedule: ISedules[]) => void;
}

export interface ITimeGridProps {
    isWhichHour: '12' | '24';
}

export interface ITimeGridLineProps extends ISameProps {
    // readonly name: string;
    // schedules: Array<ISedules>;
    // date: Dayjs;
    // clickSchedule?: (event: React.MouseEvent, schedule: ISedules) => void;
    // clickBlank?: (event: React.MouseEvent, timeStart: number) => void;
    // dbclickBlank?: (event: React.MouseEvent, timeStart: number) => void;
    // rightMouseClick?: (event: React.MouseEvent, schedule: ISedules) => void;
}

export interface ICommonProps extends ISameProps {
    // isWhichHour: '12' | '24';
    // schedules: Array<ISedules>;
    // date: Dayjs;
    // clickSchedule?: (event: React.MouseEvent, schedule: ISedules) => void;
    // clickBlank?: (event: React.MouseEvent, timeStart: number) => void;
    // dbclickBlank?: (event: React.MouseEvent, timeStart: number) => void;
    // rightMouseClick?: (event: React.MouseEvent, schedule: ISedules) => void;
}

export interface ISchedulesDataProps {
    schedules: Array<ISedules>;
    date: Dayjs;
    clickSchedule?: (event: React.MouseEvent, schedule: ISedules) => void;
    rightMouseClick?: (event: React.MouseEvent, schedule: ISedules) => void;
}

export enum IDay {
    Sun = 0,
    Mon,
    Tue,
    Wed,
    Thur,
    Fri,
    Sat,
}

//
export interface IAlignLineProps extends ISchedulesDataProps {
    clickBlank?: (event: React.MouseEvent, timeStart: number) => void;
    dbclickBlank?: (event: React.MouseEvent, timeStart: number) => void;
}
