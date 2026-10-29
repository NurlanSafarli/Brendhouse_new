"use client";
import { useState, useSyncExternalStore, useMemo } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Wallet,
  FileText,
  ScrollText,
  ArrowUpRight,
  Plus,
  Search,
} from "lucide-react";
type Draft = {
  id: string;
  title: string;
  code: string;
  price: number;
  verification: "UNVERIFIED";
  publication: "DRAFT";
};
type Event = { id: string; action: string; time: string };
type State = {
  products: Draft[];
  pages: { id: string; title: string; body: string }[];
  policy: { delivery: string; threshold: string; returns: string };
  events: Event[];
};
const empty: State = {
  products: [],
  pages: [],
  policy: { delivery: "5", threshold: "60", returns: "14" },
  events: [],
};
function subscribe(fn: () => void) {
  window.addEventListener("storage", fn);
  window.addEventListener("bh-admin-change", fn);
  return () => {
    window.removeEventListener("storage", fn);
    window.removeEventListener("bh-admin-change", fn);
  };
}
function snapshot() {
  try {
    return localStorage.getItem("bh-admin-preview") ?? "";
  } catch {
    return "";
  }
}
function useDrafts() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  return useMemo(() => {
    if (!raw) return empty;
    try {
      const state = JSON.parse(raw) as State;
      if (
        !Array.isArray(state.products) ||
        !Array.isArray(state.pages) ||
        !Array.isArray(state.events) ||
        !state.policy
      )
        return empty;
      return {
        ...state,
        products: state.products.filter(
          (p) =>
            typeof p.title === "string" &&
            typeof p.code === "string" &&
            Number.isInteger(p.price) &&
            p.price >= 0 &&
            p.verification === "UNVERIFIED" &&
            p.publication === "DRAFT",
        ),
      };
    } catch {
      return empty;
    }
  }, [raw]);
}
const sections = [
  ["İcmal", LayoutDashboard],
  ["Məhsullar", Package],
  ["Sifarişlər", ShoppingBag],
  ["Müştərilər", Users],
  ["Bonus", Wallet],
  ["Məzmun", FileText],
  ["Qaydalar", FileText],
  ["Dəyişikliklər", ScrollText],
] as const;
export function AdminPreview() {
  const [tab, setTab] = useState("İcmal");
  const [role, setRole] = useState("admin");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const state = useDrafts();
  const canEdit = role === "admin" || role === "content";
  function save(next: State, action: string) {
    try {
      localStorage.setItem(
        "bh-admin-preview",
        JSON.stringify({
          ...next,
          events: [
            { id: crypto.randomUUID(), action, time: new Date().toISOString() },
            ...state.events,
          ].slice(0, 100),
        }),
      );
      window.dispatchEvent(new Event("bh-admin-change"));
      setNotice("Lokal qaralama saxlanıldı. Saytda dərc olunmayıb.");
    } catch {
      setNotice("Brauzerdə saxlamaq mümkün olmadı.");
    }
  }
  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="admin-brand">
          BREND HOUSE<small>İDARƏETMƏ</small>
        </div>
        <nav aria-label="İdarəetmə bölmələri">
          {sections.map(([name, Icon]) => (
            <button
              key={name}
              aria-current={tab === name ? "page" : undefined}
              onClick={() => {
                setTab(name);
                setNotice("");
              }}
            >
              <Icon size={18} />
              {name}
            </button>
          ))}
        </nav>
        <p>
          Frontend test görünüşü
          <br />
          Real məlumatlara giriş yoxdur
        </p>
      </aside>
      <main>
        <header className="admin-top">
          <p>İdarəetmə / {tab}</p>
          <label>
            Görünüş rolu
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="content">Kontent meneceri</option>
              <option value="support">Dəstək</option>
              <option value="store">Filial əməkdaşı</option>
            </select>
          </label>
        </header>
        <div className="admin-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">BREND HOUSE</p>
              <h1>{tab}</h1>
            </div>
            <span className="status-pill">Yalnız lokal qaralamalar</span>
          </div>
          <p className="preview-note">
            Rol seçimi yalnız UI yoxlamasıdır, təhlükəsizlik icazəsi deyil.
            Buradakı dəyişikliklər real mağazaya təsir etmir.
          </p>
          {notice && (
            <p role="status" className="save-notice">
              {notice}
            </p>
          )}
          {tab === "İcmal" ? (
            <>
              <div className="metric-grid">
                {["Satışlar", "Sifarişlər", "Orta səbət", "Bonus öhdəliyi"].map(
                  (title) => (
                    <section className="panel" key={title}>
                      <p>{title}</p>
                      <strong>—</strong>
                      <small>Canlı məlumat qoşulmayıb</small>
                    </section>
                  ),
                )}
              </div>
              <section className="panel">
                <h2>İşə davam et</h2>
                <div className="quick-actions">
                  <button onClick={() => setTab("Məhsullar")}>
                    <Package />
                    Məhsul qaralaması
                    <ArrowUpRight size={16} />
                  </button>
                  <button onClick={() => setTab("Məzmun")}>
                    <FileText />
                    Məzmun redaktəsi
                    <ArrowUpRight size={16} />
                  </button>
                  <button onClick={() => setTab("Qaydalar")}>
                    <ScrollText />
                    Mağaza qaydaları
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </section>
            </>
          ) : null}
          {tab === "Məhsullar" ? (
            <div className="editor-grid">
              <section className="panel">
                <h2>Məhsul qaralamaları</h2>
                <label className="search-label">
                  <Search size={16} />
                  <input
                    aria-label="Qaralamalarda axtar"
                    placeholder="Ad və ya kod"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Məhsul</th>
                        <th>Kod</th>
                        <th>Qiymət</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.products
                        .filter((p) =>
                          `${p.title} ${p.code}`
                            .toLocaleLowerCase("az")
                            .includes(query.toLocaleLowerCase("az")),
                        )
                        .map((p) => (
                          <tr key={p.id}>
                            <td>{p.title}</td>
                            <td>{p.code}</td>
                            <td>{(p.price / 100).toFixed(2)} ₼</td>
                            <td>Təsdiqlənməyib</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {!state.products.length && (
                  <p className="empty">Məhsul qaralaması yoxdur.</p>
                )}
              </section>
              <form
                className="panel editor"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!canEdit) return;
                  const form = e.currentTarget;
                  const data = new FormData(form);
                  const title = String(data.get("title")).trim(),
                    code = String(data.get("code")).trim(),
                    price = Number(data.get("price"));
                  if (
                    !title ||
                    !code ||
                    !Number.isFinite(price) ||
                    price < 0 ||
                    price > 1000000 ||
                    state.products.some((p) => p.code === code)
                  ) {
                    setNotice("Ad, unikal kod və düzgün qiymət daxil edin.");
                    return;
                  }
                  save(
                    {
                      ...state,
                      products: [
                        ...state.products,
                        {
                          id: crypto.randomUUID(),
                          title,
                          code,
                          price: Math.round(price * 100),
                          verification: "UNVERIFIED",
                          publication: "DRAFT",
                        },
                      ],
                    },
                    "Məhsul qaralaması yaradıldı",
                  );
                  form.reset();
                }}
              >
                <h2>Yeni məhsul</h2>
                <label>
                  Məhsul adı
                  <input name="title" required maxLength={160} />
                </label>
                <label>
                  Daxili kod
                  <input name="code" required maxLength={60} />
                </label>
                <label>
                  Qiymət (₼)
                  <input
                    name="price"
                    type="number"
                    min="0"
                    max="1000000"
                    step="0.01"
                    required
                  />
                </label>
                <p className="muted">
                  Qaralama təsdiqlənməmiş saxlanılır. Dərcetmə və real stok
                  əməliyyatları bağlıdır.
                </p>
                <button className="primary" disabled={!canEdit}>
                  <Plus size={16} />
                  Qaralamanı saxla
                </button>
              </form>
            </div>
          ) : null}
          {tab === "Məzmun" ? (
            <div className="editor-grid">
              <section className="panel">
                <h2>Səhifə qaralamaları</h2>
                {state.pages.length ? (
                  state.pages.map((p) => (
                    <article key={p.id}>
                      <h3>{p.title}</h3>
                      <p className="content-text">{p.body}</p>
                    </article>
                  ))
                ) : (
                  <p className="empty">Məzmun əlavə edilməyib.</p>
                )}
              </section>
              <form
                className="panel editor"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!canEdit) return;
                  const form = e.currentTarget;
                  const data = new FormData(form);
                  const title = String(data.get("title")).trim(),
                    body = String(data.get("body")).trim();
                  if (!title || !body) return;
                  save(
                    {
                      ...state,
                      pages: [
                        ...state.pages,
                        { id: crypto.randomUUID(), title, body },
                      ],
                    },
                    "Məzmun qaralaması yaradıldı",
                  );
                  form.reset();
                }}
              >
                <h2>Məzmun redaktoru</h2>
                <label>
                  Başlıq
                  <input name="title" required maxLength={160} />
                </label>
                <label>
                  Mətn
                  <textarea name="body" required maxLength={10000} />
                </label>
                <button className="primary" disabled={!canEdit}>
                  Qaralamanı saxla
                </button>
              </form>
            </div>
          ) : null}
          {tab === "Qaydalar" ? (
            <form
              className="panel editor policy-editor"
              onSubmit={(e) => {
                e.preventDefault();
                if (role !== "admin") return;
                const data = new FormData(e.currentTarget);
                save(
                  {
                    ...state,
                    policy: {
                      delivery: String(data.get("delivery")),
                      threshold: String(data.get("threshold")),
                      returns: String(data.get("returns")),
                    },
                  },
                  "Qayda qaralaması dəyişdirildi",
                );
              }}
            >
              <h2>Çatdırılma və qaytarma</h2>
              <p className="muted">
                Lokal sınaq üçündür. Checkout qaydaları dəyişmir; gələcəkdə
                təsdiqlənmiş PolicySet API-dən alınacaq.
              </p>
              <label>
                Bakı çatdırılması (₼)
                <input
                  name="delivery"
                  type="number"
                  min="0"
                  max="10000"
                  step="0.01"
                  required
                  defaultValue={state.policy.delivery}
                />
              </label>
              <label>
                Pulsuz çatdırılma həddi (₼)
                <input
                  name="threshold"
                  type="number"
                  min="0"
                  max="100000"
                  step="0.01"
                  required
                  defaultValue={state.policy.threshold}
                />
              </label>
              <label>
                Qaytarma müddəti (gün)
                <input
                  name="returns"
                  type="number"
                  min="0"
                  max="365"
                  step="1"
                  required
                  defaultValue={state.policy.returns}
                />
              </label>
              <button className="primary" disabled={role !== "admin"}>
                Qayda qaralamasını saxla
              </button>
            </form>
          ) : null}
          {tab === "Dəyişikliklər" ? (
            <section className="panel">
              <h2>Lokal dəyişiklik tarixçəsi</h2>
              <p className="muted">
                Brauzer test tarixçəsidir; server audit jurnalı deyil.
              </p>
              {state.events.length ? (
                <ul className="audit-list">
                  {state.events.map((event) => (
                    <li key={event.id}>
                      <span>{event.action}</span>
                      <time>
                        {new Date(event.time).toLocaleString("az-AZ", {
                          timeZone: "Asia/Baku",
                        })}
                      </time>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty">Dəyişiklik yoxdur.</p>
              )}
            </section>
          ) : null}
          {["Sifarişlər", "Müştərilər", "Bonus"].includes(tab) ? (
            <section className="panel empty-state">
              <ShoppingBag size={36} />
              <h2>{tab === "Bonus" ? "Bonus əməliyyatları" : tab}</h2>
              <p>Real məlumat mənbəyi qoşulmayıb.</p>
              <p className="muted">
                {tab === "Bonus"
                  ? "Balans dəyişiklikləri, qaytarmalar və kampaniyalar yalnız səlahiyyətli backend vasitəsilə işləyəcək."
                  : "Bu bölmədə uydurma şəxsi məlumatlar və əməliyyatlar göstərilmir."}
              </p>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
