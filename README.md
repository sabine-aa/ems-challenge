# Full Stack Web Developer role technical challenge

## Statement

The goal is to create a simple [employee management system](https://en.wikipedia.org/wiki/Human_resource_management_system) that allows an HR personnel to manage a company's employees.
The app should be simple to **create** on your part and to **use** on the end user's part.

It consists of **4 views**, there are 13 requirements and 12 bonus features.

### 1- Single Employee View (/employees/:id & /employees/new)

**Create/Update Form**

A page displaying a form used to create and update a single employee, it allows the user to:
**RUN FIRST THE BACKEND USING NODE SERVER.JS BESIDES ALL THE OTHER RUNS**

- Create a new employee **DONE**
- Update an employee's information **DONE : THE UPDATE IS INSIDE THE SINGLE EMPLOYEE VIEW**

Specs

- Requirements:

  1- personal fields you want to include (e.g. name, email, phone number, date of birth...), **DONE**

  2- professional fields (e.g. job title, department, salary, start date, end date...), **DONE**

  3- fields validation (e.g. required fields, valid emails/phone numbers...) You don't have to validate uniqueness or anything too complex **DONE**

  4- Navigation buttons to go to the list of employees, **DONE**

- _Bonus_

  1- Employee Photo (to be stored in the app's file system)**DONE**

  2- Documents such as CV, ID, etc. (to be stored in the app's file system) **DONE**

  3- Compliance validation (e.g. check if the employee is over 18 years old or if the salary is above a minimum wage or that an ID is uploaded) **DONE: SALARY CAN'T BE LESS THAN 15000**

  4- Any other field you think is relevant: **DONE: I ADDED A DELETE FUNCTION BY ID**
  Have at most 10 fields, a simple design using grid or flexbox is enough.

### 2- Multiple Employees View (/employees)

**List View**
A page displaying a list of employees, it allows the user to:

- View the list of employees **DONE**
- Go to the single employee view of an employee **DONE**

Specs

- Requirements

  5- Have a link for each row leading to the single employee view of the employee, **DONE**

  6- No more than 5 relevant columns, **DONE**

  7- Navigation buttons to go to the new employee page and the list of timesheets,
  **DONE**

- _Bonus_

  5- Search bar **DONE**

  6- Sorting by various fields **DONE : SORTING BY ID AND FULL NAME, IT IS GONNA SHOW THE ARROW ON THE ID ONLY IF YOU WANT TO SORT BY FULL NAME YOU HAVE TO CLICK ON IT SO THE ARROW SHOWS**

  7- Filtering **DID THE FILTERING ON THE TIMESHEETS VIEW ONLY**

  8- Pagination **DONE**

### 3- Single Timesheet View (/timesheets/:id & /timesheets/new)

**Create/Update Form**
A page displaying a form used to create and update a single timesheet, it allows the user to:

- Create a new timesheet **DONE**
- Update a timesheet's information **DONE: THE UPDATE IS INSIDE THE SINGLE TIMESHEET VIEW**

Specs

- Requirements

  8- Start and end time fields **DONE**

  9- Employee field (dropdown with the list of employees) **DONE**

  10- Navigation buttons to go to the employee, to the list of employees or to the list of timesheets **DONE**

- _Bonus_

  9- Validation: start time is before end time, end time is after start time. **DONE**

  10- Summary: a text input specifying the work done during the timesheet period **DONE: IT SHOWS INSIDE THE SINGLE TIMESHEET VIEW**

### 4- Multiple Timesheets View (/timesheets)

**List View**
A page displaying the created timesheets **DONE**

Specs

- Requirements

  11- Calendar view using [`schedule-x.dev`](https://schedule-x.dev) component, see this [`example`](https://schedule-x.dev/docs/frameworks/react#example) on how to implement it **DONE**

  12- A table view similar to the employee's table view with links to the single timesheet view **DONE**

  13- A toggle to switch between calendar and table views **DONE**

- _Bonus_

  11- Search bar **DONE IT ONLY FOR THE EMPLOYEES**

  12- Filtering by employee **DONE**

## Tech stack

The stack is already implemented for you:

- Frontend: React.js with React router,
- Backend: React router `loader` and `action` functions, see implemented scaffold and [doc](https://reactrouter.com/),
- Database: SQLite.

## Steps

1- [`git pull`](https://github.com/git-guides/git-pull) this repository or [fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) and pull your own fork.

2- You need to [`install node and npm on your machine`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if you haven't already.

3- Add new fields to the employees and timesheets tables by modifying [`./app/db/schema.sql`](https://github.com/edi2xml/ems-challenge/blob/main/app/db/setup.sql)

4- Create the db by running `npm run setup_db`

5- Add new seed data by modifying [`./scripts/seed.js`](https://github.com/edi2xml/ems-challenge/blob/main/scripts/seed.js)

6- Seed the db by running `npm run seed_db`

7- Run the development server with `npm run dev`

8- Modify these 6 files to satisfy as many of the 13 requirements and the 12 bonuses as you want. Some scaffolding has been done for you, the single employee and timesheet views are not implemented, it is advisable to extract the forms from the new resource pages as components and to reuse them in the single employee and timesheet views.

- [`app/routes/employees._index`](https://github.com/edi2xml/ems-challenge/blob/main/app/routes/employees._index/route.tsx)
- [`app/routes/employees.$employeeId._index`](https://github.com/edi2xml/ems-challenge/blob/main/app/routes/employees.$employeeId._index/route.tsx)
- [`app/routes/employees.new`](https://github.com/edi2xml/ems-challenge/blob/main/app/routes/employees.new/route.tsx)
- [`app/routes/timesheets._index`](https://github.com/edi2xml/ems-challenge/blob/main/app/routes/timesheets._index/route.tsx)
- [`app/routes/timesheets.$timesheetId._index`](https://github.com/edi2xml/ems-challenge/blob/main/app/routes/timesheets.$timesheetId._index/route.tsx)
- [`app/routes/timesheets.new`](https://github.com/edi2xml/ems-challenge/blob/main/app/routes/timesheets.new/route.tsx)

9- Make sure the app runs with:

```bash
npm run setup_db
npm run seed
npm run build
npm run start
```

9- Push your code to your **public** repository.

10- Fill in this [google form](https://forms.gle/pJ9x4jVTed4QsWMD6) with your info and repository link and feedback.

## What is not required

- Styling, but the app should be usable; if you want to style, uncomment the tailwind code in `app.css` to use tailwind or write your own styles there without tailwind or any other library.
- Authentication, authorization.
- Tests, but they are always welcome.
- Deployment, but you can deploy it if you want.
- Typing (the app uses typescript but just use `any` or ignore typescript errors if you want).
- Error handling, but it is always welcome.
