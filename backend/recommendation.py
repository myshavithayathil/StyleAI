"""
Occasion-aware wardrobe ranking and outfit recommendation engine for STYLEAI.
Evaluates complete outfit combinations using occasion dress codes, formality harmony,
style coherence, and wardrobe metadata.
"""
from typing import Dict, List, Optional, Any


# Canonical occasion aliases
OCCASION_MAPPINGS = {
    "work": ["work", "office", "formal work", "business", "interview", "corporate", "professional"],
    "formal": ["formal", "black tie", "gala", "ceremony", "executive"],
    "party": ["party", "cocktail", "club", "clubbing", "night out", "celebration", "evening", "festive"],
    "wedding": ["wedding", "reception", "marriage", "sangeet", "bridal", "ceremonial"],
    "college": ["college", "campus", "class", "university", "lecture", "student"],
    "casual": ["casual", "casual outing", "everyday", "relaxed", "weekend", "day out", "outing", "errands"],
    "date": ["date", "romantic", "dinner date", "date night"],
}

# Optical aids that must NEVER be recommended as fashion styling accessories
EXCLUDED_ACCESSORIES = [
    "spectacles",
    "glasses",
    "prescription",
    "reading glasses",
    "eyeglasses",
    "specs",
    "optical"
]


def normalize_occasion(raw_occasion: str) -> str:
    """Normalize user occasion string to a canonical occasion key."""
    norm = str(raw_occasion or "").strip().lower()
    for canonical, aliases in OCCASION_MAPPINGS.items():
        if any(alias in norm for alias in aliases):
            return canonical
    return "casual"


