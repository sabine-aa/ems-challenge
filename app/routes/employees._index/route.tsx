import { useLoaderData, Link } from "react-router-dom";
import { getDB } from "~/db/getDB";
import { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:5000"; // make sure to run backend server on node server.js


export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT * FROM employees;");
  return { employees };
}

type SortOrder = "asc" | "desc";

export default function EmployeesPage() {
  const { employees } = useLoaderData() as { employees: any[] };
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [sortField, setSortField] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Filter employees based on search term
  useEffect(() => {
    const filtered = employees.filter((employee) =>
      `${employee.full_name} ${employee.email} ${employee.phone_number}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
   const sorted = [...filtered].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredEmployees(sorted);
  }, [searchTerm, employees, sortField, sortOrder]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Get sort arrow
  const getSortArrow = (field: string) => {
    if (sortField === field) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return "";
  };


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Employees
      </h1>
     <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => handleSort("id")}
              >
                ID {getSortArrow("id")}
              </th>
              <th className="py-3 px-4 text-left">Photo</th>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => handleSort("full_name")}
              >
                Full Name {getSortArrow("full_name")}
              </th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-center">CV</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
             {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee, index) => (
                <tr
                  key={employee.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="py-3 px-4">{employee.id}</td>

                  {/* Employee Photo */}
                  <td className="py-3 px-4">
                    {employee.photo_path ? (
                      <img
                        src={`${BACKEND_URL}${employee.photo_path}`}
                        alt={employee.full_name}
                        className="w-16 h-16 rounded-full object-cover border border-gray-300"
                      />
                    ) : (
                      <span className="text-gray-400">No Photo</span>
                    )}
                  </td>

                  <td className="py-3 px-4">{employee.full_name}</td>
                  <td className="py-3 px-4">{employee.email}</td>
                  <td className="py-3 px-4">{employee.phone_number}</td>
                 
                  
                  {/* CV */}
                  <td className="py-3 px-4 text-center">
                    {employee.cv_path ? (
                      <a
                        href={`${BACKEND_URL}${employee.cv_path}`}
                        download
                        className="text-blue-500 hover:underline"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-400">No CV</span>
                    )}
                  </td>

                  
                  <td className="py-3 px-4 text-center">
                    <Link
                      to={`/employees/${employee.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="py-4 text-center text-gray-500"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex space-x-4 justify-center">
        <Link
          to="/employees/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          + New Employee
        </Link>
        <Link
          to="/timesheets"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          View Timesheets
        </Link>
      </div>
    </div>
  );
}
