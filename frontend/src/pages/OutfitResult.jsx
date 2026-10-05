import { useEffect, useState } from "react";
import "./OutfitResult.css";

function OutfitResult() {

  const [request, setRequest] = useState({
    occasion: "",
    weather: "",
    style: ""
  });

  const [outfit, setOutfit] = useState({
    top: "",
    bottom: "",
    shoes: "",
    accessory: ""
  });

  const [personalization, setPersonalization] = useState({});

  const [saved, setSaved] = useState(false);


  const getItemDetails = (item) => {
    if (!item) return { name: "", color: "", image: "" };
    if (typeof item === "string") return { name: item, color: "", image: "" };
    return {
      name: item.name || "",
      color: item.color || "",
      image: item.image || ""
    };
  };

  // ==========================================
  // LOAD OUTFIT RESULT
  // ==========================================

  useEffect(() => {
    const selectedSaved = JSON.parse(
      localStorage.getItem("selectedSavedOutfit") || "null"
    );

    const savedRequest = JSON.parse(
      localStorage.getItem("outfitRequest") || "{}"
    );

    const savedResult = JSON.parse(
      localStorage.getItem("outfitResult") || "{}"
    );

    const generatedWardrobe = JSON.parse(
      localStorage.getItem("generatedWardrobeOutfit") || "null"
    );

    if (selectedSaved) {
      setRequest({
        occasion: selectedSaved.occasion || "",
        weather: selectedSaved.weather || "",
        style: selectedSaved.style || ""
      });

      setOutfit({
        top: selectedSaved.top,
        bottom: selectedSaved.bottom,
        shoes: selectedSaved.shoes || selectedSaved.footwear,
        dress: selectedSaved.dress,
        accessory: selectedSaved.accessory
      });

      if (selectedSaved.personalization) {
        setPersonalization(selectedSaved.personalization);
      }
    } else if (savedResult.outfit) {
      setRequest({
        occasion: savedRequest.occasion || savedResult.request?.occasion || "",
        weather: savedRequest.weather || savedResult.request?.weather || "",
        style: savedRequest.style || savedResult.request?.style || ""
      });

      setOutfit(savedResult.outfit);

      if (savedResult.personalization) {
        setPersonalization(savedResult.personalization);
      }
    } else if (generatedWardrobe) {
      setRequest({
        occasion: savedRequest.occasion || "",
        weather: savedRequest.weather || "",
        style: savedRequest.style || ""
      });

      setOutfit({
        top: generatedWardrobe.top,
        bottom: generatedWardrobe.bottom,
        shoes: generatedWardrobe.footwear,
        dress: generatedWardrobe.dress,
        accessory: generatedWardrobe.accessory
      });
    }
  }, []);


  // ==========================================
  // SAVE OUTFIT
  // ==========================================

  const saveOutfit = () => {
    const savedOutfits = JSON.parse(
      localStorage.getItem("savedOutfits") || "[]"
    );

    const topDetails = getItemDetails(outfit.top);
    const bottomDetails = getItemDetails(outfit.bottom);
    const shoesDetails = getItemDetails(outfit.shoes);
    const dressDetails = getItemDetails(outfit.dress);
    const accDetails = getItemDetails(outfit.accessory);

    const newOutfit = {
      id: Date.now(),
      top: topDetails.name ? topDetails : null,
      bottom: bottomDetails.name ? bottomDetails : null,
      shoes: shoesDetails.name ? shoesDetails : null,
      footwear: shoesDetails.name ? shoesDetails : null,
      dress: dressDetails.name ? dressDetails : null,
      accessory: accDetails.name ? accDetails : null,
      occasion: request.occasion,
      weather: request.weather,
      style: request.style,
      savedAt: new Date().toISOString()
    };

    const alreadySaved = savedOutfits.some((item) => {
      const savedTop = typeof item.top === "string" ? item.top : item.top?.name;
      const savedBottom = typeof item.bottom === "string" ? item.bottom : item.bottom?.name;
      const savedAcc = typeof item.accessory === "string" ? item.accessory : item.accessory?.name;
      return (
        savedTop === topDetails.name &&
        savedBottom === bottomDetails.name &&
        savedAcc === accDetails.name &&
        item.occasion === request.occasion
      );
    });

    if (alreadySaved) {
      setSaved(true);
      alert("This outfit is already saved.");
      return;
    }

    savedOutfits.push(newOutfit);
    localStorage.setItem("savedOutfits", JSON.stringify(savedOutfits));
    setSaved(true);
    alert("Outfit saved successfully! ❤️");
  };


  // ==========================================
  // NAVIGATION
  // ==========================================

  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };


  const tryAnotherLook = () => {
    window.location.href = "/outfit-stylist";
  };


  return (

    <div className="result-page">


      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="result-navbar">

        <div
          className="result-logo"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          STYLE<span>AI</span>
        </div>


        <button onClick={goToDashboard}>
          Dashboard
        </button>

      </nav>



      {/* ======================================
          HEADER
      ====================================== */}

      <section className="result-header">

        <p>
          YOUR PERSONAL AI STYLIST
        </p>


        <h1>
          Your <em>perfect look.</em>
        </h1>


        <div className="request-summary">

          <span>
            {request.occasion}
          </span>

          <span>
            {request.weather}
          </span>

          <span>
            {request.style}
          </span>

        </div>

      </section>



      {/* ======================================
          OUTFIT CARDS
      ====================================== */}

      <main className="result-container">


        {/* TOP */}

        {(() => {
          const top = getItemDetails(outfit.top);
          return (
            <div className="outfit-card">
              <div className="outfit-icon">
                👕
              </div>
              <h2>
                TOP
              </h2>
              {top.image && (
                <div className="outfit-card-image">
                  <img src={top.image} alt={top.name} />
                </div>
              )}
              <h3>
                {top.name || "No top selected"}
              </h3>
              {top.color && (
                <p className="outfit-card-color">
                  <strong>Color:</strong> {top.color}
                </p>
              )}
              <p>
                A versatile choice selected for your occasion and personal style.
              </p>
            </div>
          );
        })()}



        {/* BOTTOM */}

        {(() => {
          const bottom = getItemDetails(outfit.bottom);
          return (
            <div className="outfit-card">
              <div className="outfit-icon">
                👖
              </div>
              <h2>
                BOTTOM
              </h2>
              {bottom.image && (
                <div className="outfit-card-image">
                  <img src={bottom.image} alt={bottom.name} />
                </div>
              )}
              <h3>
                {bottom.name || "No bottom selected"}
              </h3>
              {bottom.color && (
                <p className="outfit-card-color">
                  <strong>Color:</strong> {bottom.color}
                </p>
              )}
              <p>
                Designed to balance the overall silhouette of your outfit.
              </p>
            </div>
          );
        })()}



        {/* DRESS (if present) */}

        {outfit.dress && (() => {
          const dress = getItemDetails(outfit.dress);
          return (
            <div className="outfit-card">
              <div className="outfit-icon">
                👗
              </div>
              <h2>
                DRESS
              </h2>
              {dress.image && (
                <div className="outfit-card-image">
                  <img src={dress.image} alt={dress.name} />
                </div>
              )}
              <h3>
                {dress.name}
              </h3>
              {dress.color && (
                <p className="outfit-card-color">
                  <strong>Color:</strong> {dress.color}
                </p>
              )}
              <p>
                An elegant full silhouette selected for your occasion.
              </p>
            </div>
          );
        })()}



        {/* SHOES / FOOTWEAR */}

        {(() => {
          const shoes = getItemDetails(outfit.shoes || outfit.footwear);
          return (
            <div className="outfit-card">
              <div className="outfit-icon">
                👟
              </div>
              <h2>
                SHOES
              </h2>
              {shoes.image && (
                <div className="outfit-card-image">
                  <img src={shoes.image} alt={shoes.name} />
                </div>
              )}
              <h3>
                {shoes.name || "No shoes selected"}
              </h3>
              {shoes.color && (
                <p className="outfit-card-color">
                  <strong>Color:</strong> {shoes.color}
                </p>
              )}
              <p>
                A comfortable finishing piece that complements your complete look.
              </p>
            </div>
          );
        })()}



        {/* ACCESSORY */}

        {(() => {
          const acc = getItemDetails(outfit.accessory);
          return (
            <div className="outfit-card">
              <div className="outfit-icon">
                ✨
              </div>
              <h2>
                ACCESSORY
              </h2>
              {acc.image && (
                <div className="outfit-card-image">
                  <img src={acc.image} alt={acc.name} />
                </div>
              )}
              <h3>
                {acc.name || "No accessory selected"}
              </h3>
              {acc.color && (
                <p className="outfit-card-color">
                  <strong>Color:</strong> {acc.color}
                </p>
              )}
              <p>
                {acc.name
                  ? "A curated finishing touch to complete your STYLEAI recommendation."
                  : "Add accessories to your wardrobe for a complete look."}
              </p>
            </div>
          );
        })()}

      </main>



      {/* ======================================
          WHY THIS WORKS
      ====================================== */}

      <section className="why-section">

        <p>
          STYLEAI'S TAKE
        </p>


        <h2>
          Why this look works
        </h2>


        <p className="why-text">

          This outfit combines your selected
          occasion, weather and personal style
          to create a balanced and wearable look.
          Each piece works together while keeping
          your individual style at the centre.

        </p>



        {/* ====================================
            PERSONALIZATION
        ==================================== */}

        <div className="personalization-box">

          <h3>
            Personalized for you
          </h3>


          {(() => {

            const result = JSON.parse(
              localStorage.getItem("outfitResult") || "{}"
            );

            const personalization =
              result.personalization || {};


            return (

              <div>


                {/* BODY TYPE */}

                {personalization.body_note && (

                  <p>

                    <strong>
                      Body Type:
                    </strong>{" "}

                    {personalization.body_note}

                  </p>

                )}



                {/* COLOURS */}

                {personalization.color_note && (

                  <p>

                    <strong>
                      Colours:
                    </strong>{" "}

                    {personalization.color_note}

                  </p>

                )}



                {/* WARDROBE */}

                {personalization.wardrobe_items !== undefined && (

                  <p>

                    <strong>
                      Wardrobe:
                    </strong>{" "}

                    {personalization.wardrobe_items}
                    {" "}item(s) available.

                  </p>

                )}



                {/* FIT */}

                {personalization.preferred_fit && (

                  <p>

                    <strong>
                      Preferred Fit:
                    </strong>{" "}

                    {personalization.preferred_fit}

                  </p>

                )}



                {/* FALLBACK */}

                {!personalization.body_note &&
                 !personalization.color_note &&
                 personalization.wardrobe_items === undefined &&
                 !personalization.preferred_fit && (

                  <p>
                    Your outfit is based on your
                    selected occasion, weather and style.
                  </p>

                )}

              </div>

            );

          })()}

        </div>

      </section>



      {/* ======================================
          ACTION BUTTONS
      ====================================== */}

      <div className="result-actions">


        {/* SAVE OUTFIT */}

        <button
          className="secondary-button"
          onClick={saveOutfit}
        >

          {saved
            ? "✓ Outfit Saved"
            : "♡ Save Outfit"}

        </button>



        {/* TRY ANOTHER */}

        <button
          className="secondary-button"
          onClick={tryAnotherLook}
        >
          ← Try Another Look
        </button>



        {/* DASHBOARD */}

        <button
          className="primary-button"
          onClick={goToDashboard}
        >
          Back to Dashboard →
        </button>


      </div>


    </div>
  );
}


export default OutfitResult;