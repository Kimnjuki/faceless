import AdSense from './AdSense';

interface AdSenseDisplayProps {
  /**
   * Ad size
   * Common sizes: '728x90' (leaderboard), '300x250' (medium rectangle), '320x100' (mobile banner)
   */
  size?: '728x90' | '300x250' | '320x100' | '970x250' | '336x280';
  
  /**
   * Ad slot ID (optional, for specific ad units)
   */
  adSlot?: string;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Display AdSense Component
 * For standard display ads (banner, rectangle, etc.)
 * 
 * Usage:
 * <AdSenseDisplay size="728x90" />
 * <AdSenseDisplay size="300x250" />
 */
export default function AdSenseDisplay({
  size = '300x250',
  adSlot,
  className = ''
}: AdSenseDisplayProps) {
  return (
    <div className={`flex justify-center my-4 ${className}`}>
      <AdSense
        format="display"
        adSize={size}
        adSlot={adSlot}
        fullWidthResponsive={false}
        name={`display-ad-${size}`}
      />
    </div>
  );
}


