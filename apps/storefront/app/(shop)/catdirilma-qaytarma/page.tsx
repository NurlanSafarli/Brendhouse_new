import { confirmedPolicy } from "../../../lib/policy";
export const metadata = {
  title: "Çatdırılma və qaytarma | Brend House",
  alternates: { canonical: "/catdirilma-qaytarma" },
};
export default function Page() {
  return (
    <article className="wrap catalog-page bonus-copy">
      <p className="eyebrow">Almazdan əvvəl bil</p>
      <h1>Çatdırılma və qaytarma</h1>
      <h2>Bakı üzrə çatdırılma</h2>
      <p>
        Çatdırılma haqqı {(confirmedPolicy.bakuDeliveryQepik / 100).toFixed(2)}{" "}
        ₼. Məhsulların endirimdən sonrakı cəmi{" "}
        {(confirmedPolicy.freeDeliveryQepik / 100).toFixed(2)} ₼ və daha çox
        olduqda Bakı üzrə çatdırılma pulsuzdur.
      </p>
      <h2>Qapıda yoxlama</h2>
      <p>Sifarişi qapıda yoxlayıb sonra ödəmək nəzərdə tutulub.</p>
      <h2>Qaytarma</h2>
      <p>
        Qaytarma müddəti {confirmedPolicy.returnDays} gündür. Prosedur və
        məhsula aid məlumat üçün dəstək xidməti ilə əlaqə saxlayın.
      </p>
      <h2>Digər bölgələr</h2>
      <p>Bölgələr üzrə qiymət və çatdırılma müddəti hələ dərc edilməyib.</p>
      <p className="unverified-note">
        Hazırkı frontend versiyasında real sifariş və çatdırılma başladılmır.
      </p>
      <a href="https://wa.me/994503044811" className="button button-secondary">
        Dəstək ilə əlaqə
      </a>
    </article>
  );
}
