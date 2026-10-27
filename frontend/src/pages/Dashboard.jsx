import Header from "../components/Header";
import "./Dashboard.css";

function Dashboard() {

  const profile = JSON.parse(
    localStorage.getItem("profile") || "{}"
  );

  const preferences = JSON.parse(
    localStorage.getItem("preferences") || "{}"
  );

  const name = profile.name || "there";


  return (
    <div className="dashboard">

      <Header
        logoRoute="/"
        buttonText="Profile"
        buttonRoute="/profile"
      />



      {/* =========================================
          MAIN DASHBOARD
      ========================================= */}

      <main className="dashboard-container">


        {/* =========================================
            WELCOME SECTION
        ========================================= */}

        <section className="welcome">

          <p>
            YOUR PERSONAL STYLE SPACE
          </p>


          <h1>
            Welcome,
            <br />
            <em>{name}.</em>
          </h1>


          <p>
            Your personal AI stylist is ready to help
            you create your next look.
          </p>

        </section>



        {/* =========================================
            DASHBOARD CARDS
        ========================================= */}

        <section className="dashboard-cards">


          {/* =====================================
              AVATAR
          ===================================== */}

          <div className="dashboard-card">

            <h2>
              Your Avatar
            </h2>


            <p>
              Create and view your digital avatar
              using your body measurements.
            </p>


            <button
              onClick={() => {
                window.location.href = "/avatar";
              }}
            >
              Create Avatar →
            </button>

          </div>



          {/* =====================================
              WARDROBE
          ===================================== */}

          <div className="dashboard-card">

            <h2>
              Your Wardrobe
            </h2>


            <p>
              Upload and manage the clothes
              you already own.
            </p>


            <button
              onClick={() => {
                window.location.href = "/wardrobe";
              }}
            >
              Open Wardrobe →
            </button>

          </div>



          {/* =====================================
              OUTFIT GENERATOR
          ===================================== */}

          <div className="dashboard-card">

            <h2>
              Generate Outfit
            </h2>


            <p>
              Let STYLEAI create an outfit
              based on your style and occasion.
            </p>


            <button
              onClick={() => {
                window.location.href = "/outfit";
              }}
            >
              Create Outfit →
            </button>

          </div>



          {/* =====================================
              SAVED LOOKS
          ===================================== */}

          <div className="dashboard-card">

            <h2>
              Saved Looks
            </h2>


            <p>
              View your favourite outfits and
              STYLEAI recommendations.
            </p>


            <button
              onClick={() => {
                window.location.href = "/saved-outfits";
              }}
            >
              View Saved Looks →
            </button>

          </div>


        </section>



        {/* =========================================
            STYLE PROFILE
        ========================================= */}

        <section className="style-profile">

          <p className="style-profile-tag">
            YOUR STYLE PROFILE
          </p>

          <h2>
            What we know about your style
          </h2>

          <div className="profile-details">

            {/* STYLE */}
            <div className="profile-detail-card">
              <span>
                STYLE
              </span>
              <strong>
                {preferences.styles?.length
                  ? preferences.styles.join(", ")
                  : "Not selected"}
              </strong>
            </div>

            {/* FIT */}
            <div className="profile-detail-card">
              <span>
                FIT
              </span>
              <strong>
                {preferences.fit || "Not selected"}
              </strong>
            </div>

            {/* COLOURS */}
            <div className="profile-detail-card">
              <span>
                COLOURS
              </span>
              <strong>
                {preferences.colors?.length
                  ? preferences.colors.join(", ")
                  : "Not selected"}
              </strong>
            </div>

            {/* OCCASIONS */}
            <div className="profile-detail-card">
              <span>
                OCCASIONS
              </span>
              <strong>
                {preferences.occasions?.length
                  ? preferences.occasions.join(", ")
                  : "Not selected"}
              </strong>
            </div>

          </div>

          {/* EDIT PREFERENCES */}
          <div className="edit-preferences-wrapper">
            <button
              className="edit-preferences-btn"
              onClick={() => {
                window.location.href = "/preferences";
              }}
            >
              Edit Style Preferences →
            </button>
          </div>

        </section>

        {/* =========================================
            QUICK ACTIONS
        ========================================= */}

        <section className="quick-actions">

          <p className="quick-actions-tag">
            QUICK ACTIONS
          </p>

          <div className="quick-action-buttons">

            {/* ADD CLOTHES */}
            <button
              className="quick-action-btn quick-action-secondary"
              onClick={() => {
                window.location.href = "/wardrobe";
              }}
            >
              Add Clothes
            </button>

            {/* GENERATE OUTFIT */}
            <button
              className="quick-action-btn quick-action-primary"
              onClick={() => {
                window.location.href = "/outfit";
              }}
            >
              Generate Outfit
            </button>

            {/* VIEW AVATAR */}
            <button
              className="quick-action-btn quick-action-secondary"
              onClick={() => {
                window.location.href = "/avatar";
              }}
            >
              View Avatar
            </button>

            {/* SAVED LOOKS */}
            <button
              className="quick-action-btn quick-action-secondary"
              onClick={() => {
                window.location.href = "/saved-outfits";
              }}
            >
              Saved Looks
            </button>

          </div>

        </section>


      </main>


    </div>
  );
}


export default Dashboard;