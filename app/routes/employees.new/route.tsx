import { Form, redirect, type ActionFunction } from "react-router-dom";
import { getDB } from "~/db/getDB";
import { Link } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000"; // Backend URL

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  // ✅ Upload files to backend
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
    return data.filePath; // ✅ Returns uploaded file path (e.g., /uploads/photo.png)
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

  // ✅ Insert data into database
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

// ✅ New Employee Form
export default function NewEmployeePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Employee</h1>

      <Form method="post" encType="multipart/form-data" className="border p-4 rounded-lg shadow-md bg-white">
        <label className="block mb-2">
          Full Name:
          <input type="text" name="full_name" required className="w-full p-2 border rounded" />
        </label>

        <label className="block mb-2">
          Email:
          <input type="email" name="email" required className="w-full p-2 border rounded" />
        </label>

        <label className="block mb-2">
          Phone:
          <input type="text" name="phone_number" required className="w-full p-2 border rounded" />
        </label>

        <label className="block mb-2">
          Date of Birth:
          <input type="date" name="date_of_birth" required className="w-full p-2 border rounded" />
        </label>

        <label className="block mb-2">
          Job Title:
          <input type="text" name="job_title" required className="w-full p-2 border rounded" />
        </label>

        <label className="block mb-2">
          Department:
          <input type="text" name="department" required className="w-full p-2 border rounded" />
        </label>

        <label className="block mb-2">
          Salary:
          <input type="number" name="salary" min="15000" required className="w-full p-2 border rounded" />
        </label>

        <label className="block mb-2">
          Start Date:
          <input type="date" name="start_date" required className="w-full p-2 border rounded" />
        </label>

        <label className="block mb-2">
          End Date:
          <input type="date" name="end_date" className="w-full p-2 border rounded" />
        </label>

        {/* Photo Upload */}
        <label className="block mb-2">
          Employee Photo:
          <input type="file" name="photo" accept="image/*" className="w-full p-2 border rounded" />
        </label>

        {/* CV Upload */}
        <label className="block mb-2">
          Upload CV:
          <input type="file" name="cv" accept=".pdf,.doc,.docx" className="w-full p-2 border rounded" />
        </label>

        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Create Employee
        </button>
      </Form>
      <Link
          to="/employees"
          className="inline-block bg-gray-500 text-white px-4 py-2 rounded mr-4"
        >
          Back to Employees
        </Link>
    </div>
  );
}
