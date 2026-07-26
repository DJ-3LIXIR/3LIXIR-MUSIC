import { useEffect } from "react";

const SITE = "https://3lixirmusic.com";

export interface SEOOptions {
  /** Page <title>. Keep under ~60 chars, lead with the target keyword. */
  title: string;
  /** Meta description. ~150-160 chars, keyword-rich and compelling. */
  description: string;
  /** Path (e.g. "/tools/vocal-remover") or full URL for the canonical/og:url. */
  canonical?: string;
  /** Absolute OG/Twitter image URL. */
  image?: string;
  /** Structured data object(s) injected as JSON-LD. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Set true to keep a page out of the index. */
  noindex?: boolean;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Dependency-free per-page SEO. Sets the document title, meta description,
 * canonical, Open Graph / Twitter tags, robots directive and optional JSON-LD.
 * Google renders client-side JS, so these are picked up for search.
 */
export function useSEO({ title, description, canonical, image, jsonLd, noindex }: SEOOptions) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";
  useEffect(() => {
    document.title = title;

    const url = canonical
      ? canonical.startsWith("http")
        ? canonical
        : SITE + canonical
      : SITE + window.location.pathname;

    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "robots", noindex ? "noindex,nofollow" : "index,follow");
    if (image) {
      upsertMeta("property", "og:image", image);
      upsertMeta("name", "twitter:image", image);
    }

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);

    const scriptId = "page-jsonld";
    const existing = document.getElementById(scriptId);
    if (jsonLdKey) {
      const script = (existing as HTMLScriptElement) || document.createElement("script");
      script.id = scriptId;
      (script as HTMLScriptElement).type = "application/ld+json";
      script.textContent = jsonLdKey;
      if (!existing) document.head.appendChild(script);
    } else if (existing) {
      existing.remove();
    }
  }, [title, description, canonical, image, jsonLdKey, noindex]);
}

/** Helper to build a SoftwareApplication schema for a free web tool. */
export function toolSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: url.startsWith("http") ? url : SITE + url,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "3LIXIR MUSIC", url: SITE },
  };
}
