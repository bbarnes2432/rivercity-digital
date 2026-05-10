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
        <p>We don&apos;t sell your information. We don&apos;t share it with third parties for marketing.</p>
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
          This site uses minimal first-party analytics to understand which pages are useful and how visitors arrive. We do not
          run third-party advertising trackers. If we add more granular analytics in the future, we&apos;ll show a consent banner
          before any tracking begins.
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
          We use a small set of third-party services to do our work: Google (Workspace, Search Console, Business Profile),
          Microsoft / Bing (Webmaster Tools), Meta (Business Manager, when running campaigns), AWS / Vercel / Resend (hosting,
          DNS, transactional email). Each has its own privacy policy. We share the minimum information required for the
          service to function.
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
      lastUpdated="May 9, 2026"
      sections={SECTIONS}
      breadcrumbLabel="Privacy Policy"
    />
  );
}
