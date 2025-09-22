import "./globals.css";
export const metadata = { title:"Manufacturing Reports Starter", description:"Per-unit usage & material yield" };
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="ja"><body><div className="mx-auto max-w-6xl p-4">{children}</div></body></html>;
}
