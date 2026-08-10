import Image from "next/image";
import Link from "next/link";
import CallLink from "./CallLink";
import { EMAIL, PHONE } from "../_data";

/* Header and footer for the landing page.
 *
 * Neither carries site navigation. Every outbound link on a paid landing page
 * is a way for traffic we're paying for to leave without converting, so the
 * only things here are the two conversion paths and the legal links ad
 * platforms expect a lead-capture page to have.
 *
 * The lockup is the river variant: the Quad Cities straddle the Mississippi —
 * Davenport and Bettendorf on the Iowa side, Rock Island and Moline on the
 * Illinois side — and a Missouri outline reads as out-of-town while an Iowa one
 * would visibly exclude half the metro. The river is simply true in both. */

export function QcHeader() {
  return (
    <header className="qc-header">
      <div className="qc-container qc-header-inner">
        <Image
          src="/assets/qc-logo-river.svg"
          alt="River City Digital Co."
          width={214}
          height={35}
          preload
          className="qc-header-logo"
        />

        <CallLink context="header" className="qc-header-call">
          <span className="qc-header-call-full">{PHONE.display}</span>
          <span className="qc-header-call-short">Call</span>
        </CallLink>
      </div>
    </header>
  );
}

export function QcFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="qc-footer">
      <div className="qc-container qc-footer-inner">
        <Image
          src="/assets/qc-logo-river.svg"
          alt="River City Digital Co."
          width={186}
          height={30}
          loading="lazy"
        />

        <p className="qc-footer-meta">
          Serving the Quad Cities — Davenport, Bettendorf, Rock Island and Moline.
          <br />
          Studio in St. Louis, Missouri.
        </p>

        <div className="qc-footer-links">
          <CallLink context="footer" className="qc-footer-link" />
          <a href={`mailto:${EMAIL}`} className="qc-footer-link">
            {EMAIL}
          </a>
        </div>

        <div className="qc-footer-bottom">
          <p>© {year} River City Digital Co.</p>
          <ul>
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms-of-use">Terms of Use</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
