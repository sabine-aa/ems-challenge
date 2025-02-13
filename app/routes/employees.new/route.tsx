import { Form, redirect, type ActionFunction } from "react-router-dom";
import { getDB } from "~/db/getDB";
import { Link } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000"; // make ure backend is running using node server.js

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const uploadFile = async (file: File | null) => {
    if (!file) return null;

    const uploadData = new FormData();
    uploadData.append("file", file);

    const response = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: uploadData,
    });

    if (!response.ok) {
      throw new Error("File upload failed.");
    }

    const data = await response.json();
    return data.filePath; 
  };

  const newEmployee = {
    full_name: formData.get("full_name") as string,
    email: formData.get("email") as string,
    phone_number: formData.get("phone_number") as string,
    date_of_birth: formData.get("date_of_birth") as string,
    job_title: formData.get("job_title") as string,
    department: formData.get("department") as string,
    salary: parseInt(formData.get("salary") as string, 10),
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") || null, // Nullable field
    photo_path: await uploadFile(formData.get("photo") as File), // Upload photo
    cv_path: await uploadFile(formData.get("cv") as File), // Upload CV
  };

  const db = await getDB();
  await db.run(
    `INSERT INTO employees (full_name, email, phone_number, date_of_birth, job_title, 
      department, salary, start_date, end_date, photo_path, cv_path) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newEmployee.full_name,
      newEmployee.email,
      newEmployee.phone_number,
      newEmployee.date_of_birth,
      newEmployee.job_title,
      newEmployee.department,
      newEmployee.salary,
      newEmployee.start_date,
      newEmployee.end_date,
      newEmployee.photo_path,
      newEmployee.cv_path,
    ]
  );

  return redirect("/employees");
};

export default function NewEmployeePage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Create New Employee
      </h1>

      <Form
        method="post"
        encType="multipart/form-data"
        className="bg-white rounded-lg shadow-md p-6 space-y-4"
      >
        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Full Name:
          </label>
          <input
            type="text"
            name="full_name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Email:
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Phone:
          </label>
          <input
            type="text"
            name="phone_number"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Date of Birth:
          </label>
          <input
            type="date"
            name="date_of_birth"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Job Title:
          </label>
          <input
            type="text"
            name="job_title"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Department:
          </label>
          <input
            type="text"
            name="department"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Salary:
          </label>
          <input
            type="number"
            name="salary"
            min="15000"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
<div>
          <label className="block text-gray-600 font-semibold mb-1">
            Start Date:
          </label>
          <input
            type="date"
            name="start_date"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            End Date:
          </label>
          <input
            type="date"
            name="end_date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Employee Photo:
          </label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1">
            Upload CV:
          </label>
          <input
            type="file"
            name="cv"
            accept=".pdf,.doc,.docx"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Employee
        </button>
      </Form>

      <div className="mt-6 text-center">
        <Link
          to="/employees"
          className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Back to Employees
        </Link>
      </div>
    </div>
  );
}