def classify_garment(item: Any) -> Dict[str, Any]:
    """
    Examines garment metadata (name, category, type, color) to classify its:
    - primary_category: 'dress', 'top', 'bottom', 'shoes', 'accessory', 'outerwear', 'unknown'
    - sub_type: 'shirt', 'casual_top', 'tank_top', 'statement_top', 'trousers', 'jeans',
                'casual_bottoms', 'skirt', 'formal_dress', 'casual_dress', 'party_dress',
                'formal_shoes', 'casual_shoes', 'athletic_shoes', 'jewelry', 'bag', 'watch', etc.
    - formality: 0 (athletic/lounge), 1 (casual), 2 (smart casual/party), 3 (formal/work/wedding)
    - is_complete_outfit: True for dresses, jumpsuits, sarees, lehengas, etc.
    - is_optical: True for prescription spectacles / reading glasses.
    """
    if isinstance(item, str):
        name = item.strip()
        category = ""
        item_type = ""
        color = ""
        garment_id = None
    elif isinstance(item, dict):
        name = str(item.get("name", "")).strip()
        category = str(item.get("category", "")).strip()
        item_type = str(item.get("type", "")).strip()
        color = str(item.get("color", "")).strip()
        garment_id = item.get("id") or item.get("_id")
    else:
        return {
            "id": None,
            "primary_category": "unknown",
            "sub_type": "unknown",
            "formality": 1,
            "is_complete_outfit": False,
            "is_optical": False,
            "name": "",
            "color": "",
            "raw": item,
            "text": ""
        }

    combined = f"{category} {item_type} {name} {color}".lower()
    name_lower = name.lower()
    cat_lower = category.lower()
    type_lower = item_type.lower()

    # Optical check: sunglasses are fashion accessories; vision spectacles/specs are not
    is_sunglasses = any(k in combined for k in ["sunglass", "sunglasses", "shades"])
    is_optical = any(exc in combined for exc in EXCLUDED_ACCESSORIES) and not is_sunglasses

    # 1. Complete one-piece outfits (dresses, gowns, sarees, lehengas, jumpsuits)
    dress_keywords = [
        "dress", "dresses", "gown", "saree", "sari", "lehenga",
        "anarkali", "jumpsuit", "romper", "kurta set", "salwar suit",
        "sherwani", "maxi dress", "bodycon", "sundress"
    ]
    if (
        any(k in cat_lower for k in ["dress", "dresses"])
        or any(k in type_lower for k in ["dress", "dresses"])
        or any(k in name_lower for k in dress_keywords)
    ):
        # Determine dress sub-type & formality
        if any(k in combined for k in ["satin", "silk", "gown", "wedding", "bridal", "saree", "sari", "lehenga", "anarkali", "formal", "evening", "maxi", "chiffon", "brocade"]):
            sub_type = "formal_dress"
            formality = 3
        elif any(k in combined for k in ["party", "cocktail", "club", "sequin", "glitter", "metallic", "bodycon", "mini"]):
            sub_type = "party_dress"
            formality = 3
        else:
            sub_type = "casual_dress"
            formality = 1

        return {
            "id": garment_id,
            "primary_category": "dress",
            "sub_type": sub_type,
            "formality": formality,
            "is_complete_outfit": True,
            "is_optical": False,
            "name": name,
            "color": color,
            "raw": item,
            "text": combined
        }

    # 2. Footwear / Shoes
    shoe_keywords = [
        "shoe", "shoes", "sneaker", "sneakers", "boot", "boots", "heel", "heels",
        "flat", "flats", "loafer", "loafers", "sandals", "sandal", "pumps", "stiletto",
        "stilettos", "juttis", "footwear", "oxford", "trainers", "mules"
    ]
    if (
        any(k in cat_lower for k in ["shoes", "shoe", "footwear"])
        or any(k in type_lower for k in ["shoes", "shoe", "footwear"])
        or any(k in name_lower for k in shoe_keywords)
    ):
        if any(k in combined for k in ["heel", "heels", "pumps", "stiletto", "stilettos", "oxford", "dress shoe", "formal loafer", "juttis", "formal", "embellished"]):
            sub_type = "formal_shoes"
            formality = 3
        elif any(k in combined for k in ["running", "gym", "sport", "athletic", "trainers"]):
            sub_type = "athletic_shoes"
            formality = 0
        else:
            sub_type = "casual_shoes"
            formality = 1

        return {
            "id": garment_id,
            "primary_category": "shoes",
            "sub_type": sub_type,
            "formality": formality,
            "is_complete_outfit": False,
            "is_optical": False,
            "name": name,
            "color": color,
            "raw": item,
            "text": combined
        }

    # 3. Accessories
    acc_keywords = [
        "earring", "earrings", "necklace", "bracelet", "watch", "sunglass", "sunglasses",
        "handbag", "bag", "belt", "scarf", "ring", "clutch", "bangle", "bangles",
        "pendant", "spectacles", "glasses", "choker", "specs", "potli", "tote"
    ]
    if (
        "accessor" in cat_lower
        or "accessor" in type_lower
        or any(k in name_lower for k in acc_keywords)
    ):
        if is_optical:
            sub_type = "optical"
            formality = 1
        elif any(k in combined for k in ["earring", "earrings", "necklace", "bracelet", "ring", "bangle", "pendant", "choker", "jewelry"]):
            sub_type = "jewelry"
            formality = 2
        elif any(k in combined for k in ["watch"]):
            sub_type = "watch"
            formality = 2
        elif any(k in combined for k in ["clutch", "potli"]):
            sub_type = "formal_bag"
            formality = 3
        elif any(k in combined for k in ["bag", "handbag", "tote", "purse"]):
            sub_type = "bag"
            formality = 2
        elif any(k in combined for k in ["belt"]):
            sub_type = "belt"
            formality = 2
        else:
            sub_type = "casual_acc"
            formality = 1

        return {
            "id": garment_id,
            "primary_category": "accessory",
            "sub_type": sub_type,
            "formality": formality,
            "is_complete_outfit": False,
            "is_optical": is_optical,
            "name": name,
            "color": color,
            "raw": item,
            "text": combined
        }

    # 4. Outerwear
    outerwear_keywords = [
        "blazer", "suit jacket", "coat", "trench", "cardigan", "hoodie", "bomber", "jacket"
    ]
    if (
        "outerwear" in cat_lower
        or any(k in name_lower for k in ["blazer", "suit jacket", "trench coat"])
    ):
        if any(k in combined for k in ["blazer", "suit jacket", "tailored coat", "trench"]):
            sub_type = "formal_outerwear"
            formality = 3
        else:
            sub_type = "casual_outerwear"
            formality = 1

        return {
            "id": garment_id,
            "primary_category": "outerwear",
            "sub_type": sub_type,
            "formality": formality,
            "is_complete_outfit": False,
            "is_optical": False,
            "name": name,
            "color": color,
            "raw": item,
            "text": combined
        }

    # 5. Bottoms
    bottom_keywords = [
        "bottom", "bottoms", "jeans", "trouser", "trousers", "pants", "skirt",
        "shorts", "legging", "leggings", "cargo", "palazzo", "slacks", "chinos",
        "culottes"
    ]
    if (
        any(k in cat_lower for k in ["bottom", "bottoms", "pants", "jeans"])
        or any(k in type_lower for k in ["bottom", "bottoms", "pants", "jeans"])
        or any(k in name_lower for k in bottom_keywords)
    ):
        if any(k in combined for k in ["sweatpants", "joggers", "trackpants", "shorts", "gym", "athletic", "legging", "leggings", "cargo"]):
            sub_type = "casual_bottoms"
            formality = 0
        elif any(k in combined for k in ["jeans", "denim"]):
            sub_type = "jeans"
            formality = 1
        elif any(k in combined for k in ["skirt", "pencil skirt"]):
            sub_type = "skirt"
            formality = 3 if "pencil" in combined or "formal" in combined else 2
        elif any(k in combined for k in ["trouser", "trousers", "pants", "formal pants", "tailored", "slacks", "chinos", "dress pants", "suit pants", "pleated pants", "office pants"]):
            sub_type = "trousers"
            formality = 3
        else:
            sub_type = "casual_bottoms"
            formality = 1

        return {
            "id": garment_id,
            "primary_category": "bottom",
            "sub_type": sub_type,
            "formality": formality,
            "is_complete_outfit": False,
            "is_optical": False,
            "name": name,
            "color": color,
            "raw": item,
            "text": combined
        }

    # 6. Tops
    top_keywords = [
        "top", "tops", "shirt", "t-shirt", "tshirt", "tee", "blouse", "sweater",
        "tank", "camisole", "crop", "corset", "halter", "tunic", "hoodie", "cardigan",
        "kurta", "polo", "henley"
    ]
    if (
        any(k in cat_lower for k in ["top", "tops", "shirt", "t-shirt"])
        or any(k in type_lower for k in ["top", "tops", "shirt", "t-shirt"])
        or any(k in name_lower for k in top_keywords)
        or True  # Default fallback for clothing
    ):
        # Distinguish top sub-types
        is_statement = any(
            k in combined for k in [
                "one shoulder", "one-shoulder", "off shoulder", "off-shoulder",
                "party top", "party", "corset", "halter", "halterneck",
                "sequin", "glitter", "metallic", "backless", "tube top",
                "bustier", "cutout", "glam", "club", "cocktail", "going out",
                "date top", "date", "evening top", "satin top", "silk top",
                "lace top", "crop top", "cami top", "sweetheart", "cowl neck",
                "draped top"
            ]
        )
        is_shirt = any(
            k in combined for k in [
                "shirt", "button down", "button-down", "buttondown",
                "collared", "oxford", "formal shirt", "dress shirt",
                "blouse", "formal blouse", "work blouse", "formal top"
            ]
        )
        is_tank = any(
            k in combined for k in [
                "tank top", "tank", "camisole", "cami", "ribbed tank",
                "cotton tank", "basic tank", "undershirt", "white tank top"
            ]
        )
        is_casual_tee = any(
            k in combined for k in [
                "t-shirt", "tshirt", "tee", "casual top", "polo", "henley", "cotton top"
            ]
        )

        if is_statement:
            sub_type = "statement_top"
            formality = 2
        elif is_shirt:
            sub_type = "shirt"
            formality = 3
        elif is_tank:
            sub_type = "tank_top"
            formality = 1
        elif is_casual_tee:
            sub_type = "casual_top"
            formality = 1
        else:
            sub_type = "casual_top"
            formality = 1

        return {
            "id": garment_id,
            "primary_category": "top",
            "sub_type": sub_type,
            "formality": formality,
            "is_complete_outfit": False,
            "is_optical": False,
            "name": name,
            "color": color,
            "raw": item,
            "text": combined
        }


