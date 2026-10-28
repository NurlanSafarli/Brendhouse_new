import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Brend House',description:'Gözəl həyat, gözəl geyimlə başlayır!'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="az"><body>{children}</body></html>;}
