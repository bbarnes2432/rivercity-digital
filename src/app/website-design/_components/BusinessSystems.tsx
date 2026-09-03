import Container from "@/app/_components/Container";
import Section from "@/app/_components/Section";
import SectionHeader from "@/app/_components/SectionHeader";
import Button from "@/app/_components/Button";
import SystemsDemo, { type SystemSpec } from "./SystemsDemo";
import CostStack from "./CostStack";

/* Ask what they can build beyond a template.
 *
 * The argument is that a custom build can carry the systems behind the
 * website, not only the website. So the section shows one: a mock
 * back-office app on the right whose screen follows whichever of the four
 * systems is chosen on the left, then the software bill made visible as
 * thirty-six months lighting up under a counter, then the offer. */

const SYSTEMS: SystemSpec[] = [
  {
    screen: "crm",
    nav: "Customers",
    problem: "Customer details scattered across tools?",
    title: "A CRM built around your process.",
    description: "Bring contacts, quotes, follow-ups, and customer history into one system. Use the fields and sales stages your team actually needs, with fewer places to enter the same information.",
  },
  {
    screen: "orders",
    nav: "Orders",
    problem: "Manually moving orders from step to step?",
    title: "Connected orders and payments.",
    description: "Turn an approved quote into an order, connect your payment provider, and track fulfillment in one workflow. Build the rules around how you sell, deliver, and get paid.",
  },
  {
    screen: "products",
    nav: "Products",
    problem: "Updating products in several places?",
    title: "Product management that fits.",
    description: "Manage your catalog, pricing, stock, and availability from a custom dashboard. Connect it to your storefront and other tools so your team spends less time copying updates between systems.",
  },
  {
    screen: "portal",
    nav: "Portal",
    problem: "Chasing files, approvals, and status updates?",
    title: "Portals for customers and staff.",
    description: "Give people a place to upload files, approve work, check orders, or manage tasks. Build the screens, permissions, and automations around what each person needs to do.",
  },
];

export default function BusinessSystems() {
  return (
    <Section id="custom-systems" mode="civic-deep" className="rcd-systems">
      <Container>
        <SectionHeader
          className="fx-reveal"
          eyebrow="Before you hire a web design agency"
          title="Ask what they can build beyond a template."
          lede="If an agency only customizes WordPress themes or Wix templates, what happens when your business needs something those tools don't cover? You could end up buying more software and working around its limitations. We build the website and the custom systems behind it."
        />

        <div className="rcd-systems-intro fx-reveal">
          <h3>A platform built for the way you work.</h3>
          <div>
            <p>
              Imagine opening one system built specifically for your business.
              Every button has a purpose. Every form asks for information you need.
              Every feature supports a task your team actually does. You help define
              what belongs in it, and we build it around your workflow.
            </p>
            <p>
              If you&apos;re paying for overlapping tools or features you rarely use,
              a custom backend can replace several subscriptions and bring that work
              together. Your website can become the front door to the system that
              runs your day-to-day business.
            </p>
          </div>
        </div>

        <SystemsDemo systems={SYSTEMS} />

        <div className="rcd-systems-costs fx-reveal">
          <CostStack />
          <div className="rcd-systems-costcopy">
            <h3>Put your software budget toward a system built for you.</h3>
            <p>
              Separate CRM, order management, portal, and automation subscriptions
              add up month after month. Consolidating the tools you can replace
              into a custom system can reduce recurring costs and the manual work
              between them.
            </p>
            <p>
              We&apos;ll review what you pay for, what you actually use, and which
              tools a custom build could replace or connect. Then we&apos;ll compare
              the build and ongoing costs with your current setup, so you can see
              whether the investment makes sense.
            </p>
            <p className="rcd-systems-note">
              That comparison includes hosting, maintenance, third-party services,
              and payment processing fees where applicable.
            </p>
          </div>
        </div>

        <div className="rcd-systems-cta fx-reveal">
          <div>
            <p className="rcd-systems-label">One page or a complete platform</p>
            <h3>No project is too small.</h3>
            <p>
              Need a landing page? We can build it. Need a website connected to a
              complete business platform? We can build that too. Start with what
              you need today, and add capabilities as your business grows.
            </p>
          </div>
          <div className="rcd-systems-action">
            <Button href="/website-design#start" size="lg" arrow>Get my free website mockup</Button>
            <p>Tell us what you have in mind. No obligation to build.</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