def score_garment_for_occasion(
    garment: Dict[str, Any],
    occ: str,
    preferred_colors: Optional[List[str]] = None,
    preferred_styles: Optional[List[str]] = None
) -> float:
    """
    Evaluates individual garment suitability for a specific occasion.
    Uses occasion dress code expectations, sub-type formality, and keywords.
    """
    if preferred_colors is None:
        preferred_colors = []
    if preferred_styles is None:
        preferred_styles = []

    sub_type = garment["sub_type"]
    cat = garment["primary_category"]
    text = garment["text"]
    color = garment["color"].lower()
    score = 0.0

    # Optical items: completely excluded
    if garment.get("is_optical"):
        return -999.0

    # ----------------------------------------------------
    # WORK / FORMAL WORK / OFFICE
    # ----------------------------------------------------
    if occ in ["work", "formal"]:
        if sub_type == "shirt":
            score += 55.0
        elif sub_type == "trousers":
            score += 55.0
        elif sub_type == "formal_outerwear":
            score += 45.0
        elif sub_type == "formal_dress":
            if any(k in text for k in ["satin", "silk", "gown", "evening", "cocktail", "party", "backless", "sequin", "slit"]):
                score -= 50.0  # Satin/evening/party dresses are inappropriate for daytime office work
            else:
                score += 35.0  # Conservative professional day dress
        elif sub_type == "formal_shoes":
            score += 30.0
        elif sub_type in ["watch", "belt"]:
            score += 20.0
        elif sub_type == "jewelry":
            score += 15.0

        # Severe penalties for casual/revealing/gym items in professional contexts
        if sub_type == "tank_top":
            score -= 65.0
        elif sub_type == "statement_top":
            score -= 60.0  # Asymmetric / party / club tops are inappropriate for work
        elif sub_type == "casual_bottoms":
            score -= 65.0
        elif sub_type == "jeans":
            score -= 25.0  # Trousers are much preferred for work
        elif sub_type == "athletic_shoes":
            score -= 40.0
        elif sub_type == "casual_acc":
            score -= 30.0

    # ----------------------------------------------------
    # CASUAL OUTING / EVERYDAY
    # ----------------------------------------------------
    elif occ == "casual":
        if sub_type == "casual_top":
            score += 48.0
        elif sub_type == "tank_top":
            score += 40.0
        elif sub_type == "jeans":
            score += 45.0
        elif sub_type == "casual_bottoms":
            score += 30.0
        elif sub_type == "casual_dress":
            score += 40.0
        elif sub_type == "casual_shoes":
            score += 30.0
        elif sub_type in ["casual_acc", "watch"]:
            score += 15.0

        # Penalties: statement party tops and heavy formal gowns are out of place for casual outings
        if sub_type == "statement_top":
            score -= 60.0  # Asymmetric / party tops (e.g. pink one shoulder top) are inappropriate for daytime casual
        elif sub_type == "formal_dress":
            score -= 60.0
        elif sub_type == "trousers":
            score -= 10.0  # Jeans preferred over formal slacks
        elif sub_type == "formal_shoes":
            score -= 35.0

    # ----------------------------------------------------
    # PARTY / NIGHT OUT / CELEBRATION
    # ----------------------------------------------------
    elif occ == "party":
        if sub_type == "statement_top":
            score += 70.0
        elif sub_type == "party_dress":
            score += 70.0
        elif sub_type == "formal_dress":
            score += 45.0
        elif sub_type in ["jeans", "skirt"]:
            score += 45.0
        elif sub_type == "trousers":
            score += 40.0
        elif sub_type == "formal_shoes":
            score += 35.0
        elif sub_type == "jewelry":
            score += 25.0

        # Penalties for plain basics and corporate workwear
        if sub_type == "shirt":
            score -= 35.0  # Stiff office shirt is inappropriate for a party / celebration
        elif sub_type == "tank_top" and not any(k in text for k in ["party", "glam", "satin", "metallic", "sequin"]):
            score -= 60.0
        elif sub_type == "casual_top":
            score -= 30.0
        elif sub_type == "casual_bottoms":
            score -= 50.0
        elif sub_type == "athletic_shoes":
            score -= 40.0

        # Party color bonus (brown, black, gold, silver, burgundy, emerald)
        if any(c in text for c in ["brown", "black", "gold", "silver", "wine", "burgundy", "red", "emerald"]):
            score += 15.0

    # ----------------------------------------------------
    # WEDDING / CEREMONIAL
    # ----------------------------------------------------
    elif occ == "wedding":
        if sub_type == "formal_dress":
            score += 80.0
        elif sub_type == "formal_shoes":
            score += 40.0
        elif sub_type in ["jewelry", "formal_bag"]:
            score += 35.0

        if any(k in text for k in ["satin dress", "silk dress", "wedding gown", "evening gown", "saree", "lehenga", "anarkali"]):
            score += 25.0

        # Severe penalties: casual pieces have no place at a wedding
        if sub_type in ["tank_top", "casual_top", "statement_top"]:
            score -= 85.0
        elif sub_type in ["jeans", "casual_bottoms"]:
            score -= 85.0
        elif sub_type in ["athletic_shoes", "casual_shoes"]:
            score -= 70.0
        elif sub_type == "casual_acc":
            score -= 50.0

    # ----------------------------------------------------
    # COLLEGE / CAMPUS
    # ----------------------------------------------------
    elif occ == "college":
        if sub_type == "casual_top":
            score += 50.0
        elif sub_type == "tank_top":
            score += 38.0
        elif sub_type == "jeans":
            score += 45.0
        elif sub_type == "casual_shoes":
            score += 35.0
        elif sub_type in ["casual_outerwear", "watch"]:
            score += 20.0

        if sub_type in ["formal_dress", "formal_shoes"]:
            score -= 50.0
        elif sub_type == "statement_top":
            score -= 60.0  # Asymmetric / party tops (e.g. pink one shoulder top) are inappropriate for college

    # ----------------------------------------------------
    # DATE / ROMANTIC
    # ----------------------------------------------------
    elif occ == "date":
        if sub_type == "statement_top":
            score += 65.0
        elif sub_type in ["party_dress", "formal_dress"]:
            score += 65.0
        elif sub_type == "casual_dress":
            score += 45.0
        elif sub_type in ["jeans", "skirt"]:
            score += 45.0
        elif sub_type == "trousers":
            score += 35.0
        elif sub_type == "formal_shoes":
            score += 30.0
        elif sub_type == "casual_shoes":
            score += 20.0
        elif sub_type == "jewelry":
            score += 25.0

        # Penalties for corporate workwear and sloppy loungewear on a romantic date
        if sub_type == "shirt":
            score -= 25.0  # Stiff corporate button-down shirt is unromantic
        elif sub_type == "tank_top" and not any(k in text for k in ["party", "glam", "satin", "metallic", "sequin", "lace", "silk"]):
            score -= 40.0
        elif sub_type in ["casual_bottoms", "athletic_shoes"]:
            score -= 50.0

        # Date romantic color bonus (pink, red, black, burgundy, wine, emerald, champagne, rose)
        if any(c in text for c in ["pink", "red", "black", "burgundy", "wine", "emerald", "champagne", "rose"]):
            score += 10.0

    # ----------------------------------------------------
    # USER PREFERENCES BONUSES
    # ----------------------------------------------------
    if color and preferred_colors:
        if any(pc in color or color in pc for pc in preferred_colors):
            score += 5.0

    if preferred_styles:
        if any(ps in text for ps in preferred_styles):
            score += 10.0

    return score


