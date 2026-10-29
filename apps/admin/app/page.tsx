import { AdminPreview } from "./preview";
export default function Page() {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.ENABLE_ADMIN_PREVIEW !== "true"
  )
    return (
      <main className="locked">
        <h1>İdarəetmə paneli</h1>
        <p>İdarəetmə xidməti aktiv deyil.</p>
      </main>
    );
  return <AdminPreview />;
}
