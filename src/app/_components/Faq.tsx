type Item = { q: string; a: string };

type Props = {
  items: Item[];
  className?: string;
};

export default function Faq({ items, className }: Props) {
  return (
    <div className={`rcd-faq${className ? " " + className : ""}`}>
      {items.map((item, i) => (
        <details className="rcd-faq-item" key={i}>
          <summary>
            <span className="rcd-faq-q">{item.q}</span>
            <span className="rcd-faq-icon" aria-hidden="true" />
          </summary>
          <div className="rcd-faq-a"><p>{item.a}</p></div>
        </details>
      ))}
    </div>
  );
}