def evaluate_color_harmony(color1: str, color2: str, preferred_colors: List[str]) -> float:
    """Evaluates colour coordination between two garments."""
    c1 = color1.lower().strip()
    c2 = color2.lower().strip()
    score = 0.0

    if not c1 or not c2:
        return 5.0

    # Bonus if either matches user preferred colors
    if preferred_colors:
        if any(pc in c1 for pc in preferred_colors):
            score += 5.0
        if any(pc in c2 for pc in preferred_colors):
            score += 5.0

    # Universal versatile neutrals
    neutrals = ["white", "black", "grey", "gray", "navy", "blue", "beige", "brown", "cream", "denim", "khaki"]
    is_c1_neutral = any(n in c1 for n in neutrals)
    is_c2_neutral = any(n in c2 for n in neutrals)

    if is_c1_neutral and is_c2_neutral:
        score += 10.0  # Timeless neutral pairing
    elif is_c1_neutral or is_c2_neutral:
        score += 8.0   # Anchor neutral with colored piece
    elif c1 == c2:
        score += 8.0   # Coordinated monochrome / tonal ensemble
    else:
        score += 3.0

    return score


def score_outfit_combination(
    candidate: Dict[str, Any],
    occ: str,
    preferred_colors: List[str],
    preferred_styles: List[str]
) -> float:
    """
    Evaluates a candidate outfit combination as an integrated whole:
    Occasion suitability + Formality harmony + Style coherence + Colour harmony.
    """
    total_score = 0.0

    if candidate["type"] == "dress":
        dress = candidate["classified_dress"]
        dress_score = score_garment_for_occasion(dress, occ, preferred_colors, preferred_styles)
        total_score += dress_score

        # Complete one-piece outfit bonus
        total_score += 30.0

        # Special wedding boost: a formal dress is the ultimate complete wedding look
        if occ == "wedding" and dress["sub_type"] == "formal_dress":
            total_score += 40.0

        # Special party and date boost for elevated dresses
        if occ in ["party", "date"] and dress["sub_type"] in ["party_dress", "formal_dress"]:
            total_score += 35.0

        # Severe penalty if an evening/satin/cocktail dress is considered for office work
        if occ in ["work", "formal"] and any(k in dress["text"] for k in ["satin", "silk", "gown", "cocktail", "party", "evening"]):
            total_score -= 40.0

        # If any separate tops or bottoms are erroneously included, heavily penalize
        if candidate.get("top") is not None or candidate.get("bottom") is not None:
            return -999.0

    else:
        # Separates: Top + Bottom
        top = candidate["classified_top"]
        bottom = candidate["classified_bottom"]

        top_score = score_garment_for_occasion(top, occ, preferred_colors, preferred_styles)
        bottom_score = score_garment_for_occasion(bottom, occ, preferred_colors, preferred_styles)
        total_score += (top_score + bottom_score)

        # 1. Formality Harmony
        formality_diff = abs(top["formality"] - bottom["formality"])
        if formality_diff == 0:
            total_score += 20.0  # Perfect harmony (e.g. formal shirt + formal trousers, or tee + jeans)
        elif formality_diff == 1:
            if occ in ["party", "date"]:
                total_score += 20.0  # High-low statement top + denim is standard chic party/date formula
            else:
                total_score += 10.0   # Acceptable smart casual pairing
        else:
            total_score -= 40.0  # Severe mismatch (e.g. formal trousers + basic tank top)

        # 2. Style Coherence & Synergies
        # Professional synergy: Work shirt + formal trousers
        if occ in ["work", "formal"] and top["sub_type"] == "shirt" and bottom["sub_type"] == "trousers":
            total_score += 40.0

        # Incompatible pairing: Tank top + formal trousers
        if top["sub_type"] == "tank_top" and bottom["sub_type"] == "trousers":
            total_score -= 50.0

        # Casual synergy: Casual top/tank + jeans for casual outing or college
        if occ in ["casual", "college"] and top["sub_type"] in ["casual_top", "tank_top"] and bottom["sub_type"] == "jeans":
            total_score += 30.0

        # Party synergy: Statement top + jeans/skirt/trousers for party
        if occ == "party" and top["sub_type"] == "statement_top" and bottom["sub_type"] in ["jeans", "skirt"]:
            total_score += 50.0
        elif occ == "party" and top["sub_type"] == "statement_top" and bottom["sub_type"] == "trousers":
            total_score += 40.0

        # Party penalty: Stiff corporate office shirt + trousers at a party
        if occ == "party" and top["sub_type"] == "shirt" and bottom["sub_type"] == "trousers":
            total_score -= 50.0

        # Party penalty: Generic plain tank top + jeans for party
        if occ == "party" and top["sub_type"] == "tank_top":
            total_score -= 50.0

        # Date synergy: Statement top + jeans/skirt/trousers for date
        if occ == "date" and top["sub_type"] == "statement_top" and bottom["sub_type"] in ["jeans", "skirt"]:
            total_score += 50.0
        elif occ == "date" and top["sub_type"] == "statement_top" and bottom["sub_type"] == "trousers":
            total_score += 40.0

        # Date penalty: Stiff corporate office shirt + trousers on a romantic date
        if occ == "date" and top["sub_type"] == "shirt" and bottom["sub_type"] == "trousers":
            total_score -= 45.0

        # Casual / college penalty: Asymmetric / party statement top on a casual outing or college
        if occ in ["casual", "college"] and top["sub_type"] == "statement_top":
            total_score -= 40.0

        # Wedding penalty: Casual separates (jeans, tank top) on a wedding
        if occ == "wedding":
            total_score -= 80.0

        # 3. Colour Coordination
        color_harmony = evaluate_color_harmony(top["color"], bottom["color"], preferred_colors)
        total_score += color_harmony

    # Footwear integration (if present)
    shoes = candidate.get("classified_shoes")
    if shoes:
        shoe_score = score_garment_for_occasion(shoes, occ, preferred_colors, preferred_styles)
        # Avoid clashing athletic sneakers with formal wedding/work looks
        if occ in ["wedding", "formal", "work"] and shoes["sub_type"] == "athletic_shoes":
            total_score -= 50.0
        else:
            total_score += shoe_score * 0.3

    # Accessory integration (strictly optional)
    acc = candidate.get("classified_accessory")
    if acc:
        if acc["is_optical"]:
            total_score -= 999.0
        else:
            acc_score = score_garment_for_occasion(acc, occ, preferred_colors, preferred_styles)
            if acc_score > 0:
                total_score += acc_score * 0.25

    return total_score


