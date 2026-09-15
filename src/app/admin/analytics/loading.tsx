export default function AnalyticsLoading() {
  return <div className="admin-page admin-loading" role="status" aria-live="polite" aria-busy="true"><div><span className="skeleton skeleton-title"/><span className="skeleton skeleton-copy"/></div><div className="admin-kpi-grid"><span className="skeleton skeleton-kpi"/><span className="skeleton skeleton-kpi"/><span className="skeleton skeleton-kpi"/></div><span className="skeleton skeleton-chart"/><p>Carregando Analytics…</p></div>;
}
