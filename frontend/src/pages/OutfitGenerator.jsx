import { useState } from "react";
import "./OutfitGenerator.css";

function OutfitGenerator() {
  const [occasion, setOccasion] = useState("College");
  const [outfit, setOutfit] = useState(null);

  const getWardrobe = () => {
    try {
      const saved =
        localStorage.getItem("wardrobe") ||
        localStorage.getItem("wardrobeItems") ||
        "[]";

      const data = JSON.parse(saved);

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Wardrobe error:", error);
      return [];
    }
  };

  const generateOutfit = () => {
    const wardrobe = getWardrobe();

    console.log("STYLEAI WARDROBE:", wardrobe);

    if (wardrobe.length === 0) {
      alert("Add some clothes to your wardrobe first.");
      return;
    }

    const normalize = (value) =>
      String(value || "").trim().toLowerCase();

    const tops = wardrobe.filter((item) => {
      const category = normalize(item.category);

      return (
        category === "top" ||
        category === "tops" ||
        category === "t-shirt" ||
        category === "shirt"
      );
    });

    const bottoms = wardrobe.filter((item) => {
      const category = normalize(item.category);

      return (
        category === "bottom" ||
        category === "bottoms" ||
        category === "jeans" ||
        category === "pants" ||
        category === "trousers"
      );
    });

    const dresses = wardrobe.filter((item) => {
      const category = normalize(item.category);

      return (
        category === "dress" ||
        category === "dresses"
      );
    });

    const footwear = wardrobe.filter((item) => {
      const category = normalize(item.category);

      return (
        category === "footwear" ||
        category === "shoes" ||
        category === "shoe"
      );
    });

    const accessories = wardrobe.filter((item) => {
      const category = normalize(item.category);
      const type = normalize(item.type);
      const name = normalize(item.name);

      return (
        category === "accessory" ||
        category === "accessories" ||
        [
          "earring",
          "necklace",
          "bracelet",
          "watch",
          "sunglass",
          "handbag",
          "bag",
          "belt",
          "scarf",
          "ring",
          "hair"
        ].some((k) => type.includes(k) || name.includes(k))
      );
    });

    console.log("TOPS:", tops);
    console.log("BOTTOMS:", bottoms);
    console.log("DRESSES:", dresses);
    console.log("FOOTWEAR:", footwear);
    console.log("ACCESSORIES:", accessories);

    const preferences = JSON.parse(
      localStorage.getItem("preferences") || "{}"
    );

    const preferredColors = Array.isArray(preferences.colors)
      ? preferences.colors.map((color) =>
          normalize(color)
        )
      : [];

    let selectedTop = null;
    let selectedBottom = null;
    let selectedDress = null;
    let selectedFootwear = null;
    let selectedAccessory = null;

    /* TOP */

    if (tops.length > 0) {
      selectedTop =
        tops.find((item) =>
          preferredColors.includes(
            normalize(item.color)
          )
        ) || tops[0];
    }

    /* BOTTOM */

    if (bottoms.length > 0) {
      selectedBottom = bottoms[0];
    }

    /* DRESS */

    if (
      dresses.length > 0 &&
      occasion === "Wedding"
    ) {
      selectedDress = dresses[0];
    }

    /* FOOTWEAR */

    if (footwear.length > 0) {
      selectedFootwear = footwear[0];
    }

    /* ACCESSORY — RULE-BASED MATCHING */

    if (accessories.length > 0) {
      const occasionLower = normalize(occasion);

      let preferredTypes = [];
      let bonusKeywords = [];

      if (occasionLower.includes("college") || occasionLower.includes("casual")) {
        // College / Casual: Watch, Sunglasses, Bracelet, Simple handbag, Minimal necklace
        preferredTypes = ["watch", "sunglass", "bracelet", "handbag", "bag", "necklace"];
        bonusKeywords = ["minimal", "simple", "casual", "leather"];
      } else if (occasionLower.includes("party")) {
        // Party: Statement earrings, Necklace, Bracelet, Handbag
        preferredTypes = ["earring", "necklace", "bracelet", "handbag", "clutch"];
        bonusKeywords = ["statement", "sparkle", "glam", "gold", "silver", "party", "drop"];
      } else if (occasionLower.includes("date")) {
        // Date: Necklace, Earrings, Bracelet, Handbag
        preferredTypes = ["necklace", "earring", "bracelet", "handbag", "clutch"];
        bonusKeywords = ["delicate", "pearl", "gold", "heart", "subtle", "elegant"];
      } else if (occasionLower.includes("work") || occasionLower.includes("formal")) {
        // Work / Formal: Watch, Minimal earrings, Simple necklace, Structured handbag
        preferredTypes = ["watch", "earring", "necklace", "handbag", "belt"];
        bonusKeywords = ["minimal", "structured", "classic", "formal", "simple", "stud"];
      } else if (occasionLower.includes("wedding")) {
        // Wedding: Traditional accessories, Earrings, Necklace, Bracelet
        preferredTypes = ["traditional", "ethnic", "earring", "necklace", "bracelet", "ring", "hair"];
        bonusKeywords = ["traditional", "ethnic", "heavy", "statement", "gold", "kundan", "pearl", "royal", "wedding"];
      } else {
        preferredTypes = ["watch", "necklace", "earring", "bracelet", "sunglass", "handbag"];
      }

      let bestScore = -1;
      let matchedAcc = accessories[0]; // fallback if no specific match

      for (const acc of accessories) {
        let score = 0;
        const text = `${normalize(acc.type)} ${normalize(acc.name)}`;
        const color = normalize(acc.color);

        preferredTypes.forEach((pref, idx) => {
          if (text.includes(pref)) {
            score += (preferredTypes.length - idx) * 10;
          }
        });

        bonusKeywords.forEach((bonus) => {
          if (text.includes(bonus)) {
            score += 8;
          }
        });

        if (color && preferredColors.length > 0) {
          if (preferredColors.some((pc) => color.includes(pc) || pc.includes(color))) {
            score += 5;
          }
        }

        if (score > bestScore) {
          bestScore = score;
          matchedAcc = acc;
        }
      }

      selectedAccessory = matchedAcc;
    } else {
      selectedAccessory = null;
    }

    if (
      !selectedTop &&
      !selectedBottom &&
      !selectedDress
    ) {
      alert(
        "Your wardrobe items could not be recognized. Please check their categories."
      );

      return;
    }

    const generatedOutfit = {
      top: selectedTop,
      bottom: selectedBottom,
      dress: selectedDress,
      footwear: selectedFootwear,
      accessory: selectedAccessory
    };

    setOutfit(generatedOutfit);

    localStorage.setItem(
      "generatedWardrobeOutfit",
      JSON.stringify(generatedOutfit)
    );

    localStorage.setItem(
      "outfitRequest",
      JSON.stringify({
        occasion: occasion
      })
    );

    // Also populate outfitResult for Outfit Result page
    localStorage.setItem(
      "outfitResult",
      JSON.stringify({
        success: true,
        request: {
          occasion: occasion
        },
        outfit: {
          top: selectedTop ? selectedTop.name : "",
          bottom: selectedBottom ? selectedBottom.name : "",
          shoes: selectedFootwear ? selectedFootwear.name : "",
          dress: selectedDress ? selectedDress.name : "",
          accessory: selectedAccessory
            ? {
                name: selectedAccessory.name,
                color: selectedAccessory.color || "",
                image: selectedAccessory.image || ""
              }
            : null
        },
        personalization: {
          wardrobe_items: wardrobe.length
        }
      })
    );
  };


  /* SAVE OUTFIT */

  const saveOutfit = () => {
    if (!outfit) {
      alert("Generate an outfit first.");
      return;
    }

    const savedOutfits = JSON.parse(
      localStorage.getItem("savedOutfits") || "[]"
    );

    const newOutfit = {
      id: Date.now(),

      top: outfit.top
        ? {
            name: outfit.top.name,
            color: outfit.top.color || "",
            image: outfit.top.image || ""
          }
        : null,

      bottom: outfit.bottom
        ? {
            name: outfit.bottom.name,
            color: outfit.bottom.color || "",
            image: outfit.bottom.image || ""
          }
        : null,

      dress: outfit.dress
        ? {
            name: outfit.dress.name,
            color: outfit.dress.color || "",
            image: outfit.dress.image || ""
          }
        : null,

      footwear: outfit.footwear
        ? {
            name: outfit.footwear.name,
            color: outfit.footwear.color || "",
            image: outfit.footwear.image || ""
          }
        : null,

      accessory: outfit.accessory
        ? {
            name: outfit.accessory.name,
            color: outfit.accessory.color || "",
            image: outfit.accessory.image || ""
          }
        : null,

      occasion: occasion,

      savedAt: new Date().toISOString()
    };

    const alreadySaved = savedOutfits.some(
      (item) =>
        item.top?.name === newOutfit.top?.name &&
        item.bottom?.name === newOutfit.bottom?.name &&
        item.footwear?.name === newOutfit.footwear?.name &&
        item.dress?.name === newOutfit.dress?.name &&
        item.accessory?.name === newOutfit.accessory?.name &&
        item.occasion === newOutfit.occasion
    );

    if (alreadySaved) {
      alert("This outfit is already saved.");
      return;
    }

    savedOutfits.push(newOutfit);

    localStorage.setItem(
      "savedOutfits",
      JSON.stringify(savedOutfits)
    );

    alert("Outfit saved successfully! ❤️");
  };


  return (
    <div className="outfit-page">

      {/* NAVBAR */}

      <nav className="outfit-nav">

        <div
          className="outfit-logo"
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


      <main className="outfit-container">

        {/* INTRO */}

        <section className="outfit-intro">

          <p className="outfit-tag">
            YOUR AI STYLIST
          </p>

          <h1>
            What are you
            <br />
            <em>dressing for?</em>
          </h1>

          <p>
            Tell us the occasion and we'll create
            a look using your wardrobe and personal
            style.
          </p>

        </section>


        {/* OCCASION */}

        <section className="occasion-section">

          <p className="outfit-tag">
            CHOOSE AN OCCASION
          </p>

          <div className="occasion-buttons">

            {[
              "College",
              "Casual Outing",
              "Party",
              "Work",
              "Wedding",
              "Date"
            ].map((item) => (

              <button
                key={item}
                className={
                  occasion === item
                    ? "occasion-button active"
                    : "occasion-button"
                }
                onClick={() => setOccasion(item)}
              >
                {item}
              </button>

            ))}

          </div>

        </section>


        {/* GENERATE */}

        <button
          className="generate-button"
          onClick={generateOutfit}
        >
          ✨ Generate My Outfit
        </button>


        {/* RESULT */}

        {outfit && (

          <section className="outfit-result">

            <div className="result-header">

              <p className="outfit-tag">
                YOUR STYLEAI LOOK
              </p>

              <h2>
                {occasion} outfit
              </h2>

            </div>


            <div className="outfit-items">

              {/* TOP */}

              {outfit.top && (

                <div className="outfit-item">

                  <div className="outfit-image">

                    {outfit.top.image && (
                      <img
                        src={outfit.top.image}
                        alt={outfit.top.name}
                      />
                    )}

                  </div>

                  <p>TOP</p>

                  <h3>
                    {outfit.top.name}
                  </h3>

                  <small>
                    {outfit.top.color}
                  </small>

                </div>

              )}


              {/* BOTTOM */}

              {outfit.bottom && (

                <div className="outfit-item">

                  <div className="outfit-image">

                    {outfit.bottom.image && (
                      <img
                        src={outfit.bottom.image}
                        alt={outfit.bottom.name}
                      />
                    )}

                  </div>

                  <p>BOTTOM</p>

                  <h3>
                    {outfit.bottom.name}
                  </h3>

                  <small>
                    {outfit.bottom.color}
                  </small>

                </div>

              )}


              {/* DRESS */}

              {outfit.dress && (

                <div className="outfit-item">

                  <div className="outfit-image">

                    {outfit.dress.image && (
                      <img
                        src={outfit.dress.image}
                        alt={outfit.dress.name}
                      />
                    )}

                  </div>

                  <p>DRESS</p>

                  <h3>
                    {outfit.dress.name}
                  </h3>

                  <small>
                    {outfit.dress.color}
                  </small>

                </div>

              )}


              {/* FOOTWEAR */}

              {outfit.footwear && (

                <div className="outfit-item">

                  <div className="outfit-image">

                    {outfit.footwear.image && (
                      <img
                        src={outfit.footwear.image}
                        alt={outfit.footwear.name}
                      />
                    )}

                  </div>

                  <p>FOOTWEAR</p>

                  <h3>
                    {outfit.footwear.name}
                  </h3>

                  <small>
                    {outfit.footwear.color}
                  </small>

                </div>

              )}


              {/* ACCESSORY */}

              {outfit.accessory ? (

                <div className="outfit-item">

                  <div className="outfit-image">

                    {outfit.accessory.image ? (
                      <img
                        src={outfit.accessory.image}
                        alt={outfit.accessory.name}
                      />
                    ) : (
                      <span style={{ fontSize: "40px" }}>✨</span>
                    )}

                  </div>

                  <p>ACCESSORY</p>

                  <h3>
                    {outfit.accessory.name}
                  </h3>

                  {outfit.accessory.color && (
                    <small>
                      {outfit.accessory.color}
                    </small>
                  )}

                </div>

              ) : (

                <div className="outfit-item empty-accessory-item">

                  <div className="outfit-image" style={{ background: "#f2ede4" }}>
                    <span style={{ fontSize: "40px", opacity: 0.7 }}>💍</span>
                  </div>

                  <p>ACCESSORY</p>

                  <h3 style={{ fontSize: "14px", color: "#666" }}>
                    No accessory available
                  </h3>

                  <small style={{ color: "#888", display: "block", margin: "0 18px 18px", lineHeight: "1.4" }}>
                    Add accessories to your wardrobe for a complete look.
                  </small>

                </div>

              )}

            </div>


            {/* ACTION BUTTONS */}

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", margin: "25px 0" }}>

              <button
                className="save-outfit-button"
                onClick={saveOutfit}
              >
                ♡ Save My Outfit
              </button>

              <button
                className="save-outfit-button"
                style={{
                  background: "white",
                  color: "#1c1c1c",
                  border: "1px solid #1c1c1c"
                }}
                onClick={() => {
                  window.location.href = "/outfit-result";
                }}
              >
                View on Outfit Result Page →
              </button>

            </div>


            {/* STYLE ADVICE */}

            <div className="style-advice">

              <p className="outfit-tag">
                STYLE TIP
              </p>

              <h3>
                Keep the look balanced.
              </h3>

              <p>
                STYLEAI selected pieces directly
                from your wardrobe to create this
                look for your chosen occasion.
              </p>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default OutfitGenerator;