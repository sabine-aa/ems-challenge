import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, "../database.yaml");
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, "utf8"));

const { sqlite_path: sqlitePath } = dbConfig;

const db = new sqlite3.Database(sqlitePath);

// Seed employees with required fields
const employees = [
  {
    full_name: "John Doe",
    email: "john.doe@example.com",
    phone_number: "+1234567890",
    date_of_birth: "2005-05-15", // Example underage case (Should be filtered out)
    job_title: "Software Engineer",
    department: "Engineering",
    salary: 75000,
    start_date: "2020-06-01",
    end_date: null,
    photo_path: null,
    cv_path: null,
  },
  {
    full_name: "Jane Smith",
    email: "jane.smith@example.com",
    phone_number: "+1987654321",
    date_of_birth: "1985-10-22",
    job_title: "Product Manager",
    department: "Product",
    salary: 85000,
    start_date: "2018-03-15",
    end_date: null,
    photo_path: null,
    cv_path: null,
  },
  {
    full_name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone_number: "+1122334455",
    date_of_birth: "1992-07-09",
    job_title: "HR Specialist",
    department: "Human Resources",
    salary: 60000,
    start_date: "2021-01-10",
    end_date: null,
    photo_path: null,
    cv_path: null,
  },
];

// Seed timesheets with a summary field
const timesheets = [
  {
    employee_id: 2,
    start_time: "2025-02-10 08:00:00",
    end_time: "2025-02-10 17:00:00",
    summary: "Worked on backend API development.",
  },
  {
    employee_id: 2,
    start_time: "2025-02-11 12:00:00",
    end_time: "2025-02-11 17:00:00",
    summary: "Reviewed project roadmap and coordinated with design team.",
  },
  {
    employee_id: 3,
    start_time: "2025-02-12 07:00:00",
    end_time: "2025-02-12 16:00:00",
    summary: "Conducted HR onboarding sessions.",
  },
];

// Insert data into tables
const insertData = (table, data) => {
  if (data.length === 0) {
    console.log(`No valid data for table: ${table}. Skipping insertion.`);
    return;
  }

  const columns = Object.keys(data[0]).join(", ");
  const placeholders = Object.keys(data[0])
    .map(() => "?")
    .join(", ");

  const insertStmt = db.prepare(
    `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
  );

  data.forEach((row) => {
    insertStmt.run(Object.values(row), (err) => {
      if (err) {
        console.error(`Error inserting into ${table}:`, err.message);
      }
    });
  });

  insertStmt.finalize();
};

// Ensure only adults (18+) are added
const isAdult = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return (
    age > 18 ||
    (age === 18 &&
      today.getMonth() >= birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate())
  );
};

// Filter valid employees
const validEmployees = employees.filter((emp) => isAdult(emp.date_of_birth));

db.serialize(() => {
  try {
    insertData("employees", validEmployees); // ✅ Use only valid employees
    insertData("timesheets", timesheets);
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Seeding error:", error);
  }
});

db.close((err) => {
  if (err) {
    console.error("Error closing database:", err.message);
  }
});
