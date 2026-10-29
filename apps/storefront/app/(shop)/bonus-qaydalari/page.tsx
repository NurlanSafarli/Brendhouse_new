import Link from "next/link";
export const metadata = { title: "Bonus necə işləyir? | Brend House" };
export default function Page() {
  return (
    <article className="wrap catalog-page bonus-copy">
      <p className="eyebrow">Aydın qaydalar</p>
      <h1>Bonus necə işləyir?</h1>
      <h2>Kart almaq məcburidir?</h2>
      <p>
        Xeyr. Bonus kartı könüllüdür. Sifarişi qeydiyyatsız verə bilərsiniz.
      </p>
      <h2>Hesab necə yaradılır?</h2>
      <p>
        Hesab və bonus kartı telefon nömrəsinin SMS kodu ilə təsdiqindən sonra
        yaradılır.
      </p>
      <h2>Balans harada görünür?</h2>
      <p>
        Hesabda istifadə edilə bilən, gözləmədə olan və bitmək üzrə olan
        bonuslar ayrıca göstərilir.
      </p>
      <h2>Bonus şərtləri</h2>
      <p>
        Bonus xidməti hazırda aktiv deyil. Toplama və istifadə şərtləri
        təsdiqləndikdən sonra burada dərc olunacaq.
      </p>
      <Link href="/bonus-karti" className="button button-primary">
        Bonus kartına bax →
      </Link>
    </article>
  );
}
