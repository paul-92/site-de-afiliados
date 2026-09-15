"use client";

export default function AdminError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <section className="admin-safe-error" role="alert" aria-labelledby="admin-error-title"><span aria-hidden="true">!</span><div><p className="admin-kicker">Não foi possível concluir</p><h2 id="admin-error-title">A área administrativa encontrou um problema</h2><p>Nenhuma alteração foi confirmada. Tente carregar este conteúdo novamente.</p><button type="button" onClick={retry}>Tentar novamente</button></div></section>;
}
