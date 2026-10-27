import { useState } from "react";
import Header from "../components/Header";
import "./Home.css";

function Home() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      subtitle: "Enter your profile information and body details.",
      description:
        "STYLEAI builds your unique fashion identity using your height, weight, waist, shoulder measurements, and body silhouette (Hourglass, Pear, Rectangle, Apple, or Inverted Triangle). This ensures every outfit creates a balanced and flattering shape.",
      icon: "",
      cta: "Create Your Profile →",
      route: "/profile",
      highlights: [
        "Accurate height, weight & body measurements",
        "Silhouette identification & fit guidance",
        "Visual 2D digital avatar representation"
      ],
      previewBadge: "Step 1 • Profile & Body",
      previewItems: ["Height & Weight", "Waist & Shoulder", "Body Type Analysis"]
    },
    {
      number: "02",
      title: "Set Your Preferences",
      subtitle: "Choose your preferred styles, colors, and fit preferences.",
      description:
        "Tell STYLEAI what aesthetics speak to you—Minimal, Streetwear, Elegant, Trendy, Casual, or Traditional. Choose your preferred silhouette fits and favourite colour palettes to personalize all outfit recommendations.",
      icon: "",
      cta: "Set Your Preferences →",
      route: "/preferences",
      highlights: [
        "Aesthetic styles (Minimal, Streetwear, Elegant...)",
        "Preferred clothing fit (Oversized, Tailored, Slim)",
        "Curated personal color palette"
      ],
      previewBadge: "Step 2 • Style Preferences",
      previewItems: ["Aesthetics Selection", "Fit Preferences", "Harmonious Colors"]
    },
    {
      number: "03",
      title: "Build Your Wardrobe",
      subtitle: "Upload and manage your clothes, footwear, and accessories.",
      description:
        "Digitize what you own! Add tops, bottoms, dresses, footwear, and accessories (watches, necklaces, earrings, sunglasses, handbags, belts). Add photos and colours so STYLEAI can curate combinations directly from your closet.",
      icon: "",
      cta: "Build Your Wardrobe →",
      route: "/wardrobe",
      highlights: [
        "Tops, bottoms, dresses & footwear collection",
        "Accessories category (Earrings, Watches, Bags...)",
        "Fast category filters & photo previews"
      ],
      previewBadge: "Step 3 • Digital Closet",
      previewItems: ["Clothing Items", "Footwear & Shoes", "Curated Accessories"]
    },
    {
      number: "04",
      title: "Generate Your Outfit",
      subtitle: "Curate a complete look using your wardrobe and chosen occasion.",
      description:
        "Pick an occasion—College, Casual Outing, Party, Date, Formal Work, or Wedding. STYLEAI selects coordinating tops, bottoms, shoes, and matching accessories from your wardrobe for a cohesive, balanced outfit.",
      icon: "",
      cta: "Generate Your Outfit →",
      route: "/outfit",
      highlights: [
        "Occasion-specific smart matching",
        "Top, bottom, footwear & accessory harmony",
        "Style tips tailored to your body and look"
      ],
      previewBadge: "Step 4 • AI Outfit Stylist",
      previewItems: ["Occasion Matcher", "Coordinated Pieces", "Matching Accessory"]
    },
    {
      number: "05",
      title: "Save Your Look",
      subtitle: "Save outfits you love and access them anytime in Saved Looks.",
      description:
        "Keep your favourite STYLEAI creations organized in one place. Every saved look includes item names, colours, photos, and accessories so you can revisit, review, and wear your best outfits anytime.",
      icon: "",
      cta: "View Saved Looks →",
      route: "/saved-outfits",
      highlights: [
        "Head-to-toe saved outfit cards",
        "Photos, item names, colours & accessories",
        "Easy look review and one-click deletion"
      ],
      previewBadge: "Step 5 • Saved Looks",
      previewItems: ["Saved Combinations", "Accessory Details", "Ready-to-Wear Looks"]
    }
  ];

  const features = [
    {
      icon: "",
      title: "Personalized Styling",
      description:
        "Get outfit recommendations based on your preferences, occasion, body silhouette, and wardrobe.",
      buttonText: "Try Styling →",
      route: "/outfit"
    },
    {
      icon: "",
      title: "Digital Wardrobe",
      description:
        "Add, filter, and manage your clothes, footwear, and accessories in your personal digital closet.",
      buttonText: "Open Wardrobe →",
      route: "/wardrobe"
    },
    {
      icon: "",
      title: "Body / Avatar",
      description:
        "Create your style profile and visualize your body measurements, silhouette, and fit details.",
      buttonText: "Create Avatar →",
      route: "/avatar"
    },
    {
      icon: "",
      title: "Save Your Looks",
      description:
        "Save outfits you love with item details and accessories to easily access and wear them later.",
      buttonText: "View Saved Looks →",
      route: "/saved-outfits"
    },
    {
      icon: "",
      title: "Accessory Matching",
      description:
        "STYLEAI selects watches, necklaces, earrings, and bags from your wardrobe to complete each look.",
      buttonText: "Add Accessories →",
      route: "/wardrobe"
    },
    {
      icon: "",
      title: "Occasion-Based Outfits",
      description:
        "Generate outfits for college, casual outings, parties, dates, formal occasions, and weddings.",
      buttonText: "Generate Outfit →",
      route: "/outfit"
    }
  ];

  return (
    <div className="home">
      <Header variant="home" logoRoute="/" sticky={true} />

      {/* HERO */}
      <main className="hero">
        <div className="hero-text">
          <p className="tagline">YOUR PERSONAL AI STYLIST</p>

          <h1>
            Dress for the
            <br />
            <span>you, you want to be.</span>
          </h1>

          <p className="description">
            Upload your clothes and accessories, tell us about your body and
            personal style, and let AI create complete outfits made specifically
            for you.
          </p>

          <div className="hero-actions">
            <button
              className="start-button"
              onClick={() => (window.location.href = "/profile")}
            >
              Create My Style Profile →
            </button>
            <button
              className="start-button-secondary"
              onClick={() => (window.location.href = "/outfit")}
            >
              Generate Outfit
            </button>
          </div>
        </div>

        <div className="hero-card">
          <div className="fashion-circle"></div>

          <div className="style-card">
            <p>AI STYLE MATCH</p>
            <h3>Your style, personalized.</h3>
            <span>Body • Preferences • Accessories</span>
          </div>
        </div>
      </main>

      {/* HOW IT WORKS (INTERACTIVE STEP-BY-STEP) */}
      <section id="how" className="how-it-works">
        <div className="section-header">
          <p className="section-tag">HOW IT WORKS</p>
          <h2>
            Your styling journey in <em>5 simple steps.</em>
          </h2>
          <p className="section-subtitle">
            Click on any step below to explore how STYLEAI turns your wardrobe into
            effortless, coordinated looks.
          </p>
        </div>

        {/* STEP SELECTOR TABS */}
        <div className="steps-nav">
          {steps.map((item, index) => (
            <button
              key={item.number}
              type="button"
              className={`step-tab ${activeStep === index ? "active" : ""}`}
              onClick={() => setActiveStep(index)}
            >
              <span className="step-tab-number">{item.number}</span>
              {item.icon && <span className="step-tab-icon">{item.icon}</span>}
              <span className="step-tab-title">{item.title}</span>
            </button>
          ))}
        </div>

        {/* ACTIVE STEP CARD */}
        <div className="step-card">
          <div className="step-card-content">
            <div className="step-badge">
              STEP {steps[activeStep].number} OF 05
            </div>

            <h3>{steps[activeStep].title}</h3>

            <p className="step-subtitle">
              {steps[activeStep].subtitle}
            </p>

            <p className="step-description">
              {steps[activeStep].description}
            </p>

            <div className="step-highlights">
              {steps[activeStep].highlights.map((highlight, idx) => (
                <div key={idx} className="highlight-item">
                  <span className="highlight-bullet">•</span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            <div className="step-actions">
              <button
                className="step-cta-button"
                onClick={() =>
                  (window.location.href = steps[activeStep].route)
                }
              >
                {steps[activeStep].cta}
              </button>

              <button
                className="step-next-button"
                onClick={() =>
                  setActiveStep((prev) => (prev + 1) % steps.length)
                }
              >
                {activeStep === steps.length - 1
                  ? "Back to Step 1 ↺"
                  : "Next Step →"}
              </button>
            </div>
          </div>

          <div className="step-visual">
            <div className="step-visual-card">
              <span className="visual-badge">
                {steps[activeStep].previewBadge}
              </span>
              {steps[activeStep].icon && (
                <div className="visual-icon">{steps[activeStep].icon}</div>
              )}
              <h4>{steps[activeStep].title}</h4>
              <ul className="visual-items">
                {steps[activeStep].previewItems.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
              <button
                className="visual-link-btn"
                onClick={() =>
                  (window.location.href = steps[activeStep].route)
                }
              >
                Open Feature →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* USEFUL FEATURES SECTION */}
      <section id="features" className="features">
        <div className="section-header">
          <p className="section-tag">CORE CAPABILITIES</p>
          <h2>
            Everything you need to <em>dress better.</em>
          </h2>
          <p className="section-subtitle">
            Every feature connects directly to your digital wardrobe, avatar, and
            AI stylist. Click any feature card below to get started.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature, idx) => (
            <div
              className="feature-card"
              key={idx}
              onClick={() => (window.location.href = feature.route)}
            >
              {feature.icon && <div className="feature-icon">{feature.icon}</div>}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <button
                className="feature-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = feature.route;
                }}
              >
                {feature.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            STYLE<span>AI</span>
          </div>
          <p>
            Personalized fashion styling powered by your wardrobe, body, and AI.
          </p>
          <div className="footer-links">
            <a href="/profile">Profile</a>
            <a href="/preferences">Preferences</a>
            <a href="/wardrobe">Wardrobe</a>
            <a href="/outfit">Outfit Generator</a>
            <a href="/saved-outfits">Saved Looks</a>
            <a href="/dashboard">Dashboard</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;