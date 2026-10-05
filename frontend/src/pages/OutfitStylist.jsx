import { useState } from "react";
import "./OutfitStylist.css";

function OutfitStylist() {
  const [occasion, setOccasion] = useState("");
  const [weather, setWeather] = useState("");
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!occasion || !weather || !style) {
      alert("Please select an occasion, weather and style.");
      return;
    }

    setLoading(true);

    // Get saved user information
    const profile = JSON.parse(
      localStorage.getItem("profile") || "{}"
    );

    const preferences = JSON.parse(
      localStorage.getItem("preferences") || "{}"
    );

    const wardrobe = JSON.parse(
      localStorage.getItem("wardrobe") || "[]"
    );

    // Complete request for FastAPI
    const outfitRequest = {
      occasion: occasion,
      weather: weather,
      style: style,
      profile: profile,
      preferences: preferences,
      wardrobe: wardrobe
    };

    const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

    try {
      const response = await fetch(
        `${apiBaseUrl}/recommend-outfit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(outfitRequest)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate outfit");
      }

      const data = await response.json();

      console.log("AI Outfit Response:", data);

      // Save complete request
      localStorage.setItem(
        "outfitRequest",
        JSON.stringify(outfitRequest)
      );

      // Save AI result
      localStorage.setItem(
        "outfitResult",
        JSON.stringify(data)
      );

      // Go to result page
      window.location.href = "/outfit-result";

    } catch (error) {
      console.error("Error:", error);

      alert(
        "Could not connect to the AI stylist. Please make sure FastAPI is running."
      );

      setLoading(false);
    }
  };

  return (
    <div className="stylist-page">

      {/* NAVBAR */}

      <nav className="stylist-navbar">

        <div
          className="stylist-logo"
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        >
          STYLEAI
        </div>

        <button
          className="back-button"
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        >
          ← Dashboard
        </button>

      </nav>


      {/* HEADER */}

      <section className="stylist-header">

        <p className="eyebrow">
          YOUR PERSONAL AI STYLIST
        </p>

        <h1>
          What are you <em>dressing for?</em>
        </h1>

        <p>
          Tell us a little about your day and we'll create
          a look that feels like you.
        </p>

      </section>


      {/* FORM */}

      <div className="stylist-form">

        {/* OCCASION */}

        <div className="stylist-section">

          <h2>01 — Occasion</h2>

          <div className="option-grid">

            <button
              className={`option-card ${
                occasion === "College" ? "selected" : ""
              }`}
              onClick={() => setOccasion("College")}
            >
              <span>🎓</span>
              College
            </button>

            <button
              className={`option-card ${
                occasion === "Casual" ? "selected" : ""
              }`}
              onClick={() => setOccasion("Casual")}
            >
              <span>☕</span>
              Casual
            </button>

            <button
              className={`option-card ${
                occasion === "Party" ? "selected" : ""
              }`}
              onClick={() => setOccasion("Party")}
            >
              <span>🎉</span>
              Party
            </button>

            <button
              className={`option-card ${
                occasion === "Date" ? "selected" : ""
              }`}
              onClick={() => setOccasion("Date")}
            >
              <span>❤️</span>
              Date
            </button>

            <button
              className={`option-card ${
                occasion === "Formal" ? "selected" : ""
              }`}
              onClick={() => setOccasion("Formal")}
            >
              <span>💼</span>
              Formal
            </button>

            <button
              className={`option-card ${
                occasion === "Wedding" ? "selected" : ""
              }`}
              onClick={() => setOccasion("Wedding")}
            >
              <span>✨</span>
              Wedding
            </button>

          </div>

        </div>


        {/* WEATHER */}

        <div className="stylist-section">

          <h2>02 — Weather</h2>

          <div className="option-grid">

            <button
              className={`option-card ${
                weather === "Hot" ? "selected" : ""
              }`}
              onClick={() => setWeather("Hot")}
            >
              ☀️ Hot
            </button>

            <button
              className={`option-card ${
                weather === "Warm" ? "selected" : ""
              }`}
              onClick={() => setWeather("Warm")}
            >
              🌤️ Warm
            </button>

            <button
              className={`option-card ${
                weather === "Cool" ? "selected" : ""
              }`}
              onClick={() => setWeather("Cool")}
            >
              🌥️ Cool
            </button>

            <button
              className={`option-card ${
                weather === "Cold" ? "selected" : ""
              }`}
              onClick={() => setWeather("Cold")}
            >
              ❄️ Cold
            </button>

          </div>

        </div>


        {/* STYLE */}

        <div className="stylist-section">

          <h2>03 — Your Style</h2>

          <div className="option-grid">

            <button
              className={`option-card ${
                style === "Minimal" ? "selected" : ""
              }`}
              onClick={() => setStyle("Minimal")}
            >
              Minimal
            </button>

            <button
              className={`option-card ${
                style === "Streetwear" ? "selected" : ""
              }`}
              onClick={() => setStyle("Streetwear")}
            >
              Streetwear
            </button>

            <button
              className={`option-card ${
                style === "Casual" ? "selected" : ""
              }`}
              onClick={() => setStyle("Casual")}
            >
              Casual
            </button>

            <button
              className={`option-card ${
                style === "Elegant" ? "selected" : ""
              }`}
              onClick={() => setStyle("Elegant")}
            >
              Elegant
            </button>

            <button
              className={`option-card ${
                style === "Trendy" ? "selected" : ""
              }`}
              onClick={() => setStyle("Trendy")}
            >
              Trendy
            </button>

            <button
              className={`option-card ${
                style === "Traditional" ? "selected" : ""
              }`}
              onClick={() => setStyle("Traditional")}
            >
              Traditional
            </button>

          </div>

        </div>


        {/* GENERATE BUTTON */}

        <button
          className="generate-button"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading
            ? "Creating Your Outfit..."
            : "Generate My Outfit →"}
        </button>

      </div>

    </div>
  );
}

export default OutfitStylist;