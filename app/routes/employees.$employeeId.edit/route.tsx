import { useLoaderData, Form, redirect } from "react-router-dom";
import { getDB } from "~/db/getDB";

const BACKEND_URL = "http://localhost:5000"; // ✅ Ensure backend URL is used

// ✅ Fetch employee details for the form
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

// ✅ Handle form submission and update employee
export async function action({ request, params }: { request: Request; params: { employeeId: string } }) {
  const formData = await request.formData();

  const photo = formData.get("photo") as File;
  const cv = formData.get("cv") as File;

  let photo_path = formData.get("current_photo") as string;
  let cv_path = formData.get("current_cv") as string;

  // ✅ Upload new photo if selected
  if (photo && photo.name) {
    const uploadForm = new FormData();
    uploadForm.append("file", photo);

    const uploadResponse = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: uploadForm,
    });

    const uploadData = await uploadResponse.json();
    photo_path = uploadData.filePath;
  }

  // ✅ Upload new CV if selected
  if (cv && cv.name) {
    const uploadForm = new FormData();
    uploadForm.append("file", cv);

    const uploadResponse = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: uploadForm,
    });

    const uploadData = await uploadResponse.json();
    cv_path = uploadData.filePath;
  }

  const updatedEmployee = {
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone_number: formData.get("phone_number"),
    job_title: formData.get("job_title"),
    department: formData.get("department"),
    salary: formData.get("salary"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date") || null,
    photo_path,
    cv_path,
  };

  const db = await getDB();
  await db.run(
    `UPDATE employees SET 
      full_name = ?, email = ?, phone_number = ?, job_title = ?, 
      department = ?, salary = ?, start_date = ?, end_date = ?, 
      photo_path = ?, cv_path = ?
    WHERE id = ?;`,
    [
      updatedEmployee.full_name,
      updatedEmployee.email,
      updatedEmployee.phone_number,
      updatedEmployee.job_title,
      updatedEmployee.department,
      updatedEmployee.salary,
      updatedEmployee.start_date,
      updatedEmployee.end_date,
      updatedEmployee.photo_path,
      updatedEmployee.cv_path,
      params.employeeId,
    ]
  );

  return redirect(`/employees/${params.employeeId}`);
}


// ✅ Edit Employee Page UI
export default function EditEmployeePage() {
  const { employee } = useLoaderData() as { employee: any };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Employee</h1>

      <Form method="post" encType="multipart/form-data" className="border p-4 rounded-lg shadow-md bg-white">
        {/* Full Name */}
        <label className="block mb-2">
          Full Name:
          <input type="text" name="full_name" defaultValue={employee.full_name} required className="w-full p-2 border rounded" />
        </label>

        {/* Email */}
        <label className="block mb-2">
          Email:
          <input type="email" name="email" defaultValue={employee.email} required className="w-full p-2 border rounded" />
        </label>

        {/* Phone */}
        <label className="block mb-2">
          Phone:
          <input type="text" name="phone_number" defaultValue={employee.phone_number} required className="w-full p-2 border rounded" />
        </label>

        {/* Job Title */}
        <label className="block mb-2">
          Job Title:
          <input type="text" name="job_title" defaultValue={employee.job_title} required className="w-full p-2 border rounded" />
        </label>

        {/* Department */}
        <label className="block mb-2">
          Department:
          <input type="text" name="department" defaultValue={employee.department} required className="w-full p-2 border rounded" />
        </label>

        {/* Salary */}
        <label className="block mb-2">
          Salary:
          <input type="number" name="salary" defaultValue={employee.salary} required className="w-full p-2 border rounded" />
        </label>

        {/* Start Date */}
        <label className="block mb-2">
          Start Date:
          <input type="date" name="start_date" defaultValue={employee.start_date} required className="w-full p-2 border rounded" />
        </label>

        {/* End Date (Nullable) */}
        <label className="block mb-2">
          End Date:
          <input type="date" name="end_date" defaultValue={employee.end_date || ""} className="w-full p-2 border rounded" />
        </label>

        {/* Current Photo Preview */}
        <label className="block mb-2">
          Current Photo:
          {employee.photo_path ? (
            <img src={`${BACKEND_URL}${employee.photo_path}`} alt="Current Photo" className="rounded-full object-cover border border-gray-300"
  style={{ width: "200px", height: "200px" }}/>
          ) : (
            <p className="text-gray-500">No photo available</p>
          )}
          <input type="hidden" name="current_photo" value={employee.photo_path} />
        </label>

        {/* Upload New Photo */}
        <label className="block mb-2">
          Upload New Photo:
          <input type="file" name="photo" accept="image/*" className="w-full p-2 border rounded" />
        </label>

        {/* Current CV Download */}
        <label className="block mb-2">
          Current CV:
          {employee.cv_path ? (
            <a href={`${BACKEND_URL}${employee.cv_path}`} download className="text-blue-500 hover:underline">
              Download Current CV
            </a>
          ) : (
            <p className="text-gray-500">No CV available</p>
          )}
          <input type="hidden" name="current_cv" value={employee.cv_path} />
        </label>

        {/* Upload New CV */}
        <label className="block mb-2">
          Upload New CV:
          <input type="file" name="cv" accept=".pdf,.doc,.docx" className="w-full p-2 border rounded" />
        </label>

        {/* Submit Button */}
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </Form>

      {/* Navigation Links */}
      <div className="mt-6">
        <a href={`/employees/${employee.id}`} className="inline-block bg-gray-500 text-white px-4 py-2 rounded mr-4">
          Cancel
        </a>
      </div>
    </div>
  );
}
