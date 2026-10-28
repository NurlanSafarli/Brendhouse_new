import { Listing } from "../../../components/listing";
export const metadata = {
  title: "Axtarış | Brend House",
  robots: { index: false, follow: true },
};
export default async function Search({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <Listing title="Axtarış" searchParams={await searchParams} />;
}
