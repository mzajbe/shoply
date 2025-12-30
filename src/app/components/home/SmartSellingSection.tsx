"use client";

const cards = [
  {
    title: "World’s best checkout",
    desc: "Fast, flexible, and optimized to convert more visitors into customers.",
    img: "https://shorturl.at/Cxqom",
  },
  {
    title: "Built-in AI tools",
    desc: "Create content, products, and campaigns faster with built-in AI.",
    img: "https://shorturl.at/Icz2J",
  },
  {
    title: "Fast & reliable hosting",
    desc: "99.9% uptime with global infrastructure for your store.",
    img: "https://shorturl.at/rZGME",
  },
];

export default function SmartSellingSection() {
  return (
    <section className="selling-section">
      {/* TOP SLIDER stays same */}

      <div className="container">
        <h2 className="title">Smarter selling starts here</h2>
        <p className="subtitle">
          Everything you need to sell, scale, and grow.
        </p>

        <div className="card-grid">
          {cards.map((card, i) => (
            <div key={i} className="card">
              <div className="card-image">
                <img src={card.img} alt={card.title} />
              </div>

              <div className="card-content">
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
