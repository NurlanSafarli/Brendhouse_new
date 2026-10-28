import { notFound } from "next/navigation";
import { Listing } from "../../../../components/listing";
const names: Record<string, string> = {
  kisi: "Kişi",
  qadin: "Qadın",
  usaq: "Uşaq",
  diger: "Digər",
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return {
    title: `${names[section] ?? "Bölmə"} | Brend House`,
    alternates: { canonical: `/bolme/${section}/` },
  };
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { section } = await params;
  if (!names[section]) notFound();
  return (
    <Listing
      title={names[section]}
      section={section}
      searchParams={await searchParams}
    />
  );
}
