import { useState } from "react";
import Header from "../components/Header";
import "./Wardrobe.css";

function Wardrobe() {

  const savedWardrobe = JSON.parse(
    localStorage.getItem("wardrobe") || "[]"
  );

  const [wardrobe, setWardrobe] = useState(savedWardrobe);

  const [clothing, setClothing] = useState({
    name: "",
    category: "Tops",
    accessoryType: "Earrings",
    color: "",
    image: ""
  });

  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setClothing((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImage = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setClothing((prev) => ({
        ...prev,
        image: reader.result
      }));
    };

    reader.readAsDataURL(file);
  };

  const addClothing = (event) => {
    event.preventDefault();

    if (!clothing.name || !clothing.image) {
      alert("Please enter a name and upload an image.");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: clothing.name.trim(),
      category: clothing.category,
      type:
        clothing.category === "Accessories"
          ? clothing.accessoryType || "Accessory"
          : clothing.category,
      color: clothing.color ? clothing.color.trim() : "",
      image: clothing.image
    };

    const updatedWardrobe = [...wardrobe, newItem];

    setWardrobe(updatedWardrobe);

    localStorage.setItem("wardrobe", JSON.stringify(updatedWardrobe));

    setClothing({
      name: "",
      category: clothing.category,
      accessoryType: "Earrings",
      color: "",
      image: ""
    });
  };

  const deleteClothing = (id) => {
    const updatedWardrobe = wardrobe.filter((item) => item.id !== id);

    setWardrobe(updatedWardrobe);

    localStorage.setItem("wardrobe", JSON.stringify(updatedWardrobe));
  };

  const filterCategories = [
    "All",
    "Tops",
    "Bottoms",
    "Dresses",
    "Outerwear",
    "Shoes",
    "Accessories"
  ];

  const isAccessory = (item) => {
    const cat = String(item.category || "").trim().toLowerCase();
    const type = String(item.type || "").trim().toLowerCase();
    const name = String(item.name || "").trim().toLowerCase();
    return (
      cat === "accessories" ||
      cat === "accessory" ||
      [
        "earring",
        "necklace",
        "bracelet",
        "watch",
        "sunglass",
        "handbag",
        "bag",
        "belt",
        "scarf",
        "ring",
        "hair"
      ].some((k) => type.includes(k) || name.includes(k))
    );
  };

  const isShoes = (item) => {
    const cat = String(item.category || "").trim().toLowerCase();
    return cat === "shoes" || cat === "shoe" || cat === "footwear";
  };

  const filteredWardrobe = wardrobe.filter((item) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Accessories") return isAccessory(item);
    if (selectedFilter === "Shoes") return isShoes(item);
    const cat = String(item.category || "").trim().toLowerCase();
    return cat === selectedFilter.toLowerCase();
  });

  const getItemCount = (cat) => {
    if (cat === "All") return wardrobe.length;
    if (cat === "Accessories") return wardrobe.filter(isAccessory).length;
    if (cat === "Shoes") return wardrobe.filter(isShoes).length;
    return wardrobe.filter(
      (item) => String(item.category || "").trim().toLowerCase() === cat.toLowerCase()
    ).length;
  };


  return (

    <div className="wardrobe-page">

      <Header
        logoRoute="/dashboard"
        buttonText="← Dashboard"
        buttonRoute="/dashboard"
      />


      {/* HEADER */}

      <section className="wardrobe-header">

        <p className="wardrobe-tag">
          YOUR DIGITAL CLOSET
        </p>

        <h1>
          Your
          <br />
          <em>wardrobe.</em>
        </h1>

        <p>
          Add your clothes and build your personal
          digital wardrobe.
        </p>

      </section>


      {/* ADD CLOTHING / ACCESSORIES */}

      <section className="add-clothing-section">

        <div className="add-clothing-card">

          <h2>
            {clothing.category === "Accessories"
              ? "ADD AN ACCESSORY"
              : "ADD A CLOTHING ITEM"}
          </h2>

          <form onSubmit={addClothing}>

            {/* NAME */}

            <div className="wardrobe-form-group">

              <label>
                {clothing.category === "Accessories"
                  ? "ACCESSORY NAME"
                  : "CLOTHING NAME"}
              </label>

              <input
                type="text"
                name="name"
                placeholder={
                  clothing.category === "Accessories"
                    ? "e.g. Minimal Gold Watch"
                    : "e.g. White Shirt"
                }
                value={clothing.name}
                onChange={handleChange}
              />

            </div>

            {/* CATEGORY */}

            <div className="wardrobe-form-group">

              <label>
                CATEGORY
              </label>

              <select
                name="category"
                value={clothing.category}
                onChange={handleChange}
              >

                <option value="Tops">
                  Tops
                </option>

                <option value="Bottoms">
                  Bottoms
                </option>

                <option value="Dresses">
                  Dresses
                </option>

                <option value="Outerwear">
                  Outerwear
                </option>

                <option value="Shoes">
                  Shoes
                </option>

                <option value="Accessories">
                  Accessories
                </option>

              </select>

            </div>

            {/* ACCESSORY TYPE (when Accessories category is selected) */}

            {clothing.category === "Accessories" && (

              <div className="wardrobe-form-group">

                <label>
                  ACCESSORY TYPE
                </label>

                <select
                  name="accessoryType"
                  value={clothing.accessoryType}
                  onChange={handleChange}
                >

                  <option value="Earrings">
                    Earrings
                  </option>

                  <option value="Necklace">
                    Necklace
                  </option>

                  <option value="Bracelet">
                    Bracelet
                  </option>

                  <option value="Watch">
                    Watch
                  </option>

                  <option value="Sunglasses">
                    Sunglasses
                  </option>

                  <option value="Handbag">
                    Handbag
                  </option>

                  <option value="Belt">
                    Belt
                  </option>

                  <option value="Scarf">
                    Scarf
                  </option>

                  <option value="Ring">
                    Ring
                  </option>

                  <option value="Hair Accessories">
                    Hair Accessories
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

            )}

            {/* COLOR */}

            <div className="wardrobe-form-group">

              <label>
                {clothing.category === "Accessories"
                  ? "COLOR"
                  : "COLOR (OPTIONAL)"}
              </label>

              <input
                type="text"
                name="color"
                placeholder={
                  clothing.category === "Accessories"
                    ? "e.g. Gold, Silver, Black"
                    : "e.g. White, Blue, Black"
                }
                value={clothing.color}
                onChange={handleChange}
              />

            </div>

            {/* IMAGE */}

            <div className="wardrobe-form-group">

              <label>
                {clothing.category === "Accessories"
                  ? "ACCESSORY PHOTO"
                  : "CLOTHING PHOTO"}
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
              />

            </div>

            {/* PREVIEW */}

            {clothing.image && (

              <div className="clothing-preview">

                <img
                  src={clothing.image}
                  alt="Item preview"
                />

              </div>

            )}

            <button
              type="submit"
              className="add-clothing-button"
            >
              {clothing.category === "Accessories"
                ? "+ Add Accessory to Wardrobe"
                : "+ Add to Wardrobe"}
            </button>

          </form>

        </div>

      </section>


      {/* WARDROBE COLLECTION */}

      <section className="wardrobe-section">

        <div className="wardrobe-section-title">

          <div>

            <p>
              YOUR COLLECTION
            </p>

            <h2>
              {wardrobe.length}{" "}
              {wardrobe.length === 1
                ? "item"
                : "items"}
            </h2>

          </div>

        </div>

        {/* CATEGORY FILTERS */}

        <div className="wardrobe-filters">

          {filterCategories.map((cat) => (

            <button
              key={cat}
              type="button"
              className={`wardrobe-filter-btn ${selectedFilter === cat ? "active" : ""
                }`}
              onClick={() => setSelectedFilter(cat)}
            >
              {cat} ({getItemCount(cat)})
            </button>

          ))}

        </div>

        {wardrobe.length === 0 ? (

          <div className="empty-wardrobe">

            <h3>
              Your wardrobe is empty
            </h3>

            <p>
              Add your first clothing or accessory item above
              to start building your digital closet.
            </p>

          </div>

        ) : filteredWardrobe.length === 0 ? (

          <div className="empty-wardrobe">

            <h3>
              No {selectedFilter.toLowerCase()} found
            </h3>

            <p>
              {selectedFilter === "Accessories"
                ? "Add an accessory above to start styling with accessories."
                : `You don't have any ${selectedFilter.toLowerCase()} in your collection yet.`}
            </p>

          </div>

        ) : (

          <div className="wardrobe-grid">

            {filteredWardrobe.map((item) => (

              <div
                className="clothing-card"
                key={item.id}
              >

                <div className="clothing-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                </div>

                <div className="clothing-info">

                  <p className="clothing-category">
                    {item.category}
                    {item.type &&
                      item.type.toLowerCase() !== item.category.toLowerCase()
                      ? ` • ${item.type}`
                      : ""}
                  </p>

                  <h3>
                    {item.name}
                  </h3>

                  {item.color && (
                    <p className="clothing-color">
                      {item.color}
                    </p>
                  )}

                  <button
                    onClick={() => {
                      deleteClothing(item.id);
                    }}
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


    </div>

  );

}

export default Wardrobe;