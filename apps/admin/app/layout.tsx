import "./globals.css";
export const metadata = {
  title: "İdarəetmə | Brend House",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body>{children}</body>
    </html>
  );
}
