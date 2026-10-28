import { ShopHeader, ShopFooter } from "../../components/shop";
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a className="sr-only focus:not-sr-only" href="#shop-content">
        Məzmuna keç
      </a>
      <ShopHeader />
      <main id="shop-content">{children}</main>
      <ShopFooter />
    </>
  );
}
