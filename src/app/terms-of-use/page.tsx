import type { Metadata } from "next";
import LegalPage from "../_components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for River City Digital Co.",
  alternates: { canonical: "/terms-of-use" },
};

const SECTIONS = [
  {
    id: "the-deal",
    heading: "The deal",
    body: (
      <>
        <p>
          By using rivercitydigitalco.com, you&apos;re agreeing to these terms. They&apos;re short. We&apos;ve tried to write them in plain
          English. If anything is unclear, just ask.
        </p>
      </>
    ),
  },
  {
    id: "what-the-site-is",
    heading: "What this site is",
    body: (
      <>
        <p>
          This is the marketing website for River City Digital Co., a digital marketing studio based in St. Louis, Missouri.
          It exists to describe our services, share our point of view, and let prospective clients reach us.
        </p>
        <p>
          Nothing on the site is legal, financial, or marketing advice tailored to your business until we&apos;ve agreed to work
          together. Anything that looks like advice is published as general guidance and shouldn&apos;t be acted on without a
          conversation about your specific situation.
        </p>
      </>
    ),
  },
  {
    id: "what-you-may-not-do",
    heading: "What you may not do here",
    body: (
      <>
        <p>
          Don&apos;t scrape the site, attempt to circumvent technical protections, send automated requests to overwhelm the site,
          or use it for anything illegal. Don&apos;t copy our writing or images and pass them off as your own. Beyond that, we
          don&apos;t care how you use the public pages.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    heading: "Intellectual property",
    body: (
      <>
        <p>
          All content on this site — design, copy, photography, illustrations, code — is owned by River City Digital Co.
          unless explicitly credited otherwise. You may share links and quote brief excerpts with attribution. For anything more,
          ask first.
        </p>
        <p>
          Quotes and case-study screenshots that include client names appear with the client&apos;s permission. If you&apos;re a client
          and want a quote or screenshot removed, email us and we&apos;ll handle it the same day.
        </p>
      </>
    ),
  },
  {
    id: "linking",
    heading: "Linking out",
    body: (
      <>
        <p>
          We sometimes link to other sites — partners, sources, tools we use. We don&apos;t control those sites and aren&apos;t
          responsible for their content or policies. Apply the same scrutiny to anything we link to that you would
          to anything else on the internet.
        </p>
      </>
    ),
  },
  {
    id: "warranty",
    heading: "No warranty",
    body: (
      <>
        <p>
          The site is provided as-is. We try to keep everything accurate, but we make no warranties about availability,
          accuracy, or fitness for any particular purpose. If you find a mistake, tell us — we&apos;ll fix it.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    body: (
      <>
        <p>
          To the extent allowed by law, River City Digital Co. is not liable for indirect, incidental, or consequential damages
          arising from use of this site. If a court rules we are liable for something, our total liability is capped at $100 USD
          or the amount you&apos;ve paid us in the last 12 months, whichever is greater.
        </p>
      </>
    ),
  },
  {
    id: "jurisdiction",
    heading: "Jurisdiction",
    body: (
      <>
        <p>
          These terms are governed by the laws of the State of Missouri. Any dispute arising from this site or our services
          will be heard in the state or federal courts located in the City of St. Louis.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    heading: "Changes",
    body: (
      <>
        <p>
          If we change these terms in a material way, we&apos;ll update the date above. Continuing to use the site after that means
          you accept the new terms.
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
          Questions: <a href="mailto:hello@rivercitydigitalco.com">hello@rivercitydigitalco.com</a> · River City Digital Co.,
          St. Louis, Missouri.
        </p>
      </>
    ),
  },
];

export default function TermsOfUsePage() {
  return (
    <LegalPage
      title="Terms of Use"
      preface="We've kept this short and tried to write it like a person. If anything's unclear, just email us."
      lastUpdated="May 9, 2026"
      sections={SECTIONS}
      breadcrumbLabel="Terms of Use"
    />
  );
}
