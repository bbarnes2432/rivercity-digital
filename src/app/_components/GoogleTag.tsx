import Script from "next/script";

// Google Ads tag (gtag.js). Loaded site-wide from the root layout.
export const GOOGLE_ADS_ID = "AW-18272669855";

/* GA4, if a property exists.
 *
 * There isn't one yet, which is why an audit of this account had no way to
 * check whether form submissions were still happening — Google Ads only counts
 * conversions, so "no conversions" and "no traffic reaching the form" look
 * identical from inside it. A G- property is the independent record.
 *
 * Left as an env var rather than a hard-coded ID so the property can be created
 * and switched on without a code change. Written as the full
 * process.env.NEXT_PUBLIC_* expression because Next only inlines the literal
 * form at build time — destructure it and it silently becomes undefined in the
 * browser bundle. */
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

export default function GoogleTag() {
  return (
    <>
      <Script
        id="gtag-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
          ${GA4_ID ? `gtag('config', '${GA4_ID}');` : ""}
        `}
      </Script>
    </>
  );
}
