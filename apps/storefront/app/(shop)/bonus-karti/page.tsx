import { BonusFlow } from "../../../components/bonus";
import { developmentCatalogEnabled } from "../../../lib/development-catalog";
export const metadata = {
  title: "Bonus kartı | Brend House",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <div className="wrap catalog-page">
      <BonusFlow preview={developmentCatalogEnabled()} />
    </div>
  );
}
