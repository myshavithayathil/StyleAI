import { useState } from "react";
import Header from "../components/Header";
import "./Avatar.css";

function Avatar() {

  const savedProfile = JSON.parse(
    localStorage.getItem("profile") || "{}"
  );

  const [profile, setProfile] = useState(savedProfile);


  const handleEdit = () => {
    window.location.href = "/profile";
  };


  return (

    <div className="avatar-page">

      <Header
        logoRoute="/dashboard"
        buttonText="← Dashboard"
        buttonRoute="/dashboard"
      />


      {/* HEADER */}

      <div className="avatar-header">

        <p className="avatar-tag">
          YOUR DIGITAL AVATAR
        </p>

        <h1>
          Meet your
          <br />
          <em>style avatar.</em>
        </h1>

        <p>
          Your avatar is created using the information
          you provided in your profile.
        </p>

      </div>


      {/* AVATAR CONTENT */}

      <div className="avatar-content">


        {/* AVATAR DISPLAY */}

        <div className="avatar-display">

          <div className="avatar-figure">

            <div className="avatar-head"></div>

            <div className="avatar-body"></div>

            <div className="avatar-arm avatar-arm-left"></div>

            <div className="avatar-arm avatar-arm-right"></div>

            <div className="avatar-leg avatar-leg-left"></div>

            <div className="avatar-leg avatar-leg-right"></div>

          </div>

          <p className="avatar-caption">
            YOUR STYLE AVATAR
          </p>

        </div>


        {/* MEASUREMENTS */}

        <div className="measurements-card">

          <h2>
            YOUR MEASUREMENTS
          </h2>


          <div className="measurement-row">

            <span>NAME</span>

            <strong>
              {profile.name || "Not provided"}
            </strong>

          </div>


          <div className="measurement-row">

            <span>HEIGHT</span>

            <strong>
              {profile.height
                ? `${profile.height} cm`
                : "Not provided"}
            </strong>

          </div>


          <div className="measurement-row">

            <span>WEIGHT</span>

            <strong>
              {profile.weight
                ? `${profile.weight} kg`
                : "Not provided"}
            </strong>

          </div>


          <div className="measurement-row">

            <span>BODY TYPE</span>

            <strong>
              {profile.bodyType || "Not provided"}
            </strong>

          </div>


          <div className="measurement-row">

            <span>WAIST</span>

            <strong>
              {profile.waist
                ? `${profile.waist} cm`
                : "Not provided"}
            </strong>

          </div>


          <div className="measurement-row">

            <span>SHOULDER</span>

            <strong>
              {profile.shoulder
                ? `${profile.shoulder} cm`
                : "Not provided"}
            </strong>

          </div>


          <button
            className="edit-button"
            onClick={handleEdit}
          >
            Edit Measurements →
          </button>

        </div>

      </div>

    </div>

  );
}

export default Avatar;