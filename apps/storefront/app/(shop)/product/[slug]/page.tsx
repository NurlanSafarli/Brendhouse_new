import { isPublicProduct } from "@brendhouse/contracts";
import { notFound } from "next/navigation";
import { getProduct } from "../../../../lib/catalog";
import { ProductDetail } from "../../../../components/product-detail";
import { CatalogUnavailable } from "../../../../components/shop";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getProduct(slug);
  return {
    title:
      result.status === "ready"
        ? `${result.data.title} | Brend House`
        : "Məhsul | Brend House",
    alternates: { canonical: `/product/${slug}/` },
    ...(result.status !== "ready" || !isPublicProduct(result.data)
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getProduct(slug);
  if (result.status === "missing") notFound();
  if (result.status === "unavailable")
    return (
      <div className="wrap">
        <CatalogUnavailable />
      </div>
    );
  return <ProductDetail product={result.data} />;
}
