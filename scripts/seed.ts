import { PrismaClient } from "@prisma/client";
import { importCatalog } from "./catalog";
if (
  process.env.NODE_ENV === "production" ||
  process.env.ALLOW_UNVERIFIED_SEED !== "true"
)
  throw new Error(
    "Development seed requires ALLOW_UNVERIFIED_SEED=true and non-production environment",
  );
const db = new PrismaClient();
try {
  const report = await importCatalog(
    db,
    "development-seed",
    [
      {
        sourceId: "polo-1",
        code: "UNVERIFIED-POLO-1",
        slug: "unverified-kisi-polo",
        title: "Klassik kişi polo köynəyi",
        variants: [
          { barcode: "2000000000015", color: "Krem", size: "M", price: 2790 },
        ],
      },
    ],
    true,
  );
  if (report.rejected) throw new Error("Seed rejected");
  console.log("Unverified development seed stored; publication prohibited.");
} finally {
  await db.$disconnect();
}
