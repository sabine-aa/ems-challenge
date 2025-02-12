import { redirect } from "react-router";
import { getDB } from "~/db/getDB";

export async function action({ params }: { params: { timesheetId: string } }) {
  const db = await getDB();
  await db.run("DELETE FROM timesheets WHERE id = ?", [params.timesheetId]);
  return redirect("/timesheets");
}
