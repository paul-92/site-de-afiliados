import Link from "next/link";
export default function NotFound() { return <section className="empty"><p className="eyebrow">Erro 404</p><h1>Este achado não está disponível</h1><p>O item pode não existir ou não estar apto para publicação.</p><Link className="button" href="/">Explorar a Garimora</Link></section>; }
