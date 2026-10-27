import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from recommendation import recommend_from_wardrobe

app = FastAPI(title="STYLEAI Backend")

# --------------------------------------------------
# CORS
# --------------------------------------------------

frontend_url = os.getenv("FRONTEND_URL", "").strip()

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

if frontend_url:
    allowed_origins.extend([u.strip() for u in frontend_url.split(",") if u.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if frontend_url else ["*"],
    allow_credentials=True if frontend_url else False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# HOME
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "AI Fashion Stylist Backend is Working!"
    }


# --------------------------------------------------
# OUTFIT RECOMMENDATION
# --------------------------------------------------

@app.post("/recommend-outfit")
def recommend_outfit(data: dict):

    occasion = data.get("occasion", "")
    weather = data.get("weather", "")
    style = data.get("style", "")

    profile = data.get("profile", {})
    preferences = data.get("preferences", {})
    wardrobe = data.get("wardrobe", [])

    body_type = profile.get("bodyType", "")

    preferred_styles = preferences.get("styles", [])
    preferred_colors = preferences.get("colors", [])
    preferred_fit = preferences.get("fit", "")

    # --------------------------------------------------
    # OCCASION-AWARE WARDROBE RECOMMENDATION
    # --------------------------------------------------

    if wardrobe:
        rec_result = recommend_from_wardrobe(
            wardrobe=wardrobe,
            occasion=occasion,
            weather=weather,
            style=style,
            profile=profile,
            preferences=preferences
        )
        outfit = rec_result["outfit"]
        styling_advice = rec_result["styling_advice"]
        outfit_type = rec_result.get("outfit_type", "separates")
    else:
        outfit_type = "fallback"
        styling_advice = "Curated foundational look based on your occasion and style preferences."
        # Fallback when user has not yet uploaded wardrobe items
        outfit = {
            "top": "White Oversized Shirt",
            "bottom": "Blue Straight-Leg Jeans",
            "dress": None,
            "shoes": "White Sneakers",
            "accessory": "Minimal Watch"
        }

        if occasion == "Formal":
            outfit = {
                "top": "Elegant Blazer",
                "bottom": "Tailored Trousers",
                "dress": None,
                "shoes": "Classic Formal Shoes",
                "accessory": "Minimal Watch"
            }
        elif occasion == "Party":
            outfit = {
                "top": "Statement Top",
                "bottom": "Wide-Leg Trousers",
                "dress": None,
                "shoes": "Stylish Heels",
                "accessory": "Statement Earrings"
            }
        elif occasion == "Wedding":
            outfit = {
                "top": None,
                "bottom": None,
                "dress": "Satin Evening Dress",
                "shoes": "Embellished Heels",
                "accessory": "Elegant Earrings"
            }
        elif style == "Streetwear":
            outfit = {
                "top": "Oversized Graphic T-Shirt",
                "bottom": "Cargo Pants",
                "dress": None,
                "shoes": "Chunky Sneakers",
                "accessory": "Crossbody Bag"
            }
        elif style == "Traditional":
            outfit = {
                "top": "Classic Kurta",
                "bottom": "Straight Pants",
                "dress": None,
                "shoes": "Traditional Flats",
                "accessory": "Ethnic Earrings"
            }

    # --------------------------------------------------
    # BODY TYPE NOTE
    # --------------------------------------------------

    body_note = "This outfit creates a balanced and wearable silhouette."

    if body_type == "Hourglass":
        body_note = (
            "The recommendation complements your balanced proportions "
            "while keeping the silhouette defined."
        )

    elif body_type == "Pear":
        body_note = (
            "The recommendation balances the upper and lower body "
            "with a structured top and comfortable bottom."
        )

    elif body_type == "Rectangle":
        body_note = (
            "The recommendation adds structure and definition "
            "to create a more shaped silhouette."
        )

    elif body_type == "Apple":
        body_note = (
            "The recommendation focuses on comfortable silhouettes "
            "and clean vertical lines."
        )

    elif body_type == "Inverted Triangle":
        body_note = (
            "The recommendation balances the upper body with "
            "a proportionate lower silhouette."
        )

    # --------------------------------------------------
    # COLOR NOTE
    # --------------------------------------------------

    if preferred_colors:

        color_note = (
            "Your preferred colours are: "
            + ", ".join(preferred_colors)
            + "."
        )

    else:

        color_note = "Neutral colours are recommended for easy styling."

    # --------------------------------------------------
    # PERSONALIZATION
    # --------------------------------------------------

    return {

        "success": True,

        "outfit_type": outfit_type,

        "request": {
            "occasion": occasion,
            "weather": weather,
            "style": style
        },

        "personalization": {

            "name": profile.get("name", ""),

            "body_type": body_type,

            "preferred_styles": preferred_styles,

            "preferred_fit": preferred_fit,

            "preferred_colors": preferred_colors,

            "wardrobe_items": len(wardrobe),

            "used_wardrobe": bool(wardrobe),

            "body_note": body_note,

            "color_note": color_note,

            "styling_advice": styling_advice

        },

        "outfit": outfit
    }