import Link from "next/link";
import { AccountPreview } from "../../../components/bonus";
import { developmentCatalogEnabled } from "../../../lib/development-catalog";
export const metadata = {
  title: "Hesabım | Brend House",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <div className="wrap catalog-page">
      <h1>Hesabım</h1>
      {developmentCatalogEnabled() ? (
        <>
          <p className="unverified-note">
            Hesab ekranının test görünüşü. Real hesab və ya bonus kartı deyil.
          </p>
          <AccountPreview />
        </>
      ) : (
        <div className="catalog-state">
          <p>Hesabınıza telefon nömrəsi ilə daxil olun.</p>
          <Link className="button button-primary" href="/bonus-karti">
            Telefonla davam et →
          </Link>
          <Link href="/bolme/qadin" className="button button-quiet">
            Qeydiyyatsız alış-veriş
          </Link>
        </div>
      )}
    </div>
  );
}
