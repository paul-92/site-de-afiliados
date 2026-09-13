"use client";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <section className="empty" role="alert"><h1>Algo saiu do lugar</h1><p>Não conseguimos carregar esta página. Nenhum detalhe técnico foi exposto.</p><button onClick={reset}>Tentar novamente</button></section>; }
