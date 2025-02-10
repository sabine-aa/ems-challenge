// app/routes/timesheets._index.tsx
import { useLoaderData } from "react-router";
import { useState } from "react";
import { getDB } from "~/db/getDB";
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
 
import '@schedule-x/theme-default/dist/index.css'
export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );

  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData();
  const [isTableView, setIsTableView] = useState(true);

  return (
    <div>
      <div>
        <button onClick={() => setIsTableView(true)}>Table View</button>
        <button onClick={() => setIsTableView(false)}>Calendar View</button>
      </div>
      {isTableView ? (
        <div>
          {timesheetsAndEmployees.map((timesheet: any) => (
            <div key={timesheet.id}>
              <ul>
                <li>Timesheet #{timesheet.id}</li>
                <ul>
                  <li>Employee: {timesheet.full_name} (ID: {timesheet.employee_id})</li>
                  <li>Start Time: {timesheet.start_time}</li>
                  <li>End Time: {timesheet.end_time}</li>
                  <li><a href={`/timesheets/${timesheet.id}`}>View</a></li>
                  
                </ul>
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>
            To implement, see <a href="https://schedule-x.dev/docs/frameworks/react">Schedule X React documentation</a>.
          </p>
        </div>
      )}
      <hr />
      <ul>
        <li><a href="/timesheets/new">New Timesheet</a></li>
        <li><a href="/employees">Employees</a></li>
      </ul>
    </div>
  );
}
