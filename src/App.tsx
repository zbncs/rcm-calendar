import React, { useState } from 'react';
import Calendar from 'rcm-calendar';
import { data } from './mock';
import dayjs, { Dayjs } from 'dayjs';
import { ISedules, IviewType } from './type';

let tempTime = dayjs();
function App() {
	const [date, setDate] = useState(dayjs());
	const [viewType, setViewType] = useState<IviewType>('day');

	const handleClick = (e: React.MouseEvent, schedule: ISedules) => {
		alert(`点击${schedule.title}日程`)
	}
	const handleClickBlank = (e: React.MouseEvent, time: number) => {
		console.log(e.target, '单击空白处', time)
		alert(`点击空白处,开始时间${time}`)
	}
	const handleDbclickBlank = (e: React.MouseEvent, time: number) => {
		console.log(e.target, '双击空白处', time)
		alert(`双击空白处,开始时间${time}`)
	}
	const handleRightMouseClick = (e: React.MouseEvent, schedule: ISedules) => {
		console.log(777, '右键操作', schedule);
		alert(`右键操作${schedule.title}日程,`)
	}

	const handleNext = () => {
		if (viewType === 'day') {
			tempTime = tempTime.add(1, 'day');
		}
		else if (viewType === 'week') {
			tempTime = tempTime.add(1, 'week');
		}

		setDate(tempTime);
	}

	const handlePrev = () => {
		tempTime = tempTime.subtract(1, 'day');
		setDate(tempTime);
	}

	const handleToday = () => {
		setDate(dayjs());
	}

	const handleClickViewType = (type: IviewType) => {
		setViewType(type);
	}

	const renderMonthHeader = (time: Dayjs) => {
		if (time.day() === 0 || time.day() === 6) {
			return <span style={{ color: 'green', marginLeft: 4 }}>休</span>
		}
	}

	const handelMClickMore = (e: React.MouseEvent, schedule: ISedules[]) => {
		console.log(99000, schedule)
	}

	return (
		<div className="App">
			<div className="rm-calendar-operate-container">
				<span className="rm-calendar-warn">该项目还处于开发中，不适合生产环境</span>
				<span className="rm-calendar-today-day" onClick={handleToday}>today</span>
				<span className="rm-calendar-prev-day" onClick={handlePrev}>prev</span>
				<span className="rm-calendar-next-day" onClick={handleNext}>next</span>
				<div className="rm-calendar-btn-container">
					<span className="rm-calendar-day-btn" onClick={() => handleClickViewType('day')}>day</span>
					<span className="rm-calendar-week-btn" onClick={() => handleClickViewType('week')}>week</span>
					<span className="rm-calendar-month-btn" onClick={() => handleClickViewType('month')}>month</span>
				</div>
			</div>

			<Calendar
				date={date}
				viewType={viewType}
				isWhichHour={"24"}
				isVisibleSolar2lunar={true}
				schedules={data}
				alldayName={'All day'}
				clickSchedule={handleClick}
				clickBlank={handleClickBlank}
				dbclickBlank={handleDbclickBlank}
				rightMouseClick={handleRightMouseClick}
				renderHeaderTemplate={renderMonthHeader}
				monthClickMore={handelMClickMore}
			/>
		</div>
	);
}

export default App;