import { useLoaderData, redirect } from "react-router";
import { getDB } from "~/db/getDB";

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

export async function action({ request, params }: { request: Request; params: { timesheetId: string } }) {
  const formData = await request.formData();
  const start_time = formData.get("start_time") as string;
  const end_time = formData.get("end_time") as string;
  const db = await getDB();

  await db.run(
    "UPDATE timesheets SET start_time = ?, end_time = ? WHERE id = ?",
    [start_time, end_time, params.timesheetId]
  );

  return redirect(`/timesheets/${params.timesheetId}`);
}

export default function EditTimesheetPage() {
  const { timesheet } = useLoaderData() as { timesheet: { id: number; full_name: string; start_time: string; end_time: string } };

  return (
    <div>
      <h1>Edit Timesheet #{timesheet.id}</h1>
      <form method="post">
        <label>
          Start Time:
          <input type="datetime-local" name="start_time" defaultValue={timesheet.start_time} required />
        </label>
        <br />
        <label>
          End Time:
          <input type="datetime-local" name="end_time" defaultValue={timesheet.end_time} required />
        </label>
        <br />
        <button type="submit">Update Timesheet</button>
      </form>
      <hr />
      <ul>
        <li><a href={`/timesheets/${timesheet.id}`}>Back to Timesheet</a></li>
        <li><a href="/timesheets">Timesheets</a></li>
        <li><a href="/employees">Employees</a></li>
      </ul>
    </div>
  );
}
