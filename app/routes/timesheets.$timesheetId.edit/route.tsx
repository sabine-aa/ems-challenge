import { useLoaderData, redirect } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader({
  params,
}: {
  params: { timesheetId: string };
}) {
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

export async function action({
  request,
  params,
}: {
  request: Request;
  params: { timesheetId: string };
}) {
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
  const { timesheet } = useLoaderData() as {
    timesheet: {
      id: number;
      full_name: string;
      start_time: string;
      end_time: string;
    };
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Edit Timesheet #{timesheet.id}
        </h1>
        <form method="post" className="space-y-4">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Start Time:
            </label>
            <input
              type="datetime-local"
              name="start_time"
              defaultValue={timesheet.start_time}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              End Time:
            </label>
            <input
              type="datetime-local"
              name="end_time"
              defaultValue={timesheet.end_time}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Timesheet
          </button>
        </form>
        <hr className="my-6" />
        <ul className="space-y-2 text-center">
          <li>
            <a
              href={`/timesheets/${timesheet.id}`}
              className="text-blue-600 hover:underline"
            >
              &larr; Back to Timesheet
            </a>
          </li>
          <li>
            <a
              href="/timesheets"
              className="text-green-600 hover:underline"
            >
              Timesheets
            </a>
          </li>
          <li>
            <a
              href="/employees"
              className="text-gray-600 hover:underline"
            >
              Employees
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
