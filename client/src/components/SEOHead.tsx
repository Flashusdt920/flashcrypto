import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  twitterImage?: string;
  noIndex?: boolean;
}

const SEOHead = ({
  title = "Bolt Flasher - #1 Crypto Flash Software | BTC USDT ETH Flash Tool",
  description = "Best crypto flash software 2025. Flash BTC, USDT, Ethereum instantly. Professional flash transaction tool with 99.9% success rate. Trusted by 10,000+ users worldwide.",
  canonical,
  ogImage = "/og-image.png",
  twitterImage = "/twitter-image.png",
  noIndex = false
}: SEOHeadProps) => {
  const [location] = useLocation();

  const baseUrl = import.meta.env.PROD ? 'https://boltflasher.live' : 'http://localhost:5000';
  const fullCanonical = canonical || `${baseUrl}${location}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;
  const fullTwitterImage = twitterImage.startsWith('http') ? twitterImage : `${baseUrl}${twitterImage}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update link tags
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    // Basic meta tags
    updateMetaTag('description', description || "🚀 #1 Flash Crypto Platform 2025 | Flash USDT, BTC, ETH instantly | 10,000+ satisfied users | Enterprise security | Multi-chain support | Start free trial");
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description || "🚀 #1 Flash Crypto Platform 2025 | Flash USDT, BTC, ETH instantly | 10,000+ satisfied users | Enterprise security | Multi-chain support | Start free trial", true);
    updateMetaTag('og:url', fullCanonical, true);
    updateMetaTag('og:image', fullOgImage, true);

    // Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description || "🚀 #1 Flash Crypto Platform 2025 | Flash USDT, BTC, ETH instantly | 10,000+ satisfied users | Enterprise security | Multi-chain support | Start free trial");
    updateMetaTag('twitter:image', fullTwitterImage);

    // Canonical URL
    updateLinkTag('canonical', fullCanonical);

    // Track page view for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: title,
        page_location: fullCanonical,
        send_page_view: true
      });
    }
  }, [title, description, fullCanonical, fullOgImage, fullTwitterImage, noIndex]);

  return null;
};

export default SEOHead;