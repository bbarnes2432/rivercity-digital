import type { Metadata } from "next";
import LegalPage from "../_components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How River City Digital Co. handles your information.",
  alternates: { canonical: "/privacy-policy" },
};

const SECTIONS = [
  {
    id: "what-we-collect",
    heading: "What we collect",
    body: (
      <>
        <p>
          We collect only what we need to do the work and stay in touch. That includes things you give us
          directly — your name, email, phone, and the messages you send through the contact form — and a
          small amount of automatic information our hosting provider records when you visit the site
          (browser type, IP, referrer, pages viewed). We don&apos;t collect more than this without telling you first.
        </p>
        <p>
          If you become a client, we collect business details required to do the work (Google Business Profile access,
          analytics access, ad-account access, and any business data you provide for content or strategy). We treat that
          information as confidential.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    heading: "How we use it",
    body: (
      <>
        <p>
          We use the information you give us to respond to inquiries, provide services, and improve the work we deliver.
          For prospective clients, that means we may follow up about a request, send a proposal, or share an audit summary.
          For active clients, we use business information solely to deliver agreed-upon services.
        </p>
        <p>
          We don&apos;t sell your information, and we don&apos;t hand your contact details to anyone else for their own
          marketing. One nuance worth stating plainly: the advertising tags described under{" "}
          <a href="#cookies-and-analytics">Cookies and analytics</a> do send limited technical data — page views, and the
          fact that a form was submitted — to Google and OpenAI so we can measure our own ads.
        </p>
      </>
    ),
  },
  {
    id: "how-we-store-it",
    heading: "How we store it",
    body: (
      <>
        <p>
          We use established hosting providers (Vercel, AWS) for site infrastructure, and standard tools (Google Workspace,
          encrypted password managers) for our internal records. Access to client information is limited to people doing the work.
        </p>
        <p>
          We retain inquiry records for up to 24 months. Active client data is retained for the duration of the engagement and
          a reasonable period thereafter for tax and legal purposes.
        </p>
      </>
    ),
  },
  {
    id: "cookies-and-analytics",
    heading: "Cookies and analytics",
    body: (
      <>
        <p>
          This site uses cookies and similar technologies for two purposes: to understand which pages are useful and how
          visitors arrive, and to measure our own advertising. That includes measurement tags from Google (Google Ads) and
          OpenAI (ChatGPT Ads). These record page views and form submissions so we can tell which ads actually produced an
          inquiry, and they may be used to show you our ads on other services.
        </p>
        <p>
          We don&apos;t currently show a cookie consent banner. You can opt out at any time using your browser&apos;s
          tracking-protection settings or an ad blocker, or through the ad-settings pages each provider maintains — both are
          linked from their own privacy policies. Blocking them changes nothing about how this site works.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    heading: "Your rights",
    body: (
      <>
        <p>
          You can ask us, at any time, to show you the information we have about you, correct it, or delete it. Email{" "}
          <a href="mailto:hello@rivercitydigitalco.com">hello@rivercitydigitalco.com</a>. We&apos;ll get back the same day in most cases,
          and we&apos;ll act on the request within 30 days.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    heading: "Third parties we work with",
    body: (
      <>
        <p>
          We use a small set of third-party services to do our work: Google (Workspace, Search Console, Business Profile,
          Google Ads), OpenAI (ChatGPT Ads measurement), Microsoft / Bing (Webmaster Tools), Meta (Business Manager, when
          running campaigns), AWS / Vercel / Resend (hosting, DNS, transactional email). Each has its own privacy policy.
          We share the minimum information required for the service to function.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: (
      <>
        <p>
          If we make material changes to this policy, we&apos;ll update the date above and post a brief note about what changed.
          Minor edits (typos, clarifications) don&apos;t reset that date.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <>
        <p>
          Privacy questions: <a href="mailto:hello@rivercitydigitalco.com">hello@rivercitydigitalco.com</a> · River City Digital Co.,
          St. Louis, Missouri.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      preface="We've kept this short and tried to write it like a person. If anything's unclear, just email us."
      lastUpdated="August 18, 2026"
      sections={SECTIONS}
      breadcrumbLabel="Privacy Policy"
    />
  );
}
