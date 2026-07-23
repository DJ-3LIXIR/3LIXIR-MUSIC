// Google Analytics 4 event tracking for business metrics
// Events: plugin purchases, downloads, cart actions, video plays

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

// Business metrics
export const analytics = {
  // Add product to cart
  addToCart: (productName: string, price: number, category: string) => {
    trackEvent("add_to_cart", {
      item_name: productName,
      value: price,
      item_category: category,
    });
  },

  // Remove product from cart
  removeFromCart: (productName: string, price: number) => {
    trackEvent("remove_from_cart", {
      item_name: productName,
      value: price,
    });
  },

  // Begin checkout
  beginCheckout: (totalValue: number, itemCount: number) => {
    trackEvent("begin_checkout", {
      value: totalValue,
      items: itemCount,
    });
  },

  // Purchase / order completed
  purchase: (transactionId: string, totalValue: number, items: Array<{ name: string; price: number; category: string }>) => {
    trackEvent("purchase", {
      transaction_id: transactionId,
      value: totalValue,
      items: items.map((item) => ({
        item_name: item.name,
        item_category: item.category,
        price: item.price,
      })),
    });
  },

  // Plugin download (free or licensed)
  pluginDownload: (pluginName: string, licenseType: string) => {
    trackEvent("plugin_download", {
      plugin_name: pluginName,
      license_type: licenseType,
    });
  },

  // Video view (demo videos)
  videoPlay: (videoTitle: string, pluginName?: string) => {
    trackEvent("video_play", {
      video_title: videoTitle,
      plugin_name: pluginName || "general",
    });
  },

  // Page view (custom)
  pageView: (pageName: string, pageSection?: string) => {
    trackEvent("page_view", {
      page_name: pageName,
      section: pageSection,
    });
  },

  // Search / filter action
  search: (searchTerm: string, category?: string) => {
    trackEvent("search", {
      search_term: searchTerm,
      category: category,
    });
  },

  // Bundle purchase
  bundlePurchase: (bundleName: string, bundlePrice: number, pluginsIncluded: string[]) => {
    trackEvent("bundle_purchase", {
      bundle_name: bundleName,
      bundle_price: bundlePrice,
      plugins_included: pluginsIncluded.join(","),
    });
  },
};
