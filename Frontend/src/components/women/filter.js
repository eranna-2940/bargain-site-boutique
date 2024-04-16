import React, { useState, useEffect } from "react";

const Filter = ({ products, onFilter }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 }); // Initial price range
  const [showMoreMaterials, setShowMoreMaterials] = useState(false);

  // Retrieve the selected size, color, material, and price range from local storage when the component mounts
  useEffect(() => {
    const storedSize = localStorage.getItem("selectedSize");
    if (storedSize) {
      setSelectedSize(storedSize);
    }

    const storedColor = localStorage.getItem("selectedColor");
    if (storedColor) {
      setSelectedColor(storedColor);
    }

    const storedMaterial = localStorage.getItem("selectedMaterial");
    if (storedMaterial) {
      setSelectedMaterial(storedMaterial);
    }

    const storedPriceRange = JSON.parse(localStorage.getItem("priceRange"));
    if (storedPriceRange) {
      setPriceRange(storedPriceRange);
    }
  }, []);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    filterProducts(size, selectedColor, selectedMaterial, priceRange);
    // Store the selected size in local storage
    localStorage.setItem("selectedSize", size);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    filterProducts(selectedSize, color, selectedMaterial, priceRange);
    // Store the selected color in local storage
    localStorage.setItem("selectedColor", color);
  };

  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    filterProducts(selectedSize, selectedColor, material, priceRange);
    // Store the selected material in local storage
    localStorage.setItem("selectedMaterial", material);
  };

  const handlePriceChange = (event) => {
    const { value } = event.target;
    setPriceRange({ ...priceRange, max: parseFloat(value) });
    filterProducts(selectedSize, selectedColor, selectedMaterial, { min: 0, max: parseFloat(value) });
    // Store the selected price range in local storage
    localStorage.setItem("priceRange", JSON.stringify({ min: 0, max: parseFloat(value) }));
  };

  const filterProducts = (size, color, material, priceRange) => {
    const filtered = products.filter(
      (product) =>
        (!size || product.size === size) &&
        (!color || product.color === color) &&
        (!material || product.material === material) &&
        product.price >= priceRange.min &&
        product.price <= priceRange.max
    );
    onFilter(filtered);
  };

  const handleShowMoreMaterials = () => {
    setShowMoreMaterials(!showMoreMaterials);
  };

  const handleClearFilter = () => {
    setSelectedSize(""); // Clear the selected size
    setSelectedColor(""); // Clear the selected color
    setSelectedMaterial("")
    setPriceRange({ min: 0, max: 100000 }); // Reset price range
    localStorage.removeItem("selectedSize"); // Remove the selected size from local storage
    localStorage.removeItem("selectedColor"); // Remove the selected color from local storage
    localStorage.removeItem("priceRange"); 
    localStorage.removeItem("selectedMaterial")// Remove the price range from local storage
    onFilter(products); // Reset filtering
  };
  const materials = [
    "Art Silk",
    "Corduroy",
    "Cotton",
    "Denim",
    "Down",
    "Fleece",
    "Leather",
    "Linen",
    "Modal",
    "Net",
    "Rayon",
    "Rubber",
    "Satin",
    "Silk",
    "Synthetic",
    "Wool"
  ];

  return (
    <>
      <div className="card mt-4 mb-5">
        <div className="card-header bg-secondary text-white p-3 fs-5">
          <i className="bi bi-sort-down-alt pe-3"></i>
          Filter by attributes
        </div>
        <div className="card-body">
          <div className="accordion" id="sizeAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSize"
                  aria-expanded="true"
                  aria-controls="collapseSize"
                >
                  Choose Size
                </button>
              </h2>
              <div
                id="collapseSize"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#sizeAccordion"
              >
                <div className="accordion-body">
                  <button
                    className={`btn btn-outline-secondary m-2 ${
                      selectedSize === "XS" ? "active" : ""
                    }`}
                    onClick={() => handleSizeSelect("XS")}
                  >
                    XS
                  </button>
                  <button
                    className={`btn btn-outline-secondary m-2 ${
                      selectedSize === "S" ? "active" : ""
                    }`}
                    onClick={() => handleSizeSelect("S")}
                  >
                    S
                  </button>
                  <button
                    className={`btn btn-outline-secondary m-2 ${
                      selectedSize === "M" ? "active" : ""
                    }`}
                    onClick={() => handleSizeSelect("M")}
                  >
                    M
                  </button>
                  <button
                    className={`btn btn-outline-secondary m-2 ${
                      selectedSize === "L" ? "active" : ""
                    }`}
                    onClick={() => handleSizeSelect("L")}
                  >
                    L
                  </button>
                  <button
                    className={`btn btn-outline-secondary m-2 ${
                      selectedSize === "XL" ? "active" : ""
                    }`}
                    onClick={() => handleSizeSelect("XL")}
                  >
                    XL
                  </button>
                </div>
              </div>
            </div>
          </div>
        
          <div className="accordion mt-3" id="materialAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingFour">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseMaterial"
              aria-expanded="true"
              aria-controls="collapseMaterial"
            >
              Choose Material
            </button>
          </h2>
          <div
            id="collapseMaterial"
            className="accordion-collapse collapse show"
            aria-labelledby="headingFour"
            data-bs-parent="#materialAccordion"
          >
            <div className="accordion-body">
              {materials.slice(0, showMoreMaterials ? materials.length : 5).map((material, index) => (
                <div className="form-check" key={index}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`materialCheckbox${index}`}
                    value={material}
                    checked={selectedMaterial === material}
                    onChange={() => handleMaterialSelect(material)}
                  />
                  <label className="form-check-label" htmlFor={`materialCheckbox${index}`}>
                    {material}
                  </label>
                </div>
              ))}
            </div>
            <button className="btn btn-link" onClick={handleShowMoreMaterials}>
              {showMoreMaterials ? 'Show Less' : 'Show More'}
            </button>
          </div>
        </div>
      </div>
         
          <div className="accordion mt-3" id="colorAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseColor"
                  aria-expanded="true"
                  aria-controls="collapseColor"
                >
                  Choose Color
                </button>
              </h2>
              <div
                id="collapseColor"
                className="accordion-collapse collapse show"
                aria-labelledby="headingTwo"
                data-bs-parent="#colorAccordion"
              >
               <div className="accordion-body">
  <div className="row">
    <div className="col-3">
      <button
        className={`color-selector btn ${selectedColor === "red" ? "active" : ""}`}
        onClick={() => handleColorSelect("red")}
        style={{ backgroundColor: "red", width: "30px", height: "30px" }}
      ></button>
    </div>
    <div className="col-3">
      <button
        className={`color-selector btn ${selectedColor === "blue" ? "active" : ""}`}
        onClick={() => handleColorSelect("blue")}
        style={{ backgroundColor: "blue", width: "30px", height: "30px" }}
      ></button>
    </div>
    <div className="col-3">
      <button
        className={`color-selector btn ${selectedColor === "green" ? "active" : ""}`}
        onClick={() => handleColorSelect("green")}
        style={{ backgroundColor: "green", width: "30px", height: "30px" }}
      ></button>
    </div>
    <div className="col-3">
      <button
        className={`color-selector btn ${selectedColor === "yellow" ? "active" : ""}`}
        onClick={() => handleColorSelect("yellow")}
        style={{ backgroundColor: "yellow", width: "30px", height: "30px" }}
      ></button>
    </div>
  </div>
  <div className="row mt-3">
    <div className="col-3">
      <button
        className={`color-selector btn ${selectedColor === "gray" ? "active" : ""}`}
        onClick={() => handleColorSelect("gray")}
        style={{ backgroundColor: "gray", width: "30px", height: "30px" }}
      ></button>
    </div>
    <div className="col-3">
      <button
        className={`color-selector btn ${selectedColor === "brown" ? "active" : ""}`}
        onClick={() => handleColorSelect("brown")}
        style={{ backgroundColor: "brown", width: "30px", height: "30px" }}
      ></button>
    </div>
    <div className="col-3">
      <button
        className={`color-selector btn ${selectedColor === "pink" ? "active" : ""}`}
        onClick={() => handleColorSelect("pink")}
        style={{ backgroundColor: "pink", width: "30px", height: "30px" }}
      ></button>
    </div>
    <div className="col-3">
      <button
        className={`color-selector btn ${selectedColor === "orange" ? "active" : ""}`}
        onClick={() => handleColorSelect("orange")}
        style={{ backgroundColor: "orange", width: "30px", height: "30px" }}
      ></button>
    </div>
    
  </div>
  <div className="row mt-3">
  <div className="col-3">
      <button
        className={`color-selector btn ${selectedColor === "gold" ? "active" : ""}`}
        onClick={() => handleColorSelect("gold")}
        style={{ backgroundColor: "gold", width: "30px", height: "30px" }}
      ></button>
    </div>
    <div className="col-3">
      <button
        className={`color-selector btn ${selectedColor === "purple" ? "active" : ""}`}
        onClick={() => handleColorSelect("purple")}
        style={{ backgroundColor: "purple", width: "30px", height: "30px" }}
      ></button>
    </div>
    <div className="col-3">
      <button
        className={`color-selector btn ${selectedColor === "beige" ? "active" : ""}`}
        onClick={() => handleColorSelect("beige")}
        style={{ backgroundColor: "beige", width: "30px", height: "30px" }}
      ></button>
    </div>
    <div className="col-3">
      <button
        className={`color-selector btn ${selectedColor === "silver" ? "active" : ""}`}
        onClick={() => handleColorSelect("silver")}
        style={{ backgroundColor: "silver", width: "30px", height: "30px" }}
      ></button>
    </div>
    </div>
</div>

    </div>
            </div>
          </div>
          <div className="mt-3">
            <label htmlFor="priceRange" className="form-label">Price Range</label>
            <input 
              type="range" 
              className="form-range" 
              id="priceRange" 
              min={0} 
              max={100000} 
              value={priceRange.max} 
              onChange={handlePriceChange} 
            />
            <div className="d-flex justify-content-between">
              <span>&#8377;{priceRange.min}</span>
              <span>&#8377;{priceRange.max}</span>
            </div>
          </div>
          {(selectedSize || selectedColor || selectedMaterial) && (
            <button
              className="btn btn-outline-secondary mt-3"
              onClick={handleClearFilter}
            >
              Remove Filter
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Filter;
