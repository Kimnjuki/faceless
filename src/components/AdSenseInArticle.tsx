import AdSense from './AdSense';

/**
 * In-Article AdSense Component
 * Optimized for placement within article content
 * 
 * Usage:
 * <AdSenseInArticle />
 */
export default function AdSenseInArticle() {
  return (
    <div className="my-8 flex justify-center">
      <AdSense
        format="in-article"
        fullWidthResponsive
        className="max-w-full"
        name="in-article-ad"
      />
    </div>
  );
}




