import { useEffect } from 'react';

const DEFAULT_TITLE = 'Trendify | Premium E-Commerce Store';
const DEFAULT_DESCRIPTION =
  'Discover premium electronics, apparel, and lifestyle essentials with fast delivery and seamless checkout on Trendify.';

/**
 * Custom hook to update document title and meta description tag on route changes.
 * Automatically restores previous/default meta tags when unmounted.
 */
export function usePageMeta(title?: string, description?: string): void {
  useEffect(() => {
    // 1. Determine and set document title
    const prevTitle = document.title;
    if (title) {
      document.title = title.includes('Trendify')
        ? title
        : `${title} | Trendify`;
    } else {
      document.title = DEFAULT_TITLE;
    }

    // 2. Determine and set meta description
    let metaTag = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;

    let created = false;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'description';
      document.head.appendChild(metaTag);
      created = true;
    }

    const prevDescription = metaTag.getAttribute('content') || DEFAULT_DESCRIPTION;
    metaTag.content = description || DEFAULT_DESCRIPTION;

    // 3. Cleanup on unmount
    return () => {
      document.title = prevTitle || DEFAULT_TITLE;
      if (metaTag) {
        if (created) {
          metaTag.remove();
        } else {
          metaTag.content = prevDescription;
        }
      }
    };
  }, [title, description]);
}
