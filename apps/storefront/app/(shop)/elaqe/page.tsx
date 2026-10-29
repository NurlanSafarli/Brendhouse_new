export const metadata = {
  title: "Əlaqə | Brend House",
  alternates: { canonical: "/elaqe" },
};
export default function Page() {
  return (
    <article className="wrap catalog-page bonus-copy">
      <p className="eyebrow">Səni dinləyirik</p>
      <h1>Bizimlə əlaqə</h1>
      <div className="panel">
        <h2>Brend House dəstək xidməti</h2>
        <p>
          <a className="choose-size" href="tel:+994503044811">
            (050) 304 48 11
          </a>
        </p>
        <p>
          <a className="choose-size" href="mailto:info@brendhouse.az">
            info@brendhouse.az
          </a>
        </p>
        <a className="button button-primary" href="https://wa.me/994503044811">
          WhatsApp ilə yaz →
        </a>
      </div>
    </article>
  );
}
