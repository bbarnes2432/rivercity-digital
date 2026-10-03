import styles from "./ChicagoStorySections.module.css";

/** An original UI illustration, not a client site, testimonial or working store. */
export default function FictionalMockupSite({ mobile = false }: { mobile?: boolean }) {
  return <div className={styles.conceptSite} data-mobile={mobile} role="img" aria-label={`Fictional Juniper Bakehouse ${mobile ? "mobile website" : "website mockup"}: a cream and berry-colored design with an illustrated celebration cake`}>
    <div className={styles.conceptPage} aria-hidden="true">
      <div className={styles.conceptNav}><strong>juniper<span>BAKEHOUSE</span></strong><span>Our cakes &nbsp; Our story</span><i>Say hello ↗</i></div>
      <div className={styles.conceptHero}>
        <div className={styles.conceptCopy}><span>MADE FOR YOUR MOMENT</span><strong>A little joy.<br />A slice to share.</strong><p>Thoughtfully made cakes for your very favorite people.</p><span className={styles.conceptButton}>Find your flavor ↗</span></div>
        <div className={styles.conceptArt}>
          <svg viewBox="0 0 240 250" fill="none" aria-hidden="true">
            <path d="M32 231V105a88 88 0 0 1 176 0v126" fill="#edc8bb" />
            <ellipse cx="121" cy="213" rx="100" ry="14" fill="#713347" opacity=".12" />
            <path d="M39 194h164l-13 12H52z" fill="#f8f1db" stroke="#804054" strokeWidth="2" />
            <path d="M58 112v73c0 19 126 19 126 0v-73" fill="#f8edda" stroke="#804054" strokeWidth="2" />
            <path d="M58 146c27 16 99 16 126 0v11c-30 17-98 17-126 0z" fill="#ba6d70" />
            <ellipse cx="121" cy="112" rx="63" ry="20" fill="#fff8e8" stroke="#804054" strokeWidth="2" />
            <path d="M58 115c8 3 4 17 12 18s7-12 14-10 0 25 11 26 7-21 15-20 9 9 16 10 5-9 14-10 3 14 12 13 4-19 13-20 11 5 19-7" stroke="#d9b19c" strokeWidth="4" />
            <path d="M119 99c-2-21 8-34 27-42-4 21-12 34-27 42zM118 100c-15-3-26-12-33-26 18-1 28 8 33 26z" fill="#55745b" />
            <circle cx="105" cy="103" r="11" fill="#8e3e56" /><circle cx="130" cy="104" r="10" fill="#ad5064" /><circle cx="120" cy="91" r="9" fill="#713347" />
            <path d="m190 52 3-10 3 10 10 3-10 3-3 10-3-10-10-3zM45 77l2-7 2 7 7 2-7 2-2 7-2-7-7-2z" fill="#804054" />
          </svg>
          <span>Good things,<br /><em>made by hand.</em></span>
        </div>
      </div>
      <div className={styles.conceptFooter}><span>Celebration cakes</span><span>Seasonal flavors</span><span>Made for sharing</span></div>
      {mobile && <div className={styles.conceptMobileExtra}><span>A CAKE THAT FEELS LIKE YOU</span><strong>Big day.<br />Little details.</strong><p>Your favorite flavors. Your kind of celebration.</p></div>}
    </div>
  </div>;
}
