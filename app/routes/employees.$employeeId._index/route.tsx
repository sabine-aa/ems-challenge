import { useLoaderData } from "react-router-dom";
import { getDB } from "~/db/getDB";
import { Link, useParams } from "react-router-dom";

// Fetch single employee from database
export async function loader({ params }: { params: { employeeId: string } }) {
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
      <h1 className="text-2xl font-bold mb-4">Employee Details</h1>

      <div className="border rounded-lg p-4 shadow-md bg-white">
        {/* Employee Photo */}
        {employee.photo_path ? (
          <img
            src={employee.photo_path}
            alt={employee.full_name}
            className="rounded-full object-cover border border-gray-300"
  style={{ width: "100px", height: "100px" }}
          />
        ) : (
          <p className="text-gray-500">No Photo Available</p>
        )}

        {/* Employee Info */}
        <p><strong>Full Name:</strong> {employee.full_name}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Phone:</strong> {employee.phone_number}</p>
        <p><strong>Job Title:</strong> {employee.job_title}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Salary:</strong> ${employee.salary.toLocaleString()}</p>
        <p><strong>Start Date:</strong> {employee.start_date}</p>
        <p><strong>End Date:</strong> {employee.end_date || "N/A"}</p>

        {/* Download CV */}
        {employee.cv_path ? (
          <p>
            <a href={employee.cv_path} download className="text-blue-500 hover:underline">
              Download CV
            </a>
          </p>
        ) : (
          <p className="text-gray-500">No CV Available</p>
        )}
      </div>

      {/* Navigation Links */}
      <div className="mt-6">
        <Link
          to="/employees"
          className="inline-block bg-gray-500 text-white px-4 py-2 rounded mr-4"
        >
          Back to Employees
        </Link>
        <Link
          to={`/employees/${employee.id}/edit`}
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded"
        >
          Edit Employee
        </Link>
      </div>
    </div>
  );
}
