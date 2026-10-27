"""
Comprehensive regression and unit tests for STYLEAI outfit recommendation engine.
Tests cover:
- Work: prefers shirt + formal trousers over tank top
- Casual outing: prefers casual basic over statement one-shoulder top
- Party: prioritizes party top over generic tank top
- Wedding: recommends satin dress alone as complete outfit without separates or spectacles
- Optical spectacles exclusion across all occasions
- Contextual accessory selection (included only when suitable)
- Incomplete metadata handling
- Avoidance of incompatible combinations
- Robust garment classification
"""
import unittest
from recommendation import (
    recommend_from_wardrobe,
    classify_garment,
    normalize_occasion,
)


class TestOutfitRecommendations(unittest.TestCase):

    def setUp(self):
        self.wardrobe = [
            {"id": 1, "name": "White Tank Top", "category": "Tops", "color": "White"},
            {"id": 2, "name": "Jeans", "category": "Bottoms", "color": "Blue"},
            {"id": 3, "name": "Spectacles", "category": "Accessories", "color": "Black"},
            {"id": 4, "name": "Brown Party Top", "category": "Tops", "color": "Brown"},
            {"id": 5, "name": "Satin Dress", "category": "Dresses", "color": "Champagne"},
            {"id": 6, "name": "Formal Pants", "category": "Bottoms", "color": "Black"},
            {"id": 7, "name": "White Shirt", "category": "Tops", "color": "White"},
            {"id": 8, "name": "Pink One Shoulder Top", "category": "Tops", "color": "Pink"},
        ]

    # ----------------------------------------------------
    # TEST 1: Work: prefers shirt + formal trousers over tank top
    # ----------------------------------------------------
    def test_work_outfit_prefers_shirt_and_formal_pants_over_tank_top(self):
        wardrobe = [
            {"id": 1, "name": "White Tank Top", "category": "Tops"},
            {"id": 2, "name": "Formal Pants", "category": "Bottoms"},
            {"id": 3, "name": "Shirt", "category": "Tops"},
        ]
        result = recommend_from_wardrobe(wardrobe=wardrobe, occasion="Work")
        outfit = result["outfit"]

        self.assertIsNotNone(outfit.get("top"))
        self.assertEqual(outfit["top"]["name"], "Shirt")
        self.assertNotEqual(outfit["top"]["name"], "White Tank Top")
        self.assertIsNotNone(outfit.get("bottom"))
        self.assertEqual(outfit["bottom"]["name"], "Formal Pants")
        self.assertIsNone(outfit.get("dress"))

    # ----------------------------------------------------
    # TEST 2: Casual outing: prefers casual basic over statement one-shoulder top
    # ----------------------------------------------------
    def test_casual_outing_prefers_casual_basic_over_statement_top(self):
        wardrobe = [
            {"id": 1, "name": "Pink One Shoulder Top", "category": "Tops"},
            {"id": 2, "name": "Jeans", "category": "Bottoms"},
            {"id": 3, "name": "White Casual Tank Top", "category": "Tops"},
        ]
        result = recommend_from_wardrobe(wardrobe=wardrobe, occasion="Casual Outing")
        outfit = result["outfit"]

        self.assertIsNotNone(outfit.get("top"))
        self.assertEqual(outfit["top"]["name"], "White Casual Tank Top")
        self.assertNotEqual(outfit["top"]["name"], "Pink One Shoulder Top")
        self.assertIsNotNone(outfit.get("bottom"))
        self.assertEqual(outfit["bottom"]["name"], "Jeans")

    # ----------------------------------------------------
    # TEST 3: Party: prioritizes party top over generic white tank top
    # ----------------------------------------------------
    def test_party_outfit_prioritizes_party_top_over_generic_tank(self):
        wardrobe = [
            {"id": 1, "name": "White Tank Top", "category": "Tops"},
            {"id": 2, "name": "Jeans", "category": "Bottoms"},
            {"id": 3, "name": "Brown Party Top", "category": "Tops"},
            {"id": 4, "name": "Spectacles", "category": "Accessories"},
        ]
        result = recommend_from_wardrobe(wardrobe=wardrobe, occasion="Party")
        outfit = result["outfit"]

        self.assertIsNotNone(outfit.get("top"))
        self.assertEqual(outfit["top"]["name"], "Brown Party Top")
        self.assertNotEqual(outfit["top"]["name"], "White Tank Top")
        self.assertIsNotNone(outfit.get("bottom"))
        self.assertEqual(outfit["bottom"]["name"], "Jeans")
        # Spectacles must NOT be included
        self.assertIsNone(outfit.get("accessory"))

    # ----------------------------------------------------
    # TEST 4: Wedding: recommends satin dress alone as complete outfit
    # ----------------------------------------------------
    def test_wedding_outfit_recommends_satin_dress_alone(self):
        wardrobe = [
            {"id": 1, "name": "White Tank Top", "category": "Tops"},
            {"id": 2, "name": "Jeans", "category": "Bottoms"},
            {"id": 3, "name": "Satin Dress", "category": "Dresses"},
            {"id": 4, "name": "Spectacles", "category": "Accessories"},
        ]
        result = recommend_from_wardrobe(wardrobe=wardrobe, occasion="Wedding")
        outfit = result["outfit"]

        self.assertIsNotNone(outfit.get("dress"))
        self.assertEqual(outfit["dress"]["name"], "Satin Dress")
        # Complete outfit: no separate tops or bottoms
        self.assertIsNone(outfit.get("top"))
        self.assertIsNone(outfit.get("bottom"))
        # Spectacles excluded
        self.assertIsNone(outfit.get("accessory"))
        self.assertEqual(result["outfit_type"], "dress")

    # ----------------------------------------------------
    # TEST 5: Spectacles are NEVER recommended across any occasion
    # ----------------------------------------------------
    def test_spectacles_never_recommended(self):
        occasions = ["Work", "Casual Outing", "Party", "Wedding", "College", "Date", "Formal"]
        wardrobe = [
            {"id": 1, "name": "White Shirt", "category": "Tops"},
            {"id": 2, "name": "Jeans", "category": "Bottoms"},
            {"id": 3, "name": "Reading Glasses", "category": "Accessories"},
            {"id": 4, "name": "Spectacles", "category": "Accessories"},
            {"id": 5, "name": "Prescription Specs", "category": "Accessories"},
        ]
        for occ in occasions:
            result = recommend_from_wardrobe(wardrobe=wardrobe, occasion=occ)
            acc = result["outfit"].get("accessory")
            if acc:
                name_low = acc["name"].lower()
                self.assertNotIn("spectacle", name_low)
                self.assertNotIn("glasses", name_low)
                self.assertNotIn("specs", name_low)

    # ----------------------------------------------------
    # TEST 6: Appropriate accessory is added when suitable, omitted when none suitable
    # ----------------------------------------------------
    def test_contextual_accessory_handling(self):
        # 1. Wardrobe without suitable accessory -> accessory is None
        wardrobe_no_acc = [
            {"id": 1, "name": "White Shirt", "category": "Tops"},
            {"id": 2, "name": "Formal Pants", "category": "Bottoms"},
        ]
        res1 = recommend_from_wardrobe(wardrobe_no_acc, occasion="Work")
        self.assertIsNone(res1["outfit"].get("accessory"))

        # 2. Wardrobe with matching jewelry -> included for Party
        wardrobe_with_jewel = wardrobe_no_acc + [
            {"id": 3, "name": "Gold Statement Earrings", "category": "Accessories"}
        ]
        res2 = recommend_from_wardrobe(wardrobe_with_jewel, occasion="Party")
        self.assertIsNotNone(res2["outfit"].get("accessory"))
        self.assertEqual(res2["outfit"]["accessory"]["name"], "Gold Statement Earrings")

    # ----------------------------------------------------
    # TEST 7: Avoidance of incompatible combinations (formality mismatch)
    # ----------------------------------------------------
    def test_avoidance_of_incompatible_combinations(self):
        # If user has Formal Pants, Jeans, White Tank Top, and Collared Shirt
        # For Work: system MUST pick (Collared Shirt + Formal Pants) and NOT (Tank Top + Formal Pants)
        wardrobe = [
            {"id": 1, "name": "White Tank Top", "category": "Tops"},
            {"id": 2, "name": "Formal Pants", "category": "Bottoms"},
            {"id": 3, "name": "Collared Shirt", "category": "Tops"},
            {"id": 4, "name": "Jeans", "category": "Bottoms"},
        ]
        res_work = recommend_from_wardrobe(wardrobe, occasion="Work")
        self.assertEqual(res_work["outfit"]["top"]["name"], "Collared Shirt")
        self.assertEqual(res_work["outfit"]["bottom"]["name"], "Formal Pants")

        # For Casual Outing: system MUST pick (White Tank Top + Jeans)
        res_casual = recommend_from_wardrobe(wardrobe, occasion="Casual Outing")
        self.assertEqual(res_casual["outfit"]["top"]["name"], "White Tank Top")
        self.assertEqual(res_casual["outfit"]["bottom"]["name"], "Jeans")

    # ----------------------------------------------------
    # TEST 8: Incomplete metadata handling
    # ----------------------------------------------------
    def test_incomplete_metadata_handling(self):
        # Item with only name (no category, no color)
        wardrobe = [
            {"name": "Shirt"},
            {"name": "Formal Pants"},
            {"name": "Tank Top"},
        ]
        result = recommend_from_wardrobe(wardrobe, occasion="Work")
        self.assertEqual(result["outfit"]["top"]["name"], "Shirt")
        self.assertEqual(result["outfit"]["bottom"]["name"], "Formal Pants")

    # ----------------------------------------------------
    # TEST 9: Classification accuracy across garment categories
    # ----------------------------------------------------
    def test_garment_classification_accuracy(self):
        c1 = classify_garment({"name": "Button-down Shirt", "category": "Tops"})
        self.assertEqual(c1["primary_category"], "top")
        self.assertEqual(c1["sub_type"], "shirt")
        self.assertEqual(c1["formality"], 3)

        c2 = classify_garment({"name": "Pink One Shoulder Top", "category": "Tops"})
        self.assertEqual(c2["primary_category"], "top")
        self.assertEqual(c2["sub_type"], "statement_top")

        c3 = classify_garment({"name": "White Tank Top", "category": "Tops"})
        self.assertEqual(c3["primary_category"], "top")
        self.assertEqual(c3["sub_type"], "tank_top")

        c4 = classify_garment({"name": "Tailored Trousers", "category": "Bottoms"})
        self.assertEqual(c4["primary_category"], "bottom")
        self.assertEqual(c4["sub_type"], "trousers")
        self.assertEqual(c4["formality"], 3)

        c5 = classify_garment({"name": "Satin Dress", "category": "Dresses"})
        self.assertEqual(c5["primary_category"], "dress")
        self.assertTrue(c5["is_complete_outfit"])

        c6 = classify_garment({"name": "Spectacles", "category": "Accessories"})
        self.assertTrue(c6["is_optical"])

        c7 = classify_garment({"name": "Sunglasses", "category": "Accessories"})
        self.assertFalse(c7["is_optical"])

    # ----------------------------------------------------
    # TEST 10: Regression - College and Casual: Burgundy Top beats Pink One Shoulder Top
    # ----------------------------------------------------
    def test_casual_and_college_prefers_burgundy_top_over_pink_one_shoulder(self):
        wardrobe = [
            {"id": "top_burgundy", "name": "Burgundy Top", "category": "Tops", "color": "Burgundy"},
            {"id": "top_pink_os", "name": "Pink One Shoulder Top", "category": "Tops", "color": "Pink"},
            {"id": "bottom_jeans", "name": "Jeans", "category": "Bottoms", "color": "Blue"},
        ]
        user_preferences = {"colors": ["pink"]}  # Even with pink color preference, occasion dress code wins

        # 1. Casual Outing
        res_casual = recommend_from_wardrobe(
            wardrobe=wardrobe,
            occasion="Casual Outing",
            preferences=user_preferences
        )
        self.assertEqual(res_casual["outfit"]["top"]["name"], "Burgundy Top")
        self.assertEqual(res_casual["outfit"]["top"]["id"], "top_burgundy")
        self.assertNotEqual(res_casual["outfit"]["top"]["name"], "Pink One Shoulder Top")

        # 2. College
        res_college = recommend_from_wardrobe(
            wardrobe=wardrobe,
            occasion="College",
            preferences=user_preferences
        )
        self.assertEqual(res_college["outfit"]["top"]["name"], "Burgundy Top")
        self.assertEqual(res_college["outfit"]["top"]["id"], "top_burgundy")
        self.assertNotEqual(res_college["outfit"]["top"]["name"], "Pink One Shoulder Top")

    # ----------------------------------------------------
    # TEST 11: Regression - Work: Shirt + Pants beats Satin Dress
    # ----------------------------------------------------
    def test_work_prefers_shirt_and_pants_over_satin_dress(self):
        wardrobe = [
            {"id": "shirt_1", "name": "Shirt", "category": "Tops", "color": "White"},
            {"id": "pants_1", "name": "Pants", "category": "Bottoms", "color": "Black"},
            {"id": "dress_satin", "name": "Satin Dress", "category": "Dresses", "color": "Champagne"},
        ]
        result = recommend_from_wardrobe(wardrobe=wardrobe, occasion="Work")
        outfit = result["outfit"]

        self.assertIsNotNone(outfit.get("top"))
        self.assertEqual(outfit["top"]["name"], "Shirt")
        self.assertEqual(outfit["top"]["id"], "shirt_1")
        self.assertIsNotNone(outfit.get("bottom"))
        self.assertEqual(outfit["bottom"]["name"], "Pants")
        self.assertEqual(outfit["bottom"]["id"], "pants_1")
        self.assertIsNone(outfit.get("dress"))
        self.assertEqual(result["outfit_type"], "separates")

    # ----------------------------------------------------
    # TEST 12: Regression - Party: Brown Party Top beats White Tank Top
    # ----------------------------------------------------
    def test_party_prefers_brown_party_top_over_white_tank_with_burgundy_jeans(self):
        wardrobe = [
            {"id": "top_white_tank", "name": "White Tank Top", "category": "Tops", "color": "White"},
            {"id": "bottom_burgundy_jeans", "name": "Burgundy Jeans", "category": "Bottoms", "color": "Burgundy"},
            {"id": "top_brown_party", "name": "Brown Party Top", "category": "Tops", "color": "Brown"},
        ]
        result = recommend_from_wardrobe(wardrobe=wardrobe, occasion="Party")
        outfit = result["outfit"]

        self.assertIsNotNone(outfit.get("top"))
        self.assertEqual(outfit["top"]["name"], "Brown Party Top")
        self.assertEqual(outfit["top"]["id"], "top_brown_party")
        self.assertNotEqual(outfit["top"]["name"], "White Tank Top")
        self.assertIsNotNone(outfit.get("bottom"))
        self.assertEqual(outfit["bottom"]["name"], "Burgundy Jeans")
        self.assertEqual(outfit["bottom"]["id"], "bottom_burgundy_jeans")

    # ----------------------------------------------------
    # TEST 13: Regression - Full wardrobe competition across multiple occasions
    # ----------------------------------------------------
    def test_full_wardrobe_competition(self):
        full_wardrobe = [
            {"id": "t1", "name": "Burgundy Top", "category": "Tops", "color": "Burgundy"},
            {"id": "t2", "name": "Pink One Shoulder Top", "category": "Tops", "color": "Pink"},
            {"id": "t3", "name": "Brown Party Top", "category": "Tops", "color": "Brown"},
            {"id": "t4", "name": "White Tank Top", "category": "Tops", "color": "White"},
            {"id": "t5", "name": "Shirt", "category": "Tops", "color": "White"},
            {"id": "b1", "name": "Pants", "category": "Bottoms", "color": "Black"},
            {"id": "b2", "name": "Burgundy Jeans", "category": "Bottoms", "color": "Burgundy"},
            {"id": "d1", "name": "Satin Dress", "category": "Dresses", "color": "Emerald"},
            {"id": "a1", "name": "Spectacles", "category": "Accessories"},
        ]

        # Work -> Shirt + Pants
        res_work = recommend_from_wardrobe(full_wardrobe, occasion="Work")
        self.assertEqual(res_work["outfit"]["top"]["name"], "Shirt")
        self.assertEqual(res_work["outfit"]["bottom"]["name"], "Pants")

        # Casual -> Burgundy Top (or White Tank Top) + Jeans, NEVER Pink One Shoulder
        res_casual = recommend_from_wardrobe(full_wardrobe, occasion="Casual Outing")
        self.assertNotEqual(res_casual["outfit"]["top"]["name"], "Pink One Shoulder Top")
        self.assertIn(res_casual["outfit"]["top"]["name"], ["Burgundy Top", "White Tank Top"])

        # Party -> Brown Party Top or Satin Dress, NEVER White Tank Top
        res_party = recommend_from_wardrobe(full_wardrobe, occasion="Party")
        if res_party["outfit_type"] == "separates":
            self.assertEqual(res_party["outfit"]["top"]["name"], "Brown Party Top")
            self.assertNotEqual(res_party["outfit"]["top"]["name"], "White Tank Top")
        else:
            self.assertEqual(res_party["outfit"]["dress"]["name"], "Satin Dress")

        # Date -> Pink One Shoulder Top or Brown Party Top or Satin Dress, NEVER Shirt + Pants
        res_date = recommend_from_wardrobe(full_wardrobe, occasion="Date")
        if res_date["outfit_type"] == "separates":
            self.assertNotEqual(res_date["outfit"]["top"]["name"], "Shirt")
            self.assertIn(res_date["outfit"]["top"]["name"], ["Pink One Shoulder Top", "Brown Party Top"])
        else:
            self.assertEqual(res_date["outfit"]["dress"]["name"], "Satin Dress")

        # Wedding -> Satin Dress alone
        res_wedding = recommend_from_wardrobe(full_wardrobe, occasion="Wedding")
        self.assertEqual(res_wedding["outfit_type"], "dress")
        self.assertEqual(res_wedding["outfit"]["dress"]["name"], "Satin Dress")
        self.assertIsNone(res_wedding["outfit"]["top"])
        self.assertIsNone(res_wedding["outfit"]["bottom"])
        self.assertIsNone(res_wedding["outfit"]["accessory"])

    # ----------------------------------------------------
    # TEST 14: Regression - Date: prefers Pink One Shoulder Top + Jeans over Shirt + Pants
    # ----------------------------------------------------
    def test_date_prefers_one_shoulder_top_over_shirt_and_pants(self):
        wardrobe = [
            {"id": "s1", "name": "Shirt", "category": "Tops", "color": "White"},
            {"id": "p1", "name": "Pants", "category": "Bottoms", "color": "Black"},
            {"id": "t_os", "name": "Pink One Shoulder Top", "category": "Tops", "color": "Pink"},
            {"id": "j1", "name": "Jeans", "category": "Bottoms", "color": "Blue"},
        ]
        result = recommend_from_wardrobe(wardrobe, occasion="Date")
        outfit = result["outfit"]
        self.assertEqual(outfit["top"]["name"], "Pink One Shoulder Top")
        self.assertEqual(outfit["top"]["id"], "t_os")
        self.assertNotEqual(outfit["top"]["name"], "Shirt")
        self.assertEqual(outfit["bottom"]["name"], "Jeans")

    # ----------------------------------------------------
    # TEST 15: Regression - Party: prefers Party Top + Jeans over Shirt + Pants
    # ----------------------------------------------------
    def test_party_prefers_party_top_and_jeans_over_shirt_and_pants(self):
        wardrobe = [
            {"id": "s1", "name": "Shirt", "category": "Tops", "color": "White"},
            {"id": "p1", "name": "Pants", "category": "Bottoms", "color": "Black"},
            {"id": "t_party", "name": "Party Top", "category": "Tops", "color": "Black"},
            {"id": "j1", "name": "Jeans", "category": "Bottoms", "color": "Blue"},
        ]
        result = recommend_from_wardrobe(wardrobe, occasion="Party")
        outfit = result["outfit"]
        self.assertEqual(outfit["top"]["name"], "Party Top")
        self.assertEqual(outfit["top"]["id"], "t_party")
        self.assertNotEqual(outfit["top"]["name"], "Shirt")


if __name__ == "__main__":
    unittest.main()
