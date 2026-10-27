import { useState } from "react";
import Header from "../components/Header";
import "./StylePreferences.css";

function StylePreferences() {

  const [preferences, setPreferences] = useState({
    colors: [],
    fit: "",
    styles: [],
    occasions: [],
    comfort: ""
  });

  const toggleItem = (category, item) => {

    setPreferences((prev) => {

      const current = prev[category];

      return {
        ...prev,
        [category]: current.includes(item)
          ? current.filter((x) => x !== item)
          : [...current, item]
      };

    });

  };


  const handleContinue = () => {

    localStorage.setItem(
      "preferences",
      JSON.stringify(preferences)
    );

    window.location.href = "/dashboard";

  };


  const colors = [
    "Black",
    "White",
    "Blue",
    "Pink",
    "Beige",
    "Green"
  ];

  const fits = [
    "Slim",
    "Regular",
    "Relaxed",
    "Oversized"
  ];

  const styles = [
    "Casual",
    "Minimal",
    "Streetwear",
    "Formal",
    "Traditional",
    "Trendy"
  ];

  const occasions = [
    "College",
    "Casual Outing",
    "Party",
    "Work",
    "Wedding",
    "Date"
  ];


  return (

    <div className="preferences-page">

      <Header
        logoRoute="/"
        variant="step"
        stepText="STEP 02 / 03"
      />


      <main className="preferences-container">

        <div className="preferences-intro">

          <p className="preferences-tag">
            MAKE IT YOURS
          </p>

          <h1>
            Define your
            <br />
            <em>personal style.</em>
          </h1>

          <p>
            Tell us what you like. The more we know,
            the better we can style you.
          </p>

        </div>


        {/* COLOURS */}

        <section className="preference-section">

          <h2>Favourite Colours</h2>

          <p>
            Choose the colours you enjoy wearing.
          </p>

          <div className="option-grid">

            {colors.map((color) => (

              <button
                type="button"
                key={color}
                className={
                  preferences.colors.includes(color)
                    ? "preference-option selected"
                    : "preference-option"
                }
                onClick={() =>
                  toggleItem("colors", color)
                }
              >
                {color}
              </button>

            ))}

          </div>

        </section>


        {/* FIT */}

        <section className="preference-section">

          <h2>Preferred Fit</h2>

          <p>
            How do you like your clothes to fit?
          </p>

          <div className="option-grid">

            {fits.map((fit) => (

              <button
                type="button"
                key={fit}
                className={
                  preferences.fit === fit
                    ? "preference-option selected"
                    : "preference-option"
                }
                onClick={() =>
                  setPreferences({
                    ...preferences,
                    fit: fit
                  })
                }
              >
                {fit}
              </button>

            ))}

          </div>

        </section>


        {/* STYLE */}

        <section className="preference-section">

          <h2>Your Style</h2>

          <p>
            Select all the styles you like.
          </p>

          <div className="option-grid">

            {styles.map((style) => (

              <button
                type="button"
                key={style}
                className={
                  preferences.styles.includes(style)
                    ? "preference-option selected"
                    : "preference-option"
                }
                onClick={() =>
                  toggleItem("styles", style)
                }
              >
                {style}
              </button>

            ))}

          </div>

        </section>


        {/* OCCASIONS */}

        <section className="preference-section">

          <h2>Favourite Occasions</h2>

          <p>
            Choose the occasions you want outfit ideas for.
          </p>

          <div className="option-grid">

            {occasions.map((occasion) => (

              <button
                type="button"
                key={occasion}
                className={
                  preferences.occasions.includes(occasion)
                    ? "preference-option selected"
                    : "preference-option"
                }
                onClick={() =>
                  toggleItem("occasions", occasion)
                }
              >
                {occasion}
              </button>

            ))}

          </div>

        </section>


        {/* COMFORT */}

        <section className="preference-section">

          <h2>Comfort vs Style</h2>

          <p>
            What matters most to you?
          </p>

          <div className="option-grid">

            {[
              "Comfort is most important",
              "Balance comfort & style",
              "Style is most important"
            ].map((item) => (

              <button
                type="button"
                key={item}
                className={
                  preferences.comfort === item
                    ? "preference-option selected"
                    : "preference-option"
                }
                onClick={() =>
                  setPreferences({
                    ...preferences,
                    comfort: item
                  })
                }
              >
                {item}
              </button>

            ))}

          </div>

        </section>


        {/* CONTINUE */}

        <div className="preferences-submit">

          <button
            type="button"
            className="preferences-button"
            onClick={handleContinue}
          >
            Continue to Dashboard →
          </button>

        </div>

      </main>

    </div>

  );
}

export default StylePreferences;