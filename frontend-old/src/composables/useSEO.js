export function useSEO() {
  const setPageTitle = (title) => {
    document.title = title;
  };

  const setMetaDescription = (description) => {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  };

  const setMetaKeywords = (keywords) => {
    let meta = document.querySelector('meta[name="keywords"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'keywords';
      document.head.appendChild(meta);
    }
    meta.content = keywords;
  };

  const setOGTags = (data) => {
    const ogTags = {
      'og:title': data.title,
      'og:description': data.description,
      'og:image': data.image,
      'og:url': data.url,
      'og:type': data.type || 'website',
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      if (content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.content = content;
      }
    });
  };

  const generateStructuredData = (type, data) => {
    const schemas = {
      organization: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name || 'SG Prime Enterprises',
        url: data.url || window.location.origin,
        logo: data.logo,
        description: data.description,
        contactPoint: data.contactPoint,
      },
      product: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        description: data.description,
        image: data.image,
        brand: {
          '@type': 'Brand',
          name: 'SG Prime Enterprises',
        },
        offers: data.offers,
      },
      breadcrumb: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.items,
      },
    };

    return schemas[type] || null;
  };

  const addStructuredData = (schema) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return script;
  };

  return {
    setPageTitle,
    setMetaDescription,
    setMetaKeywords,
    setOGTags,
    generateStructuredData,
    addStructuredData,
  };
}
