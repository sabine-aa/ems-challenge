// app/routes/timesheets.new.tsx
import { useLoaderData, Form, redirect } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT id, full_name FROM employees");
  return { employees };
}

import type { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id") as string;
  const start_time = formData.get("start_time") as string;
  const end_time = formData.get("end_time") as string;
  const summary = formData.get("summary") as string; 
  
  if (!employee_id || !start_time || !end_time || !summary) {
    return { error: "All fields are required." };
  }

  if (new Date(start_time).getTime() >= new Date(end_time).getTime()) {
    return { error: "Start time must be before end time." };
  }

  const db = await getDB();
  await db.run(
    "INSERT INTO timesheets (employee_id, start_time, end_time, summary) VALUES (?, ?, ?, ?)",
    [employee_id, start_time, end_time, summary]
  );

  return redirect("/timesheets");
};

export default function NewTimesheetPage() {
  const { employees } = useLoaderData() as {
    employees: { id: number; full_name: string }[];
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create New Timesheet
        </h1>
        <Form method="post" className="space-y-4">
          <div>
            <label
              htmlFor="employee_id"
              className="block text-gray-600 font-semibold mb-1"
            >
              Employee:
            </label>
            <select
              name="employee_id"
              id="employee_id"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="start_time"
              className="block text-gray-600 font-semibold mb-1"
            >
              Start Time:
            </label>
            <input
              type="datetime-local"
              name="start_time"
              id="start_time"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="end_time"
              className="block text-gray-600 font-semibold mb-1"
            >
              End Time:
            </label>
            <input
              type="datetime-local"
              name="end_time"
              id="end_time"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="summary"
              className="block text-gray-600 font-semibold mb-1"
            >
              Summary of Work:
            </label>
            <textarea
              name="summary"
              id="summary"
              required
              rows={4}
              placeholder="Brief description of work done"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Timesheet
          </button>
        </Form>

        <hr className="my-6" />

        <ul className="space-y-2 text-center">
          <li>
            <a href="/timesheets" className="text-blue-600 hover:underline">
              Timesheets
            </a>
          </li>
          <li>
            <a href="/employees" className="text-gray-600 hover:underline">
              Employees
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
