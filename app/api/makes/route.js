import Make from "../../models/make.model.js";
import dbconnect from "../../lib/mongodb.js";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbconnect();
  const makes = await Make.find({});
  return Response.json(makes);
}
