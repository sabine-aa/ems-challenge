import { useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import { getDB } from "~/db/getDB";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";

interface Timesheet {
  id: number;
  full_name: string;
  employee_id: number;
  start_time: string;
  end_time: string;
}

export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees: Timesheet[] = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );

  return { timesheetsAndEmployees };
}

function formatScheduleXTime(dateTime: string): string {
  const date = new Date(dateTime);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData() as { timesheetsAndEmployees: Timesheet[] };
  const [isTableView, setIsTableView] = useState(true);
  const [eventsService] = useState(() => createEventsServicePlugin());

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: timesheetsAndEmployees.map((timesheet: Timesheet) => ({
      id: timesheet.id.toString(),
      title: `Employee: ${timesheet.full_name}`,
      start: formatScheduleXTime(timesheet.start_time),
      end: formatScheduleXTime(timesheet.end_time),
    })),
    plugins: [eventsService],
  });

  useEffect(() => {
    eventsService.getAll();
  }, [eventsService]);

  return (
    <div>
      <div>
        <button onClick={() => setIsTableView(true)}>Table View</button>
        <button onClick={() => setIsTableView(false)}>Calendar View</button>
      </div>
      {isTableView ? (
        <div>
          {timesheetsAndEmployees.map((timesheet: Timesheet) => (
            <div key={timesheet.id}>
              <ul>
                <li>Timesheet #{timesheet.id}</li>
                <ul>
                  <li>Employee: {timesheet.full_name} (ID: {timesheet.employee_id})</li>
                  <li>Start Time: {timesheet.start_time}</li>
                  <li>End Time: {timesheet.end_time}</li>
                  <li>
                    <a href={`/timesheets/${timesheet.id}`}>View</a>
                  </li>
                </ul>
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ height: "800px" }}>
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      )}
      <hr />
      <ul>
        <li>
          <a href="/timesheets/new">New Timesheet</a>
        </li>
        <li>
          <a href="/employees">Employees</a>
        </li>
      </ul>
    </div>
  );
}
