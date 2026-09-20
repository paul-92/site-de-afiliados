/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export interface HeroBannerProps {
  badge?: string;
  title: string;
  lead: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export function HeroBanner({
  badge = "Curadoria Garimora",
  title,
  lead,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
  imageUrl = "/demo/garimora-curadoria.png",
  imageAlt = "Curadoria Garimora de produtos práticos e úteis",
}: HeroBannerProps) {
  return (
    <section className="hero-banner" aria-label="Destaque principal da Garimora">
      <div className="hero-banner-content">
        <span className="hero-banner-badge">{badge}</span>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        <div className="hero-banner-actions">
          <Link className="btn-primary" href={primaryCtaHref}>
            {primaryCtaText} <span aria-hidden="true">→</span>
          </Link>
          {secondaryCtaText && secondaryCtaHref ? (
            <Link className="btn-secondary" href={secondaryCtaHref}>
              {secondaryCtaText}
            </Link>
          ) : null}
        </div>
      </div>
      <div className="hero-banner-visual" aria-hidden="true">
        <img src={imageUrl} alt={imageAlt} width="420" height="315" loading="eager" />
      </div>
    </section>
  );
}

export interface CampaignBannerProps {
  tag?: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

export function CampaignBanner({
  tag = "Oportunidades em Destaque",
  title,
  description,
  ctaText,
  ctaHref,
}: CampaignBannerProps) {
  return (
    <aside className="campaign-banner" aria-label={title}>
      <div className="campaign-banner-content">
        <span className="campaign-banner-tag">{tag}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <Link className="btn-campaign" href={ctaHref}>
        {ctaText} <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}

export interface CategoryBannerProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function CategoryBanner({ eyebrow, title, description }: CategoryBannerProps) {
  return (
    <header className="category-banner">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
    </header>
  );
}
