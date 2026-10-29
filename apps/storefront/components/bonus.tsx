"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Wallet,
  Clock,
  ShieldCheck,
  ShoppingBag,
  MapPin,
  Heart,
  Bell,
} from "lucide-react";
import { createPreviewIdentity } from "../lib/commerce/preview-identity";
import type { Challenge } from "@brendhouse/contracts";
export function AccountPreview() {
  const [tab, setTab] = useState("Bonus kartı");
  const [sms, setSms] = useState(false);
  return (
    <div className="account-layout">
      <nav aria-label="Hesab bölmələri" className="account-nav">
        {[
          "Bonus kartı",
          "Sifarişlər",
          "Ünvanlar",
          "Seçilmişlər",
          "Bildirişlər",
        ].map((item) => (
          <button
            key={item}
            aria-current={tab === item ? "page" : undefined}
            onClick={() => setTab(item)}
          >
            {item}
            <ArrowRight size={16} />
          </button>
        ))}
      </nav>
      <section className="account-content">
        <h2>{tab}</h2>
        {tab === "Bonus kartı" ? (
          <>
            <div className="loyalty-card">
              <p>BREND HOUSE</p>
              <Wallet size={38} />
              <h3>Sənin bonus kartın</h3>
              <span>TEST GÖRÜNÜŞÜ · AKTİV KART DEYİL</span>
            </div>
            <div className="balance-grid">
              {[
                "İstifadə edilə bilən",
                "Gözləmədə olan",
                "Bitmək üzrə olan",
              ].map((label) => (
                <div className="panel" key={label}>
                  <p className="muted">{label}</p>
                  <strong>—</strong>
                </div>
              ))}
            </div>
            <p className="muted">
              Balans və kart nömrəsi yalnız təsdiqlənmiş hesabdan alınacaq.
              Burada real bonus hesablanmır.
            </p>
            <h3>Bonus tarixçəsi</h3>
            <div className="account-empty">
              <Clock />
              <p>Göstəriləcək əməliyyat yoxdur.</p>
            </div>
          </>
        ) : tab === "Sifarişlər" ? (
          <div className="account-empty">
            <ShoppingBag />
            <p>Bu test görünüşündə sifariş tarixçəsi yoxdur.</p>
            <Link href="/bolme/qadin">Məhsullara bax →</Link>
          </div>
        ) : tab === "Ünvanlar" ? (
          <div className="account-empty">
            <MapPin />
            <p>Saxlanmış ünvan yoxdur.</p>
            <p className="muted">
              Guest checkout-da ünvanı hesab yaratmadan daxil edə bilərsiniz.
            </p>
          </div>
        ) : tab === "Seçilmişlər" ? (
          <div className="account-empty">
            <Heart />
            <Link href="/secilmisler">Seçilmiş məhsullara bax →</Link>
          </div>
        ) : (
          <div className="panel">
            <Bell />
            <h3>Bildiriş seçimləri</h3>
            <label className="radio-option">
              <input
                type="checkbox"
                checked={sms}
                onChange={(e) => setSms(e.target.checked)}
              />
              SMS yeniliklərini almaq istəyirəm
            </label>
            <p className="muted">
              Bu seçim yalnız bu test ekranında dəyişir; razılıq qeydə alınmır
              və mesaj göndərilmir.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
export function BonusFlow({ preview }: { preview: boolean }) {
  const port = useRef(createPreviewIdentity());
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!challenge) return;
    const tick = () =>
      setSeconds(
        Math.max(0, Math.ceil((challenge.retryAt - Date.now()) / 1000)),
      );
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [challenge]);
  async function request() {
    setBusy(true);
    setError("");
    const normalized = phone.replace(/[\s()-]/g, "");
    if (!/^\+994\d{9}$/.test(normalized)) {
      setError("Telefon nömrəsini +994 və 9 rəqəmlə daxil edin.");
      setBusy(false);
      return;
    }
    if (!preview) {
      setError(
        "SMS xidməti hələ qoşulmayıb. Alış-verişə qeydiyyatsız davam edə bilərsiniz.",
      );
      setBusy(false);
      return;
    }
    const next = await port.current.request(normalized);
    if (next) {
      setChallenge(next);
      setSeconds(30);
      setCode("");
    } else setError("Yenidən cəhd etməzdən əvvəl gözləyin.");
    setBusy(false);
  }
  if (complete)
    return (
      <>
        <p className="unverified-note">
          Test axını tamamlandı. Real telefon təsdiqi, hesab və bonus kartı
          yaradılmayıb.
        </p>
        <AccountPreview />
        <button
          className="button button-secondary"
          onClick={() => {
            setComplete(false);
            setChallenge(null);
            setCode("");
            setPhone("");
            setError("");
          }}
        >
          Testdən çıx
        </button>
      </>
    );
  return (
    <div className="bonus-layout">
      <section>
        <p className="eyebrow">Seçim sənindir</p>
        <h1>
          Bir kart.
          <br />
          Sənin seçimlərin.
        </h1>
        <p className="bonus-lead">
          Bonus kartı könüllüdür. Alış-veriş üçün hesab yaratmağa ehtiyac
          yoxdur.
        </p>
        <div className="bonus-benefit">
          <ShieldCheck />
          <p>Hesab və kart yalnız telefon təsdiqindən sonra yaradılır.</p>
        </div>
        <Link href="/bonus-qaydalari" className="choose-size">
          Bonus necə işləyir? →
        </Link>
      </section>
      <form
        className="panel checkout-form"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!challenge) {
            await request();
            return;
          }
          setBusy(true);
          const result = await port.current.verify(challenge.id, code);
          if (result.kind === "preview") setComplete(true);
          else
            setError(
              result.code === "EXPIRED"
                ? "Kodun vaxtı bitdi. Yeni kod istəyin."
                : result.code === "LOCKED"
                  ? "Cəhd limiti bitdi. Yeni kod istəyin."
                  : "Kod yanlışdır. Yenidən cəhd edin.",
            );
          setBusy(false);
        }}
      >
        <h2>{challenge ? "Kodu daxil et" : "Bonus kartı"}</h2>
        <label>
          Telefon nömrəsi
          <input
            type="tel"
            autoComplete="tel"
            value={phone}
            disabled={!!challenge}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+994 50 123 45 67"
            required
            maxLength={24}
          />
        </label>
        {challenge && (
          <>
            <label>
              SMS kodu
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
            </label>
            <button
              type="button"
              className="button button-quiet"
              disabled={seconds > 0 || busy}
              onClick={request}
            >
              {seconds > 0
                ? `Yenidən göndər (${seconds} san)`
                : "Yeni kod istə"}
            </button>
            <button
              type="button"
              className="button button-quiet"
              onClick={() => {
                setChallenge(null);
                setCode("");
                setError("");
              }}
            >
              Nömrəni dəyiş
            </button>
          </>
        )}
        {preview && (
          <p className="unverified-note">
            Test rejimi: SMS göndərilmir.{" "}
            {challenge
              ? "Axını yoxlamaq üçün 123456 kodunu daxil edin."
              : "Telefon nömrəsi saxlanılmır."}
          </p>
        )}
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button className="button button-primary" disabled={busy}>
          {busy ? "Yoxlanılır…" : challenge ? "Kodu yoxla" : "Davam et →"}
        </button>
        <Link href="/checkout" className="button button-quiet">
          Qeydiyyatsız davam et
        </Link>
      </form>
    </div>
  );
}
