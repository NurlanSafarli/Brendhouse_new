import { CartView } from "../../../components/cart-view";
export const metadata = {
  title: "Səbətim | Brend House",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <div className="wrap catalog-page">
      <CartView />
    </div>
  );
}
