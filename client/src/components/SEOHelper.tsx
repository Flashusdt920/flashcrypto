import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  article?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
  };
}

const defaultSEO = {
  title: 'Flash USDT Software 2025 | Flash BTC Tool | Flash Crypto Platform - Bolt Flasher',
  description: 'Flash USDT software, flash BTC tool, flash ETH sender 2025. Professional flash crypto platform for instant USDT TRC20 ERC20 BEP20, Bitcoin, Ethereum transactions. Best crypto flasher, USDT generator, temporary crypto sender. Download premium flash cryptocurrency software.',
  keywords: 'flash usdt, flash usdt software, flash btc, flash btc tool, flash eth, flash ethereum, flash crypto, crypto flasher, usdt flasher, btc flasher, eth flasher, flash usdt 2025, flash bitcoin 2025, usdt generator, btc generator, fake usdt, fake btc, temporary crypto, flash loan, flash mint, flash swap, usdt trc20, usdt erc20, usdt bep20, flash transaction, flash transfer, instant crypto, bolt flasher, bolt crypto flasher, crypto flash software, cryptocurrency flasher, flash crypto tool, blockchain flash, flash wallet, crypto flash payment',
  image: 'https://boltflasher.live/og-image.png',
  type: 'website' as const
};

export function SEOHelper({ 
  title, 
  description, 
  keywords, 
  image, 
  type = 'website',
  article 
}: SEOProps) {
  const [location] = useLocation();
  
  useEffect(() => {
    // Update document title
    document.title = title || defaultSEO.title;
    
    // Update meta tags
    updateMetaTag('description', description || defaultSEO.description);
    updateMetaTag('keywords', keywords || defaultSEO.keywords);
    
    // Update Open Graph tags
    updateMetaProperty('og:title', title || defaultSEO.title);
    updateMetaProperty('og:description', description || defaultSEO.description);
    updateMetaProperty('og:image', image || defaultSEO.image);
    updateMetaProperty('og:type', type);
    updateMetaProperty('og:url', `https://boltflasher.live${location}`);
    
    // Update Twitter Card tags
    updateMetaTag('twitter:title', title || defaultSEO.title, 'name');
    updateMetaTag('twitter:description', description || defaultSEO.description, 'name');
    updateMetaTag('twitter:image', image || defaultSEO.image, 'name');
    
    // Update canonical URL
    updateCanonicalURL(`https://boltflasher.live${location}`);
    
    // Add article-specific meta tags if provided
    if (article && type === 'article') {
      if (article.author) updateMetaProperty('article:author', article.author);
      if (article.publishedTime) updateMetaProperty('article:published_time', article.publishedTime);
      if (article.modifiedTime) updateMetaProperty('article:modified_time', article.modifiedTime);
      if (article.tags) {
        article.tags.forEach(tag => {
          const tagMeta = document.createElement('meta');
          tagMeta.setAttribute('property', 'article:tag');
          tagMeta.setAttribute('content', tag);
          document.head.appendChild(tagMeta);
        });
      }
    }
    
    // Add JSON-LD structured data for the specific page
    addStructuredData();
    
  }, [title, description, keywords, image, type, location, article]);
  
  return null;
}

function updateMetaTag(name: string, content: string, attribute = 'name') {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateCanonicalURL(url: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function addStructuredData() {
  // Remove existing structured data script to avoid duplicates
  const existingScript = document.getElementById('page-structured-data');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Add new structured data based on current page
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'page-structured-data';
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": document.title,
    "description": document.querySelector('meta[name="description"]')?.getAttribute('content'),
    "url": window.location.href,
    "dateModified": new Date().toISOString(),
    "inLanguage": "en-US",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://boltflasher.live/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
  
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}