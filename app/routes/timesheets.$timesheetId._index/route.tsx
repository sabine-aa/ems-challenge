import { getDB } from "~/db/getDB";
import { useLoaderData, useNavigate } from "react-router";

// 📌 Fetch a single timesheet
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
  const navigate = useNavigate();

  // 📌 Function to delete the timesheet
  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this timesheet?")) return;

    const response = await fetch(`/timesheets/${timesheet.id}/delete`, {
      method: "POST",
    });

    if (response.ok) {
      navigate("/timesheets"); // ✅ Redirect to timesheets list after deletion
    } else {
      alert("Failed to delete timesheet.");
    }
  }

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
        <li><button onClick={handleDelete} className="text-red-500 hover:underline">Delete</button></li> 
      </ul>
    </div>
  );
}
