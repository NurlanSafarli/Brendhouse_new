import { developmentCatalogEnabled } from "../../../lib/development-catalog";
import { Checkout } from "../../../components/checkout";
export const metadata = {
  title: "Sifarişi tamamla | Brend House",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <div className="wrap catalog-page">
      <Checkout preview={developmentCatalogEnabled()} />
    </div>
  );
}
