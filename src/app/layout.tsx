import { rootMetadata } from "@/seo/metadata";
import "./globals.css";

export const metadata = rootMetadata();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
