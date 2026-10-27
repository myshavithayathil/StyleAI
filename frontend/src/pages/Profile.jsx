import { useState } from "react";
import Header from "../components/Header";
import "./Profile.css";

function Profile() {

  const savedProfile = JSON.parse(
    localStorage.getItem("profile") || "{}"
  );

  const [formData, setFormData] = useState({
    name: savedProfile.name || "",
    height: savedProfile.height || "",
    weight: savedProfile.weight || "",
    waist: savedProfile.waist || "",
    shoulder: savedProfile.shoulder || "",
    bodyType: savedProfile.bodyType || "",
    photo: savedProfile.photo || ""
  });


  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };


  const handlePhoto = (event) => {

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      setFormData({
        ...formData,
        photo: reader.result
      });

    };

    reader.readAsDataURL(file);

  };


  const handleContinue = (event) => {

    event.preventDefault();

    localStorage.setItem(
      "profile",
      JSON.stringify(formData)
    );

    window.location.href = "/preferences";

  };


  return (

    <div className="profile-page">

      <Header
        logoRoute="/"
        buttonText="← Home"
        buttonRoute="/"
      />


      {/* MAIN */}

      <main className="profile-container">


        {/* INTRO */}

        <section className="profile-intro">

          <p className="profile-tag">
            LET'S GET TO KNOW YOU
          </p>

          <h1>
            Your body.
            <br />
            <em>Your style.</em>
          </h1>

          <p>
            Tell us a little about yourself so STYLEAI
            can create recommendations that feel made
            specifically for you.
          </p>

        </section>


        {/* FORM */}

        <form
          className="profile-form"
          onSubmit={handleContinue}
        >


          {/* NAME */}

          <div className="form-group">

            <label>
              YOUR NAME
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />

          </div>


          {/* HEIGHT + WEIGHT */}

          <div className="form-row">


            <div className="form-group">

              <label>
                HEIGHT (CM)
              </label>

              <input
                type="number"
                name="height"
                placeholder="e.g. 165"
                value={formData.height}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>
                WEIGHT (KG)
              </label>

              <input
                type="number"
                name="weight"
                placeholder="e.g. 60"
                value={formData.weight}
                onChange={handleChange}
              />

            </div>


          </div>


          {/* WAIST + SHOULDER */}

          <div className="form-row">


            <div className="form-group">

              <label>
                WAIST (CM)
              </label>

              <input
                type="number"
                name="waist"
                placeholder="e.g. 70"
                value={formData.waist}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>
                SHOULDER (CM)
              </label>

              <input
                type="number"
                name="shoulder"
                placeholder="e.g. 40"
                value={formData.shoulder}
                onChange={handleChange}
              />

            </div>


          </div>


          {/* BODY TYPE */}

          <div className="form-group">

            <label>
              BODY TYPE
            </label>

            <select
              name="bodyType"
              value={formData.bodyType}
              onChange={handleChange}
            >

              <option value="">
                Select your body type
              </option>

              <option value="Hourglass">
                Hourglass
              </option>

              <option value="Pear">
                Pear
              </option>

              <option value="Rectangle">
                Rectangle
              </option>

              <option value="Apple">
                Apple
              </option>

              <option value="Inverted Triangle">
                Inverted Triangle
              </option>

            </select>

          </div>


          {/* PHOTO */}

          <div className="photo-section">

            <label>
              YOUR PHOTO
            </label>

            <p>
              Add a photo to help personalize your
              STYLEAI experience.
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
            />


            {formData.photo && (

              <div className="photo-preview">

                <img
                  src={formData.photo}
                  alt="Profile preview"
                />

              </div>

            )}

          </div>


          {/* CONTINUE */}

          <button
            type="submit"
            className="continue-button"
          >
            Continue to Style Preferences →
          </button>


        </form>

      </main>

    </div>

  );
}

export default Profile;