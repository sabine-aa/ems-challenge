-- Drop existing tables if they exist
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS timesheets;

-- Create employees table
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    salary INTEGER CHECK (salary >= 15000),  -- Keep this check
    start_date DATE NOT NULL,
    end_date DATE,  -- Nullable for active employees
    photo_path TEXT,
    cv_path TEXT
);


-- Create timesheets table
CREATE TABLE timesheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    summary TEXT, -- Bonus: Brief description of work done
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    CHECK (start_time < end_time)  -- Ensures valid time range
);
