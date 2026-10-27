"""
Integration tests for FastAPI main.py recommend_outfit endpoint function.
Tests end-to-end request/response serialization, occasion suitability,
and wardrobe groundedness without requiring optional test client dependencies.
"""
import unittest
from main import recommend_outfit, home


class TestAPIIntegration(unittest.TestCase):

    def setUp(self):
        self.user_wardrobe = [
            {"id": "w1", "name": "Burgundy Top", "category": "Tops", "color": "Burgundy"},
            {"id": "w2", "name": "Pink One Shoulder Top", "category": "Tops", "color": "Pink"},
            {"id": "w3", "name": "Brown Party Top", "category": "Tops", "color": "Brown"},
            {"id": "w4", "name": "White Tank Top", "category": "Tops", "color": "White"},
            {"id": "w5", "name": "Shirt", "category": "Tops", "color": "White"},
            {"id": "w6", "name": "Pants", "category": "Bottoms", "color": "Black"},
            {"id": "w7", "name": "Burgundy Jeans", "category": "Bottoms", "color": "Burgundy"},
            {"id": "w8", "name": "Satin Dress", "category": "Dresses", "color": "Emerald"},
            {"id": "w9", "name": "Spectacles", "category": "Accessories"},
        ]

    def test_api_home_endpoint(self):
        res = home()
        self.assertEqual(res, {"message": "AI Fashion Stylist Backend is Working!"})

    def test_api_college_and_casual_endpoint(self):
        # 1. College
        payload = {
            "occasion": "College",
            "weather": "Warm",
            "style": "Casual",
            "wardrobe": self.user_wardrobe,
            "preferences": {"colors": ["pink"]}
        }
        res = recommend_outfit(payload)
        self.assertTrue(res["success"])
        outfit = res["outfit"]
        self.assertIsNotNone(outfit.get("top"))
        self.assertNotEqual(outfit["top"]["name"], "Pink One Shoulder Top")
        self.assertEqual(outfit["top"]["name"], "Burgundy Top")
        self.assertEqual(outfit["top"]["id"], "w1")

        # 2. Casual Outing
        payload["occasion"] = "Casual Outing"
        res2 = recommend_outfit(payload)
        self.assertTrue(res2["success"])
        outfit2 = res2["outfit"]
        self.assertNotEqual(outfit2["top"]["name"], "Pink One Shoulder Top")
        self.assertEqual(outfit2["top"]["name"], "Burgundy Top")

    def test_api_work_endpoint(self):
        payload = {
            "occasion": "Work",
            "weather": "Cool",
            "style": "Minimal",
            "wardrobe": self.user_wardrobe,
        }
        res = recommend_outfit(payload)
        self.assertTrue(res["success"])
        outfit = res["outfit"]
        self.assertIsNotNone(outfit.get("top"))
        self.assertEqual(outfit["top"]["name"], "Shirt")
        self.assertEqual(outfit["top"]["id"], "w5")
        self.assertIsNotNone(outfit.get("bottom"))
        self.assertEqual(outfit["bottom"]["name"], "Pants")
        self.assertEqual(outfit["bottom"]["id"], "w6")
        self.assertIsNone(outfit.get("dress"))

    def test_api_party_endpoint(self):
        party_wardrobe = [
            {"id": "t_white", "name": "White Tank Top", "category": "Tops", "color": "White"},
            {"id": "b_burg", "name": "Burgundy Jeans", "category": "Bottoms", "color": "Burgundy"},
            {"id": "t_brown", "name": "Brown Party Top", "category": "Tops", "color": "Brown"},
            {"id": "acc_specs", "name": "Spectacles", "category": "Accessories"},
        ]
        payload = {
            "occasion": "Party",
            "weather": "Cool",
            "style": "Trendy",
            "wardrobe": party_wardrobe,
        }
        res = recommend_outfit(payload)
        self.assertTrue(res["success"])
        outfit = res["outfit"]
        self.assertEqual(outfit["top"]["name"], "Brown Party Top")
        self.assertEqual(outfit["top"]["id"], "t_brown")
        self.assertEqual(outfit["bottom"]["name"], "Burgundy Jeans")
        self.assertEqual(outfit["bottom"]["id"], "b_burg")
        self.assertIsNone(outfit.get("accessory"))

    def test_api_date_endpoint(self):
        payload = {
            "occasion": "Date",
            "weather": "Warm",
            "style": "Elegant",
            "wardrobe": self.user_wardrobe,
        }
        res = recommend_outfit(payload)
        self.assertTrue(res["success"])
        outfit = res["outfit"]
        if res.get("outfit_type") == "separates":
            self.assertNotEqual(outfit["top"]["name"], "Shirt")
            self.assertIn(outfit["top"]["name"], ["Pink One Shoulder Top", "Brown Party Top"])
        else:
            self.assertEqual(outfit["dress"]["name"], "Satin Dress")


if __name__ == "__main__":
    unittest.main()
