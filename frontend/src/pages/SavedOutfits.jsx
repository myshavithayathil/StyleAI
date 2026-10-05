import { useState } from "react";
import "./SavedOutfits.css";

function SavedOutfits() {
  const [savedOutfits, setSavedOutfits] = useState(
    JSON.parse(localStorage.getItem("savedOutfits") || "[]")
  );

  const deleteOutfit = (id) => {
    const updated = savedOutfits.filter(
      (outfit) => outfit.id !== id
    );

    setSavedOutfits(updated);

    localStorage.setItem(
      "savedOutfits",
      JSON.stringify(updated)
    );
  };

  const viewOutfit = (outfit) => {
    localStorage.setItem(
      "selectedSavedOutfit",
      JSON.stringify(outfit)
    );

    window.location.href = "/outfit-result";
  };

  return (
    <div className="saved-page">

      {/* NAVBAR */}

      <nav className="saved-navbar">

        <div
          className="saved-logo"
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        >
          STYLE<span>AI</span>
        </div>

        <button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        >
          ← Dashboard
        </button>

      </nav>


      {/* HEADER */}

      <section className="saved-header">

        <p>YOUR STYLE COLLECTION</p>

        <h1>
          Saved <em>Looks.</em>
        </h1>

        <p>
          Your favourite STYLEAI recommendations,
          saved in one place.
        </p>

      </section>


      {/* SAVED OUTFITS */}

      <main className="saved-container">

        {savedOutfits.length === 0 ? (

          <div className="empty-saved">

            <div className="empty-icon">
              ♡
            </div>

            <h2>
              No saved outfits yet.
            </h2>

            <p>
              Generate an outfit and save your
              favourite looks here.
            </p>

            <button
              onClick={() => {
                window.location.href =
                  "/outfit-stylist";
              }}
            >
              Create Your First Look →
            </button>

          </div>

        ) : (

          <div className="saved-grid">

            {savedOutfits.map((outfit) => (

              <div
                className="saved-card"
                key={outfit.id}
              >

                {/* CARD TOP */}

                <div className="saved-card-top">

                  <span>
                    {outfit.occasion}
                  </span>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteOutfit(outfit.id)
                    }
                  >
                    ×
                  </button>

                </div>


                {/* SUMMARY */}

                <div className="saved-summary">

                  {outfit.weather && (
                    <span>
                      🌤️ {outfit.weather}
                    </span>
                  )}

                  {outfit.style && (
                    <span>
                      ✨ {outfit.style}
                    </span>
                  )}

                </div>


                {/* IMAGE PREVIEW */}

                <div className="saved-images">

                  {outfit.top?.image && (
                    <div className="saved-image">
                      <img
                        src={outfit.top.image}
                        alt={outfit.top.name || "Top"}
                      />
                    </div>
                  )}

                  {outfit.bottom?.image && (
                    <div className="saved-image">
                      <img
                        src={outfit.bottom.image}
                        alt={outfit.bottom.name || "Bottom"}
                      />
                    </div>
                  )}

                  {outfit.dress?.image && (
                    <div className="saved-image">
                      <img
                        src={outfit.dress.image}
                        alt={outfit.dress.name || "Dress"}
                      />
                    </div>
                  )}

                  {(outfit.footwear?.image || outfit.shoes?.image) && (
                    <div className="saved-image">
                      <img
                        src={outfit.footwear?.image || outfit.shoes?.image}
                        alt={outfit.footwear?.name || outfit.shoes?.name || "Footwear"}
                      />
                    </div>
                  )}

                  {outfit.accessory?.image && (
                    <div className="saved-image">
                      <img
                        src={outfit.accessory.image}
                        alt={outfit.accessory.name || "Accessory"}
                      />
                    </div>
                  )}

                </div>


                {/* TOP */}

                {outfit.top && (
                  <div className="saved-item">

                    <strong>👕 TOP</strong>

                    <p>
                      {typeof outfit.top === "string"
                        ? outfit.top
                        : outfit.top.name}
                    </p>

                    {outfit.top?.color && (
                      <small>
                        {outfit.top.color}
                      </small>
                    )}

                  </div>
                )}


                {/* BOTTOM */}

                {outfit.bottom && (
                  <div className="saved-item">

                    <strong>👖 BOTTOM</strong>

                    <p>
                      {typeof outfit.bottom === "string"
                        ? outfit.bottom
                        : outfit.bottom.name}
                    </p>

                    {outfit.bottom?.color && (
                      <small>
                        {outfit.bottom.color}
                      </small>
                    )}

                  </div>
                )}


                {/* DRESS */}

                {outfit.dress && (
                  <div className="saved-item">

                    <strong>👗 DRESS</strong>

                    <p>
                      {typeof outfit.dress === "string"
                        ? outfit.dress
                        : outfit.dress.name}
                    </p>

                    {outfit.dress?.color && (
                      <small>
                        {outfit.dress.color}
                      </small>
                    )}

                  </div>
                )}


                {/* FOOTWEAR */}

                {(outfit.footwear || outfit.shoes) && (
                  <div className="saved-item">

                    <strong>👟 FOOTWEAR</strong>

                    <p>
                      {typeof (outfit.footwear || outfit.shoes) === "string"
                        ? (outfit.footwear || outfit.shoes)
                        : (outfit.footwear?.name || outfit.shoes?.name)}
                    </p>

                    {(outfit.footwear?.color || outfit.shoes?.color) && (
                      <small>
                        {outfit.footwear?.color || outfit.shoes?.color}
                      </small>
                    )}

                  </div>
                )}


                {/* ACCESSORY */}

                {outfit.accessory && (
                  <div className="saved-item">

                    <strong>✨ ACCESSORY</strong>

                    <p>
                      {typeof outfit.accessory === "string"
                        ? outfit.accessory
                        : outfit.accessory.name || "Accessory"}
                    </p>

                    {outfit.accessory?.color && (
                      <small>
                        {outfit.accessory.color}
                      </small>
                    )}

                  </div>
                )}


                {/* VIEW BUTTON */}

                <button
                  className="wear-button"
                  onClick={() =>
                    viewOutfit(outfit)
                  }
                >
                  View Look →
                </button>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default SavedOutfits;