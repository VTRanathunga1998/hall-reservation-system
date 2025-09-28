"use client";

import {
  Calendar,
  momentLocalizer,
  View,
  Views,
  NavigateAction,
} from "react-big-calendar";
import moment from "moment";
import { hallEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [date, setDate] = useState<Date>(new Date());

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const handleNavigate = (
    newDate: Date,
    newView: View,
    action: NavigateAction
  ) => {
    setDate(newDate); // update controlled date
    if (newView !== view) {
      setView(newView);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-2xl">
        <Calendar
          localizer={localizer}
          events={hallEvents}
          startAccessor="start"
          endAccessor="end"
          views={{ work_week: true, day: true }}
          view={view}
          date={date}
          defaultView={Views.WORK_WEEK}
          min={new Date(1970, 1, 1, 8, 0, 0)}
          max={new Date(1970, 1, 1, 20, 0, 0)}
          step={30}
          timeslots={2}
          onView={handleOnChangeView}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
};

export default BigCalendar;