def format_item_output(item: Any) -> Optional[Dict[str, Any]]:
    """Format garment object for frontend rendering, preserving id, category, image, and metadata."""
    if not item:
        return None
    if isinstance(item, str):
        return {"name": item, "color": "", "image": "", "category": "", "type": ""}
    if isinstance(item, dict):
        res = {
            "name": str(item.get("name", "")),
            "color": str(item.get("color", "")),
            "image": str(item.get("image", "")),
            "category": str(item.get("category", "")),
            "type": str(item.get("type", ""))
        }
        if "id" in item:
            res["id"] = item["id"]
        elif "_id" in item:
            res["id"] = item["_id"]
        return res
    return None


def recommend_from_wardrobe(
    wardrobe: List[Any],
    occasion: str,
    weather: str = "",
    style: str = "",
    profile: Optional[Dict[str, Any]] = None,
    preferences: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Generates an intelligent, occasion-aware outfit recommendation from the user's wardrobe.
    Evaluates complete outfit combinations across occasions, formality, and style coherence.
    """
    if profile is None:
        profile = {}
    if preferences is None:
        preferences = {}

    occ = normalize_occasion(occasion)
    preferred_colors = [str(c).lower().strip() for c in preferences.get("colors", []) if c]
    preferred_styles = [str(s).lower().strip() for s in preferences.get("styles", []) if s]

    if not wardrobe:
        return {
            "outfit": {
                "top": None,
                "bottom": None,
                "dress": None,
                "shoes": None,
                "accessory": None
            },
            "outfit_type": "none",
            "styling_advice": "Add clothes to your wardrobe to receive personalized outfit recommendations."
        }

    # 1. Classify all wardrobe items
    classified_items = [classify_garment(item) for item in wardrobe]

    dresses = [i for i in classified_items if i["primary_category"] == "dress"]
    tops = [i for i in classified_items if i["primary_category"] == "top"]
    bottoms = [i for i in classified_items if i["primary_category"] == "bottom"]
    shoes_list = [i for i in classified_items if i["primary_category"] == "shoes"]
    accessories_list = [
        i for i in classified_items
        if i["primary_category"] == "accessory" and not i["is_optical"]
    ]

    # Find best shoes and accessory candidates
    best_shoes = None
    if shoes_list:
        ranked_shoes = sorted(
            shoes_list,
            key=lambda s: score_garment_for_occasion(s, occ, preferred_colors, preferred_styles),
            reverse=True
        )
        top_shoe = ranked_shoes[0]
        # Only attach if score is not severely clashing
        if score_garment_for_occasion(top_shoe, occ, preferred_colors, preferred_styles) > -20:
            best_shoes = top_shoe

    best_accessory = None
    if accessories_list:
        ranked_accs = sorted(
            accessories_list,
            key=lambda a: score_garment_for_occasion(a, occ, preferred_colors, preferred_styles),
            reverse=True
        )
        top_acc = ranked_accs[0]
        # Only attach accessory if suitability score is strictly positive
        if score_garment_for_occasion(top_acc, occ, preferred_colors, preferred_styles) > 0:
            best_accessory = top_acc

    # 2. Build candidate complete outfits
    candidates: List[Dict[str, Any]] = []

    # Candidate Type A: Dresses (One-piece complete outfits)
    for d in dresses:
        candidates.append({
            "type": "dress",
            "dress": d["raw"],
            "top": None,
            "bottom": None,
            "shoes": best_shoes["raw"] if best_shoes else None,
            "accessory": best_accessory["raw"] if best_accessory else None,
            "classified_dress": d,
            "classified_shoes": best_shoes,
            "classified_accessory": best_accessory
        })

    # Candidate Type B: Separates (Top + Bottom combinations)
    for t in tops:
        for b in bottoms:
            candidates.append({
                "type": "separates",
                "dress": None,
                "top": t["raw"],
                "bottom": b["raw"],
                "shoes": best_shoes["raw"] if best_shoes else None,
                "accessory": best_accessory["raw"] if best_accessory else None,
                "classified_top": t,
                "classified_bottom": b,
                "classified_shoes": best_shoes,
                "classified_accessory": best_accessory
            })

    # Fallback if only tops or only bottoms exist
    if not candidates:
        if tops:
            best_t = max(tops, key=lambda t: score_garment_for_occasion(t, occ, preferred_colors, preferred_styles))
            candidates.append({
                "type": "separates",
                "dress": None,
                "top": best_t["raw"],
                "bottom": None,
                "shoes": best_shoes["raw"] if best_shoes else None,
                "accessory": best_accessory["raw"] if best_accessory else None,
                "classified_top": best_t,
                "classified_bottom": {
                    "primary_category": "bottom", "sub_type": "unknown", "formality": 1,
                    "is_complete_outfit": False, "is_optical": False, "name": "", "color": "", "raw": None, "text": ""
                },
                "classified_shoes": best_shoes,
                "classified_accessory": best_accessory
            })
        elif bottoms:
            best_b = max(bottoms, key=lambda b: score_garment_for_occasion(b, occ, preferred_colors, preferred_styles))
            candidates.append({
                "type": "separates",
                "dress": None,
                "top": None,
                "bottom": best_b["raw"],
                "shoes": best_shoes["raw"] if best_shoes else None,
                "accessory": best_accessory["raw"] if best_accessory else None,
                "classified_top": {
                    "primary_category": "top", "sub_type": "unknown", "formality": 1,
                    "is_complete_outfit": False, "is_optical": False, "name": "", "color": "", "raw": None, "text": ""
                },
                "classified_bottom": best_b,
                "classified_shoes": best_shoes,
                "classified_accessory": best_accessory
            })

    if not candidates:
        return {
            "outfit": {
                "top": None,
                "bottom": None,
                "dress": None,
                "shoes": None,
                "accessory": None
            },
            "outfit_type": "none",
            "styling_advice": "No suitable combination found in your wardrobe for this occasion."
        }

    # 3. Score all candidates using holistic combination ranking
    for cand in candidates:
        cand["score"] = score_outfit_combination(cand, occ, preferred_colors, preferred_styles)

    # Sort descending by combination score
    candidates.sort(key=lambda c: c["score"], reverse=True)
    best_candidate = candidates[0]

    # Format advice
    if best_candidate["type"] == "dress":
        dress_name = best_candidate["classified_dress"]["name"] or "Dress"
        styling_advice = f"Selected {dress_name} as a complete, occasion-appropriate outfit for {occasion}."
    else:
        top_name = best_candidate["classified_top"]["name"] if best_candidate.get("classified_top") else "top"
        bottom_name = best_candidate["classified_bottom"]["name"] if best_candidate.get("classified_bottom") else "bottom"
        if top_name and bottom_name:
            styling_advice = f"Paired {top_name} with {bottom_name} to create a stylish, occasion-ready look for {occasion}."
        elif top_name:
            styling_advice = f"Selected {top_name} for your {occasion} look."
        else:
            styling_advice = f"Selected {bottom_name} for your {occasion} look."

    return {
        "outfit": {
            "top": format_item_output(best_candidate.get("top")),
            "bottom": format_item_output(best_candidate.get("bottom")),
            "dress": format_item_output(best_candidate.get("dress")),
            "shoes": format_item_output(best_candidate.get("shoes")),
            "accessory": format_item_output(best_candidate.get("accessory"))
        },
        "outfit_type": best_candidate["type"],
        "styling_advice": styling_advice
    }
