import Script from "next/script";
import OpenAiPixelRouteEvents from "./OpenAiPixelRouteEvents";

// OpenAI Ads pixel (oaiq). Loaded site-wide from the root layout, mirroring
// GoogleTag and MetaPixel — same reasoning as the Meta pixel: audience seeding
// and retargeting need the whole site's traffic, not just the paid landing
// page a campaign happens to point at.
//
// Kept as a server component (like GoogleTag, unlike MetaPixel) so the snippet
// is inlined into the SSR HTML rather than injected after hydration. Route
// changes are handled by the small client child; see OpenAiPixelRouteEvents.
export const OPENAI_PIXEL_ID = "PMswnTTXUWrHKJWCkyX4RU";

export default function OpenAiPixel() {
  return (
    <>
      {/* Unlike fbq, oaiq("init") fires no page view of its own — the SDK sends
          only what you explicitly measure, so the vendor snippet on its own
          would record zero traffic. Hence the measure call right after init;
          it queues behind init and survives the SDK still loading. */}
      <Script id="openai-pixel-init" strategy="afterInteractive">
        {`
          !function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");
          oaiq("init",{pixelId:"${OPENAI_PIXEL_ID}",debug:true});
          oaiq("measure","page_viewed",{type:"contents",contents:[{id:location.pathname,name:document.title,content_type:"page"}]});
        `}
      </Script>
      <OpenAiPixelRouteEvents />
    </>
  );
}
