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

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData() as {
    timesheetsAndEmployees: Timesheet[];
  };
  const [isTableView, setIsTableView] = useState(true);
  const [eventsService] = useState(() => createEventsServicePlugin());

  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Timesheets
      </h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setIsTableView(true)}
          className={`px-4 py-2 rounded ${
            isTableView
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Table View
        </button>
        <button
          onClick={() => setIsTableView(false)}
          className={`px-4 py-2 rounded ${
            !isTableView
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Calendar View
        </button>
      </div>

      {isTableView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timesheetsAndEmployees.map((timesheet: Timesheet) => (
            <div
              key={timesheet.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Timesheet #{timesheet.id}
              </h2>
              <p className="text-gray-600">
                Employee:{" "}
                <span className="font-bold">{timesheet.full_name}</span> (ID:{" "}
                {timesheet.employee_id})
              </p>
              <p className="text-gray-600">
                Start Time: {timesheet.start_time}
              </p>
              <p className="text-gray-600">End Time: {timesheet.end_time}</p>
              <div className="mt-4">
                <a
                  href={`/timesheets/${timesheet.id}`}
                  className="inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6" style={{ height: "800px" }}>
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      )}

      <hr className="my-6" />

      <ul className="flex justify-center space-x-4">
        <li>
          <a
            href="/timesheets/new"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            New Timesheet
          </a>
        </li>
        <li>
          <a
            href="/employees"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Employees
          </a>
        </li>
      </ul>
    </div>
  );
}
