"use client";

import { useEffect, useState, type CSSProperties, type KeyboardEvent } from "react";

/* Four systems on the left, one mock back-office window on the right.
 * Pointing at a system (or clicking, or pressing Enter on it) switches the
 * window to that system's screen. Until someone does, the window walks
 * through the four on its own. The window is decoration: the words that
 * matter are in the list, which stays fully readable at every state. */

export type SystemSpec = {
  screen: "crm" | "orders" | "products" | "portal";
  nav: string;
  problem: string;
  title: string;
  description: string;
};

const CYCLE_MS = 5200;

function Line({ w }: { w: string }) {
  return <span className="rcd-sys-line" style={{ "--w": w } as CSSProperties} />;
}

function CrmScreen() {
  const cols: [string, string[]][] = [
    ["New leads", ["72%", "58%", "66%"]],
    ["Quoted", ["64%", "48%"]],
    ["Won", ["70%", "54%"]],
  ];
  return (
    <>
      <div className="rcd-sys-h"><b>Pipeline</b><span>This week</span></div>
      <div className="rcd-sys-cols">
        {cols.map(([name, cards], c) => (
          <div key={name}>
            <span className="rcd-sys-colh">{name}<em>{cards.length}</em></span>
            {cards.map((w, i) => (
              <div className="rcd-sys-card" key={w + i}>
                <Line w={w} />
                <Line w="38%" />
                {c === 0 && i === 1 && <span className="rcd-sys-chip" data-warn="">Follow-up today</span>}
                {c === 2 && i === 0 && <span className="rcd-sys-chip">Deposit paid</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function OrdersScreen() {
  const steps = ["Quote approved", "Order created", "Payment received", "Fulfilled"];
  const rows: [string, string, boolean][] = [["#1042", "58%", true], ["#1043", "44%", false], ["#1044", "62%", true]];
  return (
    <>
      <div className="rcd-sys-h"><b>Order #1043</b><span>Updated just now</span></div>
      <div className="rcd-sys-steps">
        {steps.map((s, i) => <span key={s} data-done={i < 3 ? "" : undefined}>{s}</span>)}
      </div>
      {rows.map(([id, w, paid]) => (
        <div className="rcd-sys-row" key={id}>
          <b>{id}</b>
          <Line w={w} />
          <span className="rcd-sys-chip" data-warn={paid ? undefined : ""}>{paid ? "Paid" : "Pending"}</span>
        </div>
      ))}
    </>
  );
}

function ProductsScreen() {
  const rows: [string, string, string, boolean][] = [["62%", "$48", "82%", true], ["48%", "$120", "35%", true], ["70%", "$24", "12%", false], ["54%", "$310", "64%", true]];
  return (
    <>
      <div className="rcd-sys-h"><b>Catalog</b><span>4 of 128 products</span></div>
      <table className="rcd-sys-table">
        <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Live</th></tr></thead>
        <tbody>
          {rows.map(([w, price, stock, live], i) => (
            <tr key={i}>
              <td><Line w={w} /></td>
              <td>{price}</td>
              <td><span className="rcd-sys-stock"><i style={{ "--w": stock } as CSSProperties} /></span></td>
              <td><span className="rcd-sys-toggle" data-off={live ? undefined : ""} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function PortalScreen() {
  return (
    <>
      <div className="rcd-sys-h">
        <b>Customer portal</b>
        <span className="rcd-sys-views"><span data-on="">Customer view</span><span>Staff view</span></span>
      </div>
      <div className="rcd-sys-panes">
        <div className="rcd-sys-pane">
          <b>Files</b>
          {[["66%", "Uploaded"], ["52%", "Needs review"], ["60%", "Uploaded"]].map(([w, st], i) => (
            <div className="rcd-sys-file" key={i}><Line w={w} /><span className="rcd-sys-chip" data-warn={st === "Needs review" ? "" : undefined}>{st}</span></div>
          ))}
        </div>
        <div className="rcd-sys-pane">
          <b>Approvals</b>
          {["58%", "64%"].map((w, i) => (
            <div className="rcd-sys-file" key={i}><Line w={w} /><span className="rcd-sys-btn">Approve</span></div>
          ))}
          <div className="rcd-sys-file"><Line w="46%" /><span className="rcd-sys-chip">Approved</span></div>
        </div>
      </div>
    </>
  );
}

const SCREENS = { crm: CrmScreen, orders: OrdersScreen, products: ProductsScreen, portal: PortalScreen };

export default function SystemsDemo({ systems }: { systems: SystemSpec[] }) {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % systems.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [touched, systems.length]);

  const choose = (i: number) => {
    setTouched(true);
    setActive(i);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(i);
    }
  };

  const Screen = SCREENS[systems[active].screen];

  return (
    <div className="rcd-systems-demo fx-reveal">
      <div className="rcd-systems-list" role="list">
        {systems.map((s, i) => (
          <div
            key={s.title}
            role="listitem"
            tabIndex={0}
            className="rcd-systems-item"
            data-on={i === active ? "" : undefined}
            onClick={() => choose(i)}
            onPointerEnter={() => choose(i)}
            onFocus={() => choose(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span className="rcd-systems-problem">{s.problem}</span>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
          </div>
        ))}
      </div>

      <div className="rcd-systems-window" aria-hidden="true">
        <div className="rcd-sys-chrome"><i /><i /><i /><span>yourbusiness.com/admin</span></div>
        <div className="rcd-sys-body">
          <nav className="rcd-sys-side">
            <b>Your business</b>
            {systems.map((s, i) => <span key={s.nav} data-on={i === active ? "" : undefined}>{s.nav}</span>)}
            <span>Reports</span>
            <span>Settings</span>
          </nav>
          <div className="rcd-sys-main" key={active}>
            <Screen />
          </div>
        </div>
      </div>
    </div>
  );
}
