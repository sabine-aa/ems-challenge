# Full Stack Web Developer role technical challenge

## Statement

The goal is to create a simple [employee management system](https://en.wikipedia.org/wiki/Human_resource_management_system) that allows an HR personnel to manage a company's employees.
The app should be simple to **create** on your part and to **use** on the end user's part.

It consists of **4 views**, there are 13 requirements and 12 bonus features.

### 1- Single Employee View (/employees/:id & /employees/new)
**Create/Update Form**

A page displaying a form used to create and update a single employee, it allows the user to:
- Create a new employee
- Update an employee's information

Specs
- Requirements:

  1- personal fields you want to include (e.g. name, email, phone number, date of birth...),

  2- professional fields (e.g. job title, department, salary, start date, end date...),

  3- fields validation (e.g. required fields, valid emails/phone numbers...) You don't have to validate uniqueness or anything too complex

  4- Navigation buttons to go to the list of employees,

- *Bonus*

  1- Employee Photo (to be stored in the app's file system)

  2- Documents such as CV, ID, etc. (to be stored in the app's file system)

  3- Compliance validation (e.g. check if the employee is over 18 years old or if the salary is above a minimum wage or that an ID is uploaded)

  4- Any other field you think is relevant

Have at most 10 fields, a simple design using grid or flexbox is enough.

### 2- Multiple Employees View (/employees)
**List View**
A page displaying a list of employees, it allows the user to:
- View the list of employees
- Go to the single employee view of an employee

Specs
- Requirements

  5- Have a link for each row leading to the single employee view of the employee,

  6- No more than 5 relevant columns,

  7- Navigation buttons to go to the new employee page and the list of timesheets,

- *Bonus*

  5- Search bar

  6- Sorting by various fields

  7- Filtering

  8- Pagination

### 3- Single Timesheet View (/timesheets/:id & /timesheets/new)
**Create/Update Form**
A page displaying a form used to create and update a single timesheet, it allows the user to:
- Create a new timesheet
- Update a timesheet's information

Specs
- Requirements

  8- Start and end time fields

  9- Employee field (dropdown with the list of employees)

  10- Navigation buttons to go to the employee, to the list of employees or to the list of timesheets

- *Bonus*

  9- Validation: start time is before end time, end time is after start time.

  10- Summary: a text input specifying the work done during the timesheet period

### 4- Multiple Timesheets View (/timesheets)
**List View**
A page displaying the created timesheets

Specs
- Requirements

  11- Calendar view using [`schedule-x.dev`](https://schedule-x.dev) component, see this [`example`](https://schedule-x.dev/docs/frameworks/react#example) on how to implement it
![Calendar view](./images/calendar_view.png)

  12- A table view similar to the employee's table view with links to the single timesheet view

  13- A toggle to switch between calendar and table views

- *Bonus*

  11- Search bar

  12- Filtering by employee

## Tech stack
- Frontend: React.js with React router
- Backend: React router (`loader` and `action` functions) backend or any other backend of your choice (e.g. rails, .net, django, flask, etc.)
- Database: SQLite or any other database of your choice (e.g. PostgreSQL, MySQL, MongoDB, etc.)
