import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = { title: "Garimora — catálogo", description: "Curadoria de produtos úteis." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><header><Link href="/">Garimora</Link><nav><Link href="/categoria/organizacao">Categorias</Link><Link href="/admin">Admin</Link></nav></header><main>{children}</main></body></html>;
}
