# rcm-calendar

A react calendar view with day, week and month

## 📦 Install

```bash
npm install rcm-calendar
```

```bash
yarn add rcm-calendar
```

## 🔨 Usage

```jsx
import Calendar from 'rcm-calendar';

const App = () => (
  <>
    <Calendar 
      date={date}
      viewType={'week'}
      isWhichHour={"24"}
      isVisibleSolar2lunar={true}
      schedules={[]}
    />
  </>
);
```
也可以单独引入日、周、月视图： DayCalendar、WeekCalendar、MonthCalendar,
```jsx
import {WeekCalendar} from 'rcm-calendar';

const App = () => (
  <>
    <WeekCalendar 
      date={date}
      viewType={'week'}
      isWhichHour={"24"}
      isVisibleSolar2lunar={true}
      schedules={[]}
    />
  </>
);
```

## API

日历视图的属性说明如下：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| view | 视图类型,有day/week/month | string | - |
| isWhichHour | 时间 日视图或周视图的时刻轴的时间类型：24/12 | string | '24' |
| schedules | 日程的数据 | ISchedules[] | - |
| clickSchedule | 单个日程的点击事件 | (e, schedule) => void | - |
| rightMouseClick | 右键日程 | (e, schedule) => void | - |
| clickBlank | 点击空白处 | (e, time) => void | - |
| dbclickBlank | 双击空白处 (单双击只能有一个) | (e, time) => void | - |
| monthVisibleWeeksCount | 月视图每天显示的日程数 | number | 2 |
| isVisibleSolar2lunar | 是否显示农历 | boolean | false |
| renderHeaderTemplate | 视图头部的自定义 | ReactNode | - |
| alldayName | 全天的名称 | string | 全天 |

ISchedules：日程字段说明

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| id | id,可以不用传入 | string |
| calendarId | calendarId,可以不用传入 | string |
| recurrenceId | recurrenceId,可以不用传入 | string |
| title | 日程标题 | string |
| start | 日程开始时间 | number 时间戳（秒） |
| end | 日程结束时间 | number 时间戳（秒） |
| isAllDay | 是否是全天日程 | boolean |
| location | 日程的地点 | string |
| attendees | 日程参与人 | Array |
| color | 日程的title颜色 | string |
| bgColor | 日程的背景颜色 | string |
| borderColor | 日程左边框的颜色 | string |
| customStyle | 自定义css | {} |
| state | 记录日程的状态 | string |
| raw | 用户自定所需要的字段 | {} |
