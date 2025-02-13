import { redirect } from "react-router";
import { getDB } from "~/db/getDB";

export async function action({ params }: { params: { employeeId: string } }) {
  const db = await getDB();
  await db.run("DELETE FROM employees WHERE id = ?", [params.employeeId]);
  return redirect("/employees");
}
