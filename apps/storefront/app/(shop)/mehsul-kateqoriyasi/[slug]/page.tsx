import { Listing } from "../../../../components/listing";
export const metadata = { title: "Məhsullar | Brend House" };
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  return (
    <Listing
      title="Məhsullar"
      category={slug}
      searchParams={await searchParams}
    />
  );
}
