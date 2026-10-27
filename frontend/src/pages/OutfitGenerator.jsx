import { useState } from "react";
import Header from "../components/Header";
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

    const normalizeOccasion = (rawOccasion) => {
      const norm = normalize(rawOccasion);
      if (norm.includes("work") || norm.includes("office") || norm.includes("business")) return "work";
      if (norm.includes("party") || norm.includes("club") || norm.includes("cocktail")) return "party";
      if (norm.includes("wedding") || norm.includes("marriage") || norm.includes("sangeet") || norm.includes("reception")) return "wedding";
      if (norm.includes("formal")) return "formal";
      if (norm.includes("college") || norm.includes("campus") || norm.includes("class")) return "college";
      if (norm.includes("date") || norm.includes("romantic")) return "date";
      return "casual";
    };

    const occ = normalizeOccasion(occasion);

    const excludedAccessories = ["spectacles", "glasses", "prescription", "reading glasses", "eyeglasses", "specs", "optical"];

    const classifyGarment = (item) => {
      const name = normalize(item.name);
      const cat = normalize(item.category);
      const type = normalize(item.type);
      const color = normalize(item.color);
      const combined = `${cat} ${type} ${name} ${color}`;

      const isSunglasses = ["sunglass", "sunglasses", "shades"].some((k) => combined.includes(k));
      const isOptical = excludedAccessories.some((exc) => combined.includes(exc)) && !isSunglasses;

      // 1. Dresses / Complete Outfits
      const dressKeywords = [
        "dress", "dresses", "gown", "saree", "sari", "lehenga",
        "anarkali", "jumpsuit", "romper", "kurta set", "salwar suit",
        "sherwani", "maxi dress", "bodycon", "sundress"
      ];
      if (
        ["dress", "dresses"].includes(cat) ||
        ["dress", "dresses"].includes(type) ||
        dressKeywords.some((k) => combined.includes(k))
      ) {
        let subType = "casual_dress";
        let formality = 1;
        if (["satin", "silk", "gown", "wedding", "bridal", "saree", "sari", "lehenga", "anarkali", "formal", "evening", "maxi", "chiffon"].some((k) => combined.includes(k))) {
          subType = "formal_dress";
          formality = 3;
        } else if (["party", "cocktail", "club", "sequin", "glitter", "metallic", "bodycon", "mini"].some((k) => combined.includes(k))) {
          subType = "party_dress";
          formality = 3;
        }
        return {
          primaryCategory: "dress",
          subType,
          formality,
          isCompleteOutfit: true,
          isOptical: false,
          name: item.name,
          color: item.color || "",
          raw: item,
          text: combined
        };
      }

      // 2. Footwear / Shoes
      const shoeKeywords = [
        "shoe", "shoes", "sneaker", "sneakers", "boot", "boots", "heel", "heels",
        "flat", "flats", "loafer", "loafers", "sandals", "sandal", "pumps", "stiletto",
        "stilettos", "juttis", "footwear", "oxford", "trainers"
      ];
      if (
        ["shoes", "shoe", "footwear"].includes(cat) ||
        ["shoes", "shoe", "footwear"].includes(type) ||
        shoeKeywords.some((k) => combined.includes(k))
      ) {
        let subType = "casual_shoes";
        let formality = 1;
        if (["heel", "heels", "pumps", "stiletto", "oxford", "dress shoe", "formal loafer", "juttis", "formal", "embellished"].some((k) => combined.includes(k))) {
          subType = "formal_shoes";
          formality = 3;
        } else if (["running", "gym", "sport", "athletic", "trainers"].some((k) => combined.includes(k))) {
          subType = "athletic_shoes";
          formality = 0;
        }
        return {
          primaryCategory: "shoes",
          subType,
          formality,
          isCompleteOutfit: false,
          isOptical: false,
          name: item.name,
          color: item.color || "",
          raw: item,
          text: combined
        };
      }

      // 3. Accessories
      const accKeywords = [
        "earring", "earrings", "necklace", "bracelet", "watch", "sunglass", "sunglasses",
        "handbag", "bag", "belt", "scarf", "ring", "clutch", "bangle", "pendant", "spectacles", "glasses", "choker"
      ];
      if (cat.includes("accessor") || type.includes("accessor") || accKeywords.some((k) => combined.includes(k))) {
        let subType = "casual_acc";
        let formality = 1;
        if (isOptical) {
          subType = "optical";
        } else if (["earring", "earrings", "necklace", "bracelet", "ring", "bangle", "pendant", "choker", "jewelry"].some((k) => combined.includes(k))) {
          subType = "jewelry";
          formality = 2;
        } else if (combined.includes("watch")) {
          subType = "watch";
          formality = 2;
        } else if (["clutch", "potli"].some((k) => combined.includes(k))) {
          subType = "formal_bag";
          formality = 3;
        } else if (["bag", "handbag", "tote", "purse"].some((k) => combined.includes(k))) {
          subType = "bag";
          formality = 2;
        }
        return {
          primaryCategory: "accessory",
          subType,
          formality,
          isCompleteOutfit: false,
          isOptical,
          name: item.name,
          color: item.color || "",
          raw: item,
          text: combined
        };
      }

      // 4. Bottoms
      const bottomKeywords = [
        "bottom", "bottoms", "jeans", "trouser", "trousers", "pants", "skirt",
        "shorts", "legging", "leggings", "cargo", "palazzo", "slacks", "chinos",
        "culottes"
      ];
      if (
        ["bottom", "bottoms", "pants", "jeans"].includes(cat) ||
        ["bottom", "bottoms", "pants", "jeans"].includes(type) ||
        bottomKeywords.some((k) => combined.includes(k))
      ) {
        let subType = "casual_bottoms";
        let formality = 1;
        if (["sweatpants", "joggers", "trackpants", "shorts", "gym", "athletic", "legging", "leggings", "cargo"].some((k) => combined.includes(k))) {
          subType = "casual_bottoms";
          formality = 0;
        } else if (["jeans", "denim"].some((k) => combined.includes(k))) {
          subType = "jeans";
          formality = 1;
        } else if (combined.includes("skirt")) {
          subType = "skirt";
          formality = combined.includes("pencil") || combined.includes("formal") ? 3 : 2;
        } else if (["trouser", "trousers", "pants", "formal pants", "tailored", "slacks", "chinos", "dress pants", "suit pants", "pleated", "office"].some((k) => combined.includes(k))) {
          subType = "trousers";
          formality = 3;
        }
        return {
          id: item.id || item._id,
          primaryCategory: "bottom",
          subType,
          formality,
          isCompleteOutfit: false,
          isOptical: false,
          name: item.name,
          color: item.color || "",
          raw: item,
          text: combined
        };
      }

      // 5. Tops
      const isStatement = [
        "one shoulder", "one-shoulder", "off shoulder", "off-shoulder",
        "party top", "party", "corset", "halter", "halterneck",
        "sequin", "glitter", "metallic", "backless", "tube top",
        "bustier", "cutout", "glam", "club", "cocktail", "going out",
        "date top", "date", "evening top", "satin top", "silk top",
        "lace top", "crop top", "cami top", "sweetheart", "cowl neck",
        "draped top"
      ].some((k) => combined.includes(k));

      const isShirt = [
        "shirt", "button down", "button-down", "buttondown",
        "collared", "oxford", "formal shirt", "dress shirt",
        "blouse", "formal blouse", "work blouse", "formal top"
      ].some((k) => combined.includes(k));

      const isTank = [
        "tank top", "tank", "camisole", "cami", "ribbed tank",
        "cotton tank", "basic tank", "undershirt", "white tank top"
      ].some((k) => combined.includes(k));

      let subType = "casual_top";
      let formality = 1;

      if (isStatement) {
        subType = "statement_top";
        formality = 2;
      } else if (isShirt) {
        subType = "shirt";
        formality = 3;
      } else if (isTank) {
        subType = "tank_top";
        formality = 1;
      }

      return {
        id: item.id || item._id,
        primaryCategory: "top",
        subType,
        formality,
        isCompleteOutfit: false,
        isOptical: false,
        name: item.name,
        color: item.color || "",
        raw: item,
        text: combined
      };
    };

    const preferences = JSON.parse(
      localStorage.getItem("preferences") || "{}"
    );

    const preferredColors = Array.isArray(preferences.colors)
      ? preferences.colors.map(normalize)
      : [];

    const preferredStyles = Array.isArray(preferences.styles)
      ? preferences.styles.map(normalize)
      : [];

    const scoreGarmentForOccasion = (garment) => {
      if (garment.isOptical) return -999;
      const { subType, text, color } = garment;
      let score = 0;

      if (occ === "work" || occ === "formal") {
        if (subType === "shirt") score += 55;
        else if (subType === "trousers") score += 55;
        else if (subType === "formal_dress") {
          if (["satin", "silk", "gown", "evening", "cocktail", "party", "backless", "sequin", "slit"].some((k) => text.includes(k))) {
            score -= 50;
          } else {
            score += 35;
          }
        }
        else if (subType === "formal_shoes") score += 30;
        else if (subType === "watch") score += 20;
        else if (subType === "jewelry") score += 15;

        if (subType === "tank_top") score -= 65;
        else if (subType === "statement_top") score -= 60;
        else if (subType === "casual_bottoms") score -= 65;
        else if (subType === "jeans") score -= 25;
        else if (subType === "athletic_shoes") score -= 40;
      } else if (occ === "casual") {
        if (subType === "casual_top") score += 48;
        else if (subType === "tank_top") score += 40;
        else if (subType === "jeans") score += 45;
        else if (subType === "casual_bottoms") score += 30;
        else if (subType === "casual_dress") score += 40;
        else if (subType === "casual_shoes") score += 30;
        else if (subType === "casual_acc" || subType === "watch") score += 15;

        if (subType === "statement_top") score -= 60;
        else if (subType === "formal_dress") score -= 60;
        else if (subType === "trousers") score -= 10;
        else if (subType === "formal_shoes") score -= 35;
      } else if (occ === "party") {
        if (subType === "statement_top") score += 70;
        else if (subType === "party_dress") score += 70;
        else if (subType === "formal_dress") score += 45;
        else if (subType === "jeans" || subType === "skirt") score += 45;
        else if (subType === "trousers") score += 40;
        else if (subType === "formal_shoes") score += 35;
        else if (subType === "jewelry") score += 25;

        // Penalties for plain basics and corporate workwear
        if (subType === "shirt") score -= 35;
        else if (subType === "tank_top" && !["party", "glam", "satin", "metallic", "sequin"].some((k) => text.includes(k))) score -= 60;
        else if (subType === "casual_top") score -= 30;
        else if (subType === "casual_bottoms") score -= 50;
        else if (subType === "athletic_shoes") score -= 40;

        if (["brown", "black", "gold", "silver", "wine", "burgundy", "red", "emerald"].some((c) => text.includes(c))) {
          score += 15;
        }
      } else if (occ === "wedding") {
        if (subType === "formal_dress") score += 80;
        else if (subType === "formal_shoes") score += 40;
        else if (subType === "jewelry" || subType === "formal_bag") score += 35;

        if (["satin dress", "silk dress", "wedding gown", "evening gown", "saree", "lehenga", "anarkali"].some((k) => text.includes(k))) {
          score += 25;
        }

        if (["tank_top", "casual_top", "statement_top"].includes(subType)) score -= 85;
        else if (["jeans", "casual_bottoms"].includes(subType)) score -= 85;
        else if (["athletic_shoes", "casual_shoes"].includes(subType)) score -= 70;
      } else if (occ === "college") {
        if (subType === "casual_top") score += 50;
        else if (subType === "tank_top") score += 38;
        else if (subType === "jeans") score += 45;
        else if (subType === "casual_shoes") score += 35;

        if (subType === "formal_dress" || subType === "formal_shoes") score -= 50;
        else if (subType === "statement_top") score -= 60;
      } else if (occ === "date") {
        if (subType === "statement_top") score += 65;
        else if (["party_dress", "formal_dress"].includes(subType)) score += 65;
        else if (subType === "casual_dress") score += 45;
        else if (["jeans", "skirt"].includes(subType)) score += 45;
        else if (subType === "trousers") score += 35;
        else if (subType === "formal_shoes") score += 30;
        else if (subType === "casual_shoes") score += 20;
        else if (subType === "jewelry") score += 25;

        // Penalties for corporate workwear and sloppy loungewear on a romantic date
        if (subType === "shirt") score -= 25;
        else if (subType === "tank_top" && !["party", "glam", "satin", "metallic", "sequin", "lace", "silk"].some((k) => text.includes(k))) score -= 40;
        else if (["casual_bottoms", "athletic_shoes"].includes(subType)) score -= 50;

        if (["pink", "red", "black", "burgundy", "wine", "emerald", "champagne", "rose"].some((c) => text.includes(c))) {
          score += 10;
        }
      }

      if (color && preferredColors.length > 0) {
        if (preferredColors.some((pc) => color.includes(pc) || pc.includes(color))) score += 5;
      }

      if (preferredStyles.length > 0) {
        if (preferredStyles.some((ps) => text.includes(ps))) score += 10;
      }

      return score;
    };

    const classifiedItems = wardrobe.map(classifyGarment);

    const dresses = classifiedItems.filter((i) => i.primaryCategory === "dress");
    const tops = classifiedItems.filter((i) => i.primaryCategory === "top");
    const bottoms = classifiedItems.filter((i) => i.primaryCategory === "bottom");
    const shoesList = classifiedItems.filter((i) => i.primaryCategory === "shoes");
    const accessoriesList = classifiedItems.filter((i) => i.primaryCategory === "accessory" && !i.isOptical);

    // Footwear
    let bestShoes = null;
    if (shoesList.length > 0) {
      const rankedShoes = [...shoesList].sort((a, b) => scoreGarmentForOccasion(b) - scoreGarmentForOccasion(a));
      if (scoreGarmentForOccasion(rankedShoes[0]) > -20) {
        bestShoes = rankedShoes[0];
      }
    }

    // Accessory
    let bestAccessory = null;
    if (accessoriesList.length > 0) {
      const rankedAccs = [...accessoriesList].sort((a, b) => scoreGarmentForOccasion(b) - scoreGarmentForOccasion(a));
      if (scoreGarmentForOccasion(rankedAccs[0]) > 0) {
        bestAccessory = rankedAccs[0];
      }
    }

    // Assemble and score whole outfit candidates
    const candidates = [];

    // Candidate Type A: Dresses (Complete one-piece outfits)
    dresses.forEach((d) => {
      let score = scoreGarmentForOccasion(d) + 30; // Complete outfit bonus
      if (occ === "wedding" && d.subType === "formal_dress") {
        score += 40;
      }
      if ((occ === "party" || occ === "date") && ["party_dress", "formal_dress"].includes(d.subType)) {
        score += 35;
      }
      if ((occ === "work" || occ === "formal") && ["satin", "silk", "gown", "cocktail", "party", "evening"].some((k) => d.text.includes(k))) {
        score -= 40;
      }
      if (bestShoes) score += scoreGarmentForOccasion(bestShoes) * 0.3;
      if (bestAccessory) score += scoreGarmentForOccasion(bestAccessory) * 0.25;

      candidates.push({
        type: "dress",
        dress: d.raw,
        top: null,
        bottom: null,
        footwear: bestShoes ? bestShoes.raw : null,
        accessory: bestAccessory ? bestAccessory.raw : null,
        classifiedDress: d,
        score
      });
    });

    // Candidate Type B: Separates (Top + Bottom combinations)
    tops.forEach((t) => {
      bottoms.forEach((b) => {
        const topScore = scoreGarmentForOccasion(t);
        const bottomScore = scoreGarmentForOccasion(b);
        let score = topScore + bottomScore;

        // Formality harmony
        const formalityDiff = Math.abs(t.formality - b.formality);
        if (formalityDiff === 0) score += 20;
        else if (formalityDiff === 1) {
          if (occ === "party" || occ === "date") score += 20;
          else score += 10;
        } else score -= 40;

        // Work synergy: shirt + trousers
        if ((occ === "work" || occ === "formal") && t.subType === "shirt" && b.subType === "trousers") {
          score += 40;
        }

        // Penalty: tank top + formal trousers
        if (t.subType === "tank_top" && b.subType === "trousers") {
          score -= 50;
        }

        // Casual synergy: casual top/tank + jeans
        if ((occ === "casual" || occ === "college") && (t.subType === "casual_top" || t.subType === "tank_top") && b.subType === "jeans") {
          score += 30;
        }

        // Party synergy: statement top + trousers/jeans/skirt
        if (occ === "party" && t.subType === "statement_top" && ["trousers", "jeans", "skirt"].includes(b.subType)) {
          score += 45;
        }

        // Party penalty: Stiff corporate office shirt + trousers at a party
        if (occ === "party" && t.subType === "shirt" && b.subType === "trousers") {
          score -= 50;
        }

        // Party penalty: plain tank top + jeans
        if (occ === "party" && t.subType === "tank_top") {
          score -= 50;
        }

        // Date synergy: Statement top + jeans/skirt/trousers for date
        if (occ === "date" && t.subType === "statement_top" && ["jeans", "skirt", "trousers"].includes(b.subType)) {
          score += 45;
        }

        // Date penalty: Stiff corporate office shirt + trousers on a romantic date
        if (occ === "date" && t.subType === "shirt" && b.subType === "trousers") {
          score -= 45;
        }

        // Casual / college penalty: statement evening top on casual outing or college
        if ((occ === "casual" || occ === "college") && t.subType === "statement_top") {
          score -= 40;
        }

        // Wedding penalty: casual separates
        if (occ === "wedding") {
          score -= 80;
        }

        if (bestShoes) score += scoreGarmentForOccasion(bestShoes) * 0.3;
        if (bestAccessory) score += scoreGarmentForOccasion(bestAccessory) * 0.25;

        candidates.push({
          type: "separates",
          dress: null,
          top: t.raw,
          bottom: b.raw,
          footwear: bestShoes ? bestShoes.raw : null,
          accessory: bestAccessory ? bestAccessory.raw : null,
          classifiedTop: t,
          classifiedBottom: b,
          score
        });
      });
    });

    if (candidates.length === 0) {
      alert("No suitable items found in your wardrobe for this occasion.");
      return;
    }

    candidates.sort((a, b) => b.score - a.score);
    const bestMatch = candidates[0];

    const generatedOutfit = {
      top: bestMatch.top,
      bottom: bestMatch.bottom,
      dress: bestMatch.dress,
      footwear: bestMatch.footwear,
      accessory: bestMatch.accessory
    };

    setOutfit(generatedOutfit);

    localStorage.removeItem("selectedSavedOutfit");

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
          top: bestMatch.top || null,
          bottom: bestMatch.bottom || null,
          shoes: bestMatch.footwear || null,
          dress: bestMatch.dress || null,
          accessory: bestMatch.accessory || null
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

    alert("Outfit saved successfully!");
  };


  return (
    <div className="outfit-page">

      <Header
        logoRoute="/dashboard"
        buttonText="← Dashboard"
        buttonRoute="/dashboard"
      />


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
          Generate My Outfit
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

              {outfit.accessory && (

                <div className="outfit-item">

                  <div className="outfit-image">

                    {outfit.accessory.image && (
                      <img
                        src={outfit.accessory.image}
                        alt={outfit.accessory.name}
                      />
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

              )}

            </div>


            {/* ACTION BUTTONS */}

            <div className="outfit-actions-group">

              <button
                type="button"
                className="outfit-action-btn outfit-action-secondary save-outfit-button"
                onClick={saveOutfit}
              >
                Save My Outfit
              </button>

              <button
                type="button"
                className="outfit-action-btn outfit-action-primary"
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