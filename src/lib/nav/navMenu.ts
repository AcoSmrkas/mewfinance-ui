export interface MenuItem {
  label: string;
  url: string;
  isExternal: boolean;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export const navMenu: MenuCategory[] = [
  {
    name: "DeFi & Trading dApps",
    items: [
      { label: "DEX", url: "https://dex.mewfinance.com/", isExternal: true },
      { label: "Trading", url: "https://trading.mewfinance.com/", isExternal: true },
      { label: "Bank", url: "https://bank.mewfinance.com/", isExternal: true },
      { label: "Lottery", url: "https://fun.mewfinance.com/", isExternal: true }
    ]
  },
  {
    name: "NFT / P2P Trade dApps",
    items: [
      { label: "NFT Mart", url: "https://mart.mewfinance.com/", isExternal: true },
      { label: "Phygital Store", url: "https://store.mewfinance.com/", isExternal: true },
      { label: "Payments", url: "https://payment.mewfinance.com/", isExternal: true }
    ]
  },
  {
    name: "Tools",
    items: [
      { label: "Lock", url: "https://lock.mewfinance.com/", isExternal: true },
      { label: "Fund", url: "https://fund.mewfinance.com/", isExternal: true },
      { label: "Pump", url: "https://mewpump.vercel.app/", isExternal: true },
      { label: "NFT Bridge", url: "https://bridge.mewfinance.com/", isExternal: true },
      { label: "Ergo Tool Box", url: "https://tools.mewfinance.com/", isExternal: true },
      { label: "Cardano Tool Box", url: "https://ctools.mewfinance.com/", isExternal: true }
    ]
  },
  {
    name: "Seasonal",
    items: [
      { label: "Ergosanta", url: "https://santa.mewfinance.com/", isExternal: true }
    ]
  }
];

// Helper to detect current app from hostname
export function getCurrentApp(): string {
  if (typeof window === 'undefined') return 'home';

  const hostname = window.location.hostname;

  // Main site
  if (hostname === 'mewfinance.com' || hostname === 'www.mewfinance.com' || hostname === 'localhost') {
    return 'home';
  }

  // Extract subdomain
  const subdomain = hostname.split('.')[0];

  // Map subdomains to app identifiers
  const subdomainMap: Record<string, string> = {
    'dex': 'dex',
    'trading': 'trading',
    'bank': 'bank',
    'fun': 'lottery',
    'mart': 'nft-mart',
    'store': 'phygital-store',
    'payment': 'payments',
    'lock': 'lock',
    'fund': 'fund',
    'bridge': 'nft-bridge',
    'tools': 'ergo-tool-box',
    'ctools': 'cardano-tool-box',
    'santa': 'ergosanta'
  };

  return subdomainMap[subdomain] || 'home';
}

// Helper to check if a menu item is the current page
export function isCurrentPage(url: string, isExternal: boolean): boolean {
  if (typeof window === 'undefined') return false;

  if (isExternal) {
    // For external links, check if current hostname matches the URL's hostname
    try {
      const urlObj = new URL(url);
      return window.location.hostname === urlObj.hostname;
    } catch {
      return false;
    }
  } else {
    // For internal links, check pathname
    return window.location.pathname === url ||
           (url === '/' && window.location.pathname === '') ||
           (window.location.pathname === '/' && url === '/');
  }
}
