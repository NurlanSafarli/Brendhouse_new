import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ShopHeader, ShopFooter } from "../components/shop";
export default function Home() {
  return (
    <>
      <ShopHeader />
      <main>
        <section className="editorial-hero">
          <div className="wrap editorial-inner">
            <div className="editorial-copy">
              <p className="eyebrow">Həyatın hər anında</p>
              <h1>
                Öz tərzin.
                <br />
                Öz hekayən.
              </h1>
              <p>Gözəl həyat, gözəl geyimlə başlayır!</p>
              <Link href="/bolme/qadin" className="button button-primary">
                Kolleksiyalara bax <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="editorial-mark" aria-hidden="true">
              <span>BH</span>
              <small>BREND HOUSE</small>
            </div>
            <span className="hero-caption">KİŞİ · QADIN · UŞAQ</span>
          </div>
        </section>
        <section className="wrap home-sections">
          <div className="home-section-title">
            <div>
              <p className="eyebrow">Sənin dünyan</p>
              <h2>Hər günün öz tərzi var.</h2>
            </div>
            <p>Özün və sevdiklərin üçün.</p>
          </div>
          <div className="department-grid">
            {[
              ["kisi", "Kişi", "01"],
              ["qadin", "Qadın", "02"],
              ["usaq", "Uşaq", "03"],
            ].map(([slug, label, index]) => (
              <Link
                key={slug}
                href={`/bolme/${slug}`}
                className={`department department-${slug}`}
              >
                <span className="department-number">{index}</span>
                <span className="department-mark" aria-hidden="true">
                  BH
                </span>
                <span className="department-name">
                  {label}
                  <ArrowUpRight size={24} />
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="brand-statement">
          <div className="wrap">
            <p className="eyebrow">BREND HOUSE</p>
            <h2>
              Geyimdən daha çox.
              <br />
              Özünü yaxşı hiss etmək.
            </h2>
            <p>2014-cü ildən · 19 filial</p>
            <a
              href="https://wa.me/994503044811"
              className="button button-secondary"
            >
              Bizimlə əlaqə
            </a>
          </div>
        </section>
      </main>
      <ShopFooter />
    </>
  );
}
