import { useLoaderData, Form, redirect } from "react-router-dom";
import { getDB } from "~/db/getDB";

const BACKEND_URL = "http://localhost:5000"; // make sure backend is running uing node server.js

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

export async function action({
  request,
  params,
}: {
  request: Request;
  params: { employeeId: string };
}) {
  const formData = await request.formData();

  const photo = formData.get("photo") as File;
  const cv = formData.get("cv") as File;

  let photo_path = formData.get("current_photo") as string;
  let cv_path = formData.get("current_cv") as string;

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

export default function EditEmployeePage() {
  const { employee } = useLoaderData() as { employee: any };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Edit Employee
        </h1>

        <Form
          method="post"
          encType="multipart/form-data"
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Full Name:
            </label>
            <input
              type="text"
              name="full_name"
              defaultValue={employee.full_name}
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
              defaultValue={employee.email}
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
              defaultValue={employee.job_title}
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
              defaultValue={employee.salary}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
           <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Phone Number:
            </label>
            <input
              type="text"
              name="phone_number"
              defaultValue={employee.phone_number}
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
              defaultValue={employee.date_of_birth}
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
              defaultValue={employee.department}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Current Photo:
            </label>
            {employee.photo_path ? (
              <img
                src={`${BACKEND_URL}${employee.photo_path}`}
                alt="Current Photo"
                className="w-32 h-32 rounded-full object-cover border border-gray-300 mb-2"
              />
            ) : (
              <p className="text-gray-500">No photo available</p>
            )}
            <input
              type="hidden"
              name="current_photo"
              value={employee.photo_path}
            />
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Current CV:
            </label>
            {employee.cv_path ? (
              <a
                href={`${BACKEND_URL}${employee.cv_path}`}
                download
                className="text-blue-500 hover:underline"
              >
                Download Current CV
              </a>
            ) : (
              <p className="text-gray-500">No CV available</p>
            )}
            <input
              type="hidden"
              name="current_cv"
              value={employee.cv_path}
            />
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>


          <div>
            <label className="block text-gray-600 font-semibold mb-1">
              Start Date:
            </label>
            <input
              type="date"
              name="start_date"
              defaultValue={employee.start_date}
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
              defaultValue={employee.end_date || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </Form>

        <div className="mt-6 text-center">
          <a
            href={`/employees/${employee.id}`}
            className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}
