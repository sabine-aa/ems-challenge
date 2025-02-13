import { useLoaderData, Link } from "react-router-dom";
import { getDB } from "~/db/getDB";
const BACKEND_URL = "http://localhost:5000"; // make sure backend is running using node server.js

export async function loader({
  params,
}: {
  params: { employeeId: string };
}) {
  const db = await getDB();
  const employee = await db.get("SELECT * FROM employees WHERE id = ?;", [
    params.employeeId,
  ]);

  if (!employee) {
    throw new Response("Employee Not Found", { status: 404 });
  }

  return { employee };
}

export default function EmployeePage() {
  const { employee } = useLoaderData() as { employee: any };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Employee Details
      </h1>

      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Employee Photo */}
        <div className="flex justify-center mb-4">
          {employee.photo_path ? (
            <img
              src={`${BACKEND_URL}${employee.photo_path}`}
              alt={employee.full_name}
              className="w-32 h-32 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Photo
            </div>
          )}
        </div>

        <div className="space-y-2 text-center">
          <p className="text-xl font-semibold text-gray-700">
            {employee.full_name}
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong> {employee.email}
          </p>
          <p className="text-gray-600">
            <strong>Phone:</strong> {employee.phone_number}
          </p>
          <p className="text-gray-600">
            <strong>Job Title:</strong> {employee.job_title}
          </p>
          <p className="text-gray-600">
            <strong>Department:</strong> {employee.department}
          </p>
          <p className="text-gray-600">
            <strong>Salary:</strong> $
            {employee.salary.toLocaleString()}
          </p>
          <p className="text-gray-600">
            <strong>Start Date:</strong> {employee.start_date}
          </p>
          <p className="text-gray-600">
            <strong>End Date:</strong> {employee.end_date || "N/A"}
          </p>
        </div>

        {/* Download CV */}
        <div className="mt-4 text-center">
          {employee.cv_path ? (
            <a
              href={`${BACKEND_URL}${employee.cv_path}`}
              download
              className="text-blue-500 hover:underline"
            >
              Download CV
            </a>
          ) : (
            <p className="text-gray-500">No CV Available</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <Link
          to="/employees"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          &larr; Back to Employees
        </Link>
        <Link
          to={`/employees/${employee.id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Edit Employee
        </Link>
      </div>
    </div>
  );
}
