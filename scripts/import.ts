import { readFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import { importCatalog } from "./catalog";
const [source, path] = process.argv.slice(2);
if (!source || !path)
  throw new Error("Usage: npm run import:catalog -- SOURCE FILE.json");
const rows: unknown = JSON.parse(await readFile(path, "utf8"));
if (!Array.isArray(rows)) throw new Error("Import must be a JSON array");
const db = new PrismaClient();
try {
  const report = await importCatalog(db, source, rows);
  console.log(JSON.stringify(report));
  if (report.rejected) process.exitCode = 1;
} finally {
  await db.$disconnect();
}
