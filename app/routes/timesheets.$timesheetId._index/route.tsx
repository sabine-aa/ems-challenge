import { getDB } from "~/db/getDB";
import { useLoaderData } from "react-router";

export async function loader({ params }: { params: { timesheetId: string } }) {
  const db = await getDB();
  const timesheet = await db.get(
    "SELECT timesheets.*, employees.full_name FROM timesheets JOIN employees ON timesheets.employee_id = employees.id WHERE timesheets.id = ?",
    [params.timesheetId]
  );

  if (!timesheet) {
    throw new Response("Timesheet not found", { status: 404 });
  }

  return { timesheet };
}

export default function TimesheetPage() {
  const { timesheet } = useLoaderData();

  return (
    <div>
      <h1>Timesheet #{timesheet.id}</h1>
      <p>Employee: {timesheet.full_name}</p>
      <p>Start Time: {timesheet.start_time}</p>
      <p>End Time: {timesheet.end_time}</p>
      <hr />
      <ul>
        <li><a href="/timesheets">Back to Timesheets</a></li>
        <li><a href="/timesheets/new">New Timesheet</a></li>
        <li><a href="/employees">Employees</a></li>
        <li><a href={`/timesheets/${timesheet.id}/edit`}>Update</a></li>
      </ul>
    </div>
  );
}
