import { useLoaderData } from "react-router-dom";
import { getDB } from "~/db/getDB";
import { Link } from "react-router-dom";

// Fetch employees from database
export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT * FROM employees;");
  return { employees };
}

export default function EmployeesPage() {
  const { employees } = useLoaderData() as { employees: any[] };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>

      {/* Employees Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Photo</th>
            <th className="border p-2">Full Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Job Title</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Salary</th>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">CV</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee.id} className="border">
                <td className="border p-2 text-center">{employee.id}</td>

                {/* Employee Photo */}
                <td className="border p-2 text-center">
                  {employee.photo_path ? (
                    <img
                      src={employee.photo_path}
                      alt={employee.full_name} // Fixed alt issue
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No Photo</span>
                  )}
                </td>

                <td className="border p-2">{employee.full_name}</td>
                <td className="border p-2">{employee.email}</td>
                <td className="border p-2">{employee.phone_number}</td>
                <td className="border p-2">{employee.job_title}</td>
                <td className="border p-2">{employee.department}</td>
                <td className="border p-2">${employee.salary.toLocaleString()}</td>
                <td className="border p-2">{employee.start_date}</td>

                {/* CV Download Link */}
                <td className="border p-2 text-center">
                  {employee.cv_path ? (
                    <a
                      href={employee.cv_path}
                      download
                      className="text-blue-500 hover:underline"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-gray-400">No CV</span>
                  )}
                </td>

                {/* View Employee Button */}
                <td className="border p-2 text-center">
                  <Link
                    to={`/employees/${employee.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={11} className="p-4 text-center text-gray-500">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Navigation Links */}
      <div className="mt-6">
        <Link
          to="/employees/new"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          + New Employee
        </Link>
        <Link
          to="/timesheets"
          className="inline-block bg-gray-500 text-white px-4 py-2 rounded"
        >
          View Timesheets
        </Link>
      </div>
    </div>
  );
}
