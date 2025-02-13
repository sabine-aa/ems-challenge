import { getDB } from "~/db/getDB";
import { useLoaderData, useNavigate } from "react-router";

export async function loader({ params }: { params: { timesheetId: string } }) {
  const db = await getDB();
  const timesheet = await db.get(
    `SELECT timesheets.*, employees.full_name 
     FROM timesheets 
     JOIN employees ON timesheets.employee_id = employees.id 
     WHERE timesheets.id = ?`,
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

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this timesheet?")) return;

    const response = await fetch(`/timesheets/${timesheet.id}/delete`, {
      method: "POST",
    });

    if (response.ok) {
      navigate("/timesheets");
    } else {
      alert("Failed to delete timesheet.");
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Timesheet #{timesheet.id}
        </h1>
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-semibold">Employee:</span> {timesheet.full_name}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Start Time:</span> {timesheet.start_time}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">End Time:</span> {timesheet.end_time}
          </p>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Summary</h2>
          <div className="bg-gray-100 p-4 rounded-lg text-gray-700">
            {timesheet.summary ? (
              <p>{timesheet.summary}</p>
            ) : (
              <p className="text-gray-500">No summary provided.</p>
            )}
          </div>
        </div>

        <hr className="my-4" />

        <ul className="space-y-2">
          <li>
            <a
              href="/timesheets"
              className="block text-blue-600 hover:underline"
            >
              &larr; Back to Timesheets
            </a>
          </li>
          <li>
            <a
              href="/timesheets/new"
              className="block text-green-600 hover:underline"
            >
              New Timesheet
            </a>
          </li>
          <li>
            <a
              href="/employees"
              className="block text-gray-600 hover:underline"
            >
              Employees
            </a>
          </li>
          <li>
            <a
              href={`/timesheets/${timesheet.id}/edit`}
              className="block text-yellow-600 hover:underline"
            >
              Update
            </a>
          </li>
          <li>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
