import { Accordion } from "@brendhouse/design-system";
import { confirmedPolicy } from "../../../lib/policy";
export const metadata = {
  title: "Tez-tez verilən suallar | Brend House",
  alternates: { canonical: "/faq" },
};
export default function Page() {
  return (
    <article className="wrap catalog-page bonus-copy">
      <p className="eyebrow">Kömək mərkəzi</p>
      <h1>Sualın var?</h1>
      <p>Seçimdən sifarişə qədər əsas məlumatlar.</p>
      <Accordion
        items={[
          {
            title: "Sifariş üçün hesab lazımdır?",
            content: (
              <p>
                Xeyr. Qeydiyyatsız checkout əsas seçimdir. Bonus kartı
                könüllüdür.
              </p>
            ),
          },
          {
            title: "Çatdırılma nə qədərdir?",
            content: (
              <p>
                Bakı üzrə çatdırılma{" "}
                {(confirmedPolicy.bakuDeliveryQepik / 100).toFixed(2)} ₼ təşkil
                edir. Məhsulların endirimdən sonrakı cəmi{" "}
                {(confirmedPolicy.freeDeliveryQepik / 100).toFixed(2)} ₼ olduqda
                Bakı üzrə çatdırılma pulsuzdur. Digər bölgələr üzrə məlumat üçün
                bizimlə əlaqə saxlayın.
              </p>
            ),
          },
          {
            title: "Sifarişi qapıda yoxlaya bilərəm?",
            content: (
              <p>
                Qapıda yoxlama və sonra ödəniş nəzərdə tutulub. Yekun çatdırılma
                və ödəniş seçimi sifariş zamanı göstərilir.
              </p>
            ),
          },
          {
            title: "Qaytarma müddəti nə qədərdir?",
            content: (
              <p>
                Təsdiqlənmiş qaytarma müddəti {confirmedPolicy.returnDays}{" "}
                gündür. Konkret məhsul və qaytarma proseduru barədə dəstək
                xidməti ilə əlaqə saxlayın.
              </p>
            ),
          },
          {
            title: "Hansı ölçünü seçim?",
            content: (
              <p>
                Məhsul səhifəsində təsdiqlənmiş ölçü cədvəli olduqda ona baxın.
                Bədən ölçüləri geyimin ölçüləri deyil; model və fasona görə
                fərqlənə bilər.
              </p>
            ),
          },
          {
            title: "Bonus kartı necə yaradılır?",
            content: (
              <p>
                Bonus kartı yalnız telefon nömrəsinin SMS kodu ilə təsdiqindən
                sonra yaradıla bilər. Hazırkı test görünüşü real hesab yaratmır.
              </p>
            ),
          },
          {
            title: "Hazırda real sifariş və ödəniş mümkündür?",
            content: (
              <p>
                Xeyr. Bu frontend versiyasında sifariş və ödəniş axını test
                üçündür. Real ödəniş tutulmur.
              </p>
            ),
          },
        ]}
      />
      <a href="https://wa.me/994503044811" className="button button-secondary">
        WhatsApp ilə soruş
      </a>
    </article>
  );
}
