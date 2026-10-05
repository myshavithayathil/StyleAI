import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
    # WARDROBE CATEGORIZATION
    # --------------------------------------------------

    tops = []
    bottoms = []
    shoes = []
    accessories = []

    for item in wardrobe:

        if isinstance(item, str):
            item_name = item
            category = ""
        else:
            item_name = item.get("name", "")
            category = item.get("category", "")

        category_lower = category.lower()
        name_lower = item_name.lower()
        type_lower = item.get("type", "").lower() if isinstance(item, dict) else ""

        if "top" in category_lower or "shirt" in name_lower or "t-shirt" in name_lower:
            tops.append({"name": item_name, "color": item.get("color", ""), "image": item.get("image", "")} if isinstance(item, dict) else item_name)

        elif "bottom" in category_lower or "jeans" in name_lower or "trouser" in name_lower:
            bottoms.append({"name": item_name, "color": item.get("color", ""), "image": item.get("image", "")} if isinstance(item, dict) else item_name)

        elif "shoe" in category_lower or "sneaker" in name_lower or "boot" in name_lower:
            shoes.append({"name": item_name, "color": item.get("color", ""), "image": item.get("image", "")} if isinstance(item, dict) else item_name)

        elif "accessor" in category_lower or any(k in category_lower or k in name_lower or k in type_lower for k in ["earring", "necklace", "bracelet", "watch", "sunglass", "bag", "belt", "scarf", "ring"]):
            accessories.append({
                "name": item_name,
                "color": item.get("color", ""),
                "image": item.get("image", ""),
                "type": item.get("type", "")
            } if isinstance(item, dict) else item_name)

    # --------------------------------------------------
    # BASE OUTFIT
    # --------------------------------------------------

    outfit = {
        "top": "White Oversized Shirt",
        "bottom": "Blue Straight-Leg Jeans",
        "shoes": "White Sneakers",
        "accessory": "Minimal Watch"
    }

    # --------------------------------------------------
    # OCCASION
    # --------------------------------------------------

    if occasion == "Formal":

        outfit = {
            "top": "Elegant Blazer",
            "bottom": "Tailored Trousers",
            "shoes": "Classic Formal Shoes",
            "accessory": "Minimal Watch"
        }

    elif occasion == "Party":

        outfit = {
            "top": "Statement Top",
            "bottom": "Wide-Leg Trousers",
            "shoes": "Stylish Heels",
            "accessory": "Statement Earrings"
        }

    elif occasion == "Wedding":

        outfit = {
            "top": "Elegant Ethnic Kurta",
            "bottom": "Straight Pants",
            "shoes": "Embellished Flats",
            "accessory": "Elegant Earrings"
        }

    # --------------------------------------------------
    # STYLE
    # --------------------------------------------------

    elif style == "Streetwear":

        outfit = {
            "top": "Oversized Graphic T-Shirt",
            "bottom": "Cargo Pants",
            "shoes": "Chunky Sneakers",
            "accessory": "Crossbody Bag"
        }

    elif style == "Elegant":

        outfit = {
            "top": "Satin Blouse",
            "bottom": "Tailored Trousers",
            "shoes": "Pointed-Toe Flats",
            "accessory": "Delicate Jewelry"
        }

    elif style == "Traditional":

        outfit = {
            "top": "Classic Kurta",
            "bottom": "Straight Pants",
            "shoes": "Traditional Flats",
            "accessory": "Ethnic Earrings"
        }

    elif style == "Minimal":

        outfit = {
            "top": "Plain Cotton Shirt",
            "bottom": "Straight-Leg Trousers",
            "shoes": "Clean White Sneakers",
            "accessory": "Minimal Watch"
        }

    elif style == "Trendy":

        outfit = {
            "top": "Oversized Trendy Shirt",
            "bottom": "Wide-Leg Jeans",
            "shoes": "Chunky Sneakers",
            "accessory": "Layered Necklace"
        }

    # --------------------------------------------------
    # WEATHER
    # --------------------------------------------------

    if weather == "Hot":

        outfit["top"] = "Light Cotton Shirt"
        outfit["bottom"] = "Relaxed Linen Pants"
        outfit["shoes"] = "Minimal Sneakers"
        outfit["accessory"] = "Sunglasses"

    elif weather == "Cold":

        outfit["top"] = "Knit Sweater"
        outfit["bottom"] = "Straight-Leg Jeans"
        outfit["shoes"] = "Ankle Boots"
        outfit["accessory"] = "Warm Scarf"

    elif weather == "Warm":

        if occasion not in ["Formal", "Party", "Wedding"]:

            outfit["top"] = "Light Cotton Overshirt"
            outfit["bottom"] = "Straight-Leg Jeans"
            outfit["shoes"] = "White Sneakers"
            outfit["accessory"] = "Minimal Watch"

    # --------------------------------------------------
    # USE WARDROBE ITEMS WHEN AVAILABLE
    # --------------------------------------------------

    if tops:
        outfit["top"] = tops[0]

    if bottoms:
        outfit["bottom"] = bottoms[0]

    if shoes:
        outfit["shoes"] = shoes[0]

    if accessories:
        occasion_lower = occasion.lower()
        preferred_acc_types = []
        if "college" in occasion_lower or "casual" in occasion_lower:
            preferred_acc_types = ["watch", "sunglass", "bracelet", "bag", "necklace"]
        elif "party" in occasion_lower:
            preferred_acc_types = ["earring", "necklace", "bracelet", "bag"]
        elif "date" in occasion_lower:
            preferred_acc_types = ["necklace", "earring", "bracelet", "bag"]
        elif "formal" in occasion_lower or "work" in occasion_lower:
            preferred_acc_types = ["watch", "earring", "necklace", "bag", "belt"]
        elif "wedding" in occasion_lower:
            preferred_acc_types = ["traditional", "ethnic", "earring", "necklace", "bracelet", "ring"]

        selected_acc = accessories[0]
        for acc in accessories:
            name_check = acc.get("name", "").lower() if isinstance(acc, dict) else str(acc).lower()
            type_check = acc.get("type", "").lower() if isinstance(acc, dict) else ""
            combined = f"{type_check} {name_check}"
            if any(pt in combined for pt in preferred_acc_types):
                selected_acc = acc
                break

        outfit["accessory"] = selected_acc

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

            "color_note": color_note

        },

        "outfit": outfit
    }