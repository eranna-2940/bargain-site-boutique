import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "./navbar";
import { useCart } from "./CartContext";
import axios from "axios";

const Checkout = () => {
  const { user, cartItems, calculateTotalPrice } = useCart();
  const [skipShippingAddress, setSkipShippingAddress] = useState(false);
  const totalPrice = calculateTotalPrice();


  const [shippingaddress, setShippingAddress] = useState([]);

  useEffect(() => {
    // Fetch all products
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveShippingAddress`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const userid = sessionStorage.getItem("user-token");
          setShippingAddress(res.data.filter((item) => item.user_id === parseInt(userid)));
        }
      })
      .catch((error) => {
        console.log("Error fetching all products:", error);
      });
  }, []);
  const [billingaddress, setBillingAddress] = useState([]);
  useEffect(() => {
    // Fetch all products
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveShippingAddress`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const userid = sessionStorage.getItem("user-token");
          setBillingAddress(res.data.filter((item) => item.user_id === parseInt(userid)));
        }
      })
      .catch((error) => {
        console.log("Error fetching all products:", error);
      });
  }, []);

  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);

  const handleSelectShippingAddress = (address) => {
    setSelectedShippingAddress(address);
  };

  const handleSelectBillingAddress = (address) => {
    setSelectedBillingAddress(address);
  };

  const handleClick = () => {
    if (selectedBillingAddress && selectedShippingAddress) {
      setStep(5);
    }
  };

  const handleDivClick = (addressType, index) => {
    if (addressType === 'shipping') {
      handleSelectShippingAddress(shippingaddress[index]);
    } else {
      handleSelectBillingAddress(billingaddress[index]);
    }
  };


  const [step, setStep] = useState(1);

  useEffect(() => {
    if (shippingaddress.length > 0) {
      setStep(1);
    } else {
      setStep(2);
    }
  }, [shippingaddress]);

  const [fields, setFields] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    country: "",
    state: "",
    city: "",
    address1: "",
    address2: "",
    pincode: "",
    phone: user.phone,
  });
  const [newFields, setNewFields] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    country: "",
    state: "",
    city: "",
    address1: "",
    address2: "",
    pincode: "",
    phone: user.phone,
  });
  const [selectedOption, setSelectedOption] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setNewFields({ ...newFields, [name]: value });
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleContinue = () => {
    if (step === 2 && skipShippingAddress) {
      if (validateBillingAddress()) {
        setStep(step + 2);
      }
    } else {
      if (step === 2) {
        if (validateBillingAddress()) {
          setStep(step + 1);
        }
      } else if (step === 3) {
        if (selectedOption === "new" && !validateShippingAddress()) {
          return;
        } else if (selectedOption !== "new" && selectedOption !== "same") {
          return;
        }
        setStep(step + 1);
      } else if (step === 4) {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step === 4 && skipShippingAddress) {
      setStep(2);
    } else {
      setStep(step - 1);
    }
  };

  const validateBillingAddress = () => {
    const PINCODE_PATTERN = /^[0-9]{6}$/;

    return (
      fields.country.trim() !== "" &&
      fields.state.trim() !== "" &&
      fields.city.trim() !== "" &&
      fields.address1.trim() !== "" &&
       fields.pincode.trim() !== "" &&
      PINCODE_PATTERN.test(fields.pincode.trim())  
      );
  };
  const validateShippingAddress = () => {
    // If the selected option is "new", validate the new fields
    if (selectedOption === "new") {
      if (
        !newFields.country ||
        !newFields.state ||
        !newFields.city ||
        !newFields.address1 ||
        !newFields.address2 ||
        !newFields.pincode
      ) {
        return false;
      }
    }

    return true;
  };

  const handleSkipShippingChange = (e) => {
    setSkipShippingAddress(e.target.checked);
  };


  const createPayment = async () => {
  try {
    let shippingAddressData = {};
    let billingAddressData = {};

    // Check if both selectedBillingAddress and selectedShippingAddress are selected
    if (selectedBillingAddress && selectedShippingAddress) {
    } else {
      // Check if the checkbox for skipping shipping address is checked
      if (skipShippingAddress) {
        // If checkbox is checked, use the same data for both shipping and billing addresses
        shippingAddressData = fields;
        billingAddressData = fields;
      } else {
        // If checkbox is not checked, proceed with the selectedOption logic
        if (selectedOption === "same") {
          // Use the same data for shipping and billing addresses
          shippingAddressData = fields;
          billingAddressData = fields;
        } else {
          // Handle the logic for different shipping and billing addresses
          if (selectedOption === "new") {
            // Use newFields for shipping address
            shippingAddressData = newFields;
          } else {
            // Use existing shipping address
            shippingAddressData = fields;
          }
          // Use newFields for billing address
          billingAddressData = fields;
        }
      }

      // Send shipping address to backend if it's not null
      if (shippingAddressData !== null) {
        const token = sessionStorage.getItem("user-token");
        await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveShippingAddress`, {
          shippingAddress: shippingAddressData,
          token: token,
        });
      }

      // Send billing address to backend if it's not null
      if (billingAddressData !== null) {
        const token = sessionStorage.getItem("user-token");
        await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveBillingAddress`, {
          billingAddress: billingAddressData,
          token: token,
        });
      }
    }

    // After saving addresses, redirect to payment page
    const response = await axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/createPayment`, {
      cartItems,
    });
    window.location.href = response.data.redirectUrl;
  } catch (error) {
    console.error(
      "Error creating payment:",
      error.response ? error.response.data : error.message
    );
    // Handle error appropriately (e.g., show an error message to the user)
  }
};

  
  return (
    <>
      <MyNavbar />
      <div className="container mt-5">
        <form>
          {shippingaddress.length>0 ?(
<div className="mb-3 p-3" style={{ backgroundColor: step === 1 ? "#f0f0f0" : "#708090", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
  <h5 style={{ color: step === 1 ? "black" : "white" }}>Existing Addresses</h5>
  {step === 1 && (
    <>
      <div className="container">
        <div className="row">
          {/* Shipping Addresses */}
          <div className="col-md-6">
            <div className="d-flex flex-column" style={{gap:'20px'}}>
              <h5>Shipping Addresses</h5>
              {shippingaddress.map((address, index) => (
                <div key={`shipping_${index}`} className={`shipping-address border rounded p-3 ${selectedShippingAddress === address ? 'selected' : ''}`} style={{ maxHeight: "150px", overflowY: "auto" }} onClick={() => handleDivClick('shipping', index)}>
                  <h6><input type="radio" name="shippingAddress" className="me-2" checked={selectedShippingAddress === address} onChange={() => {}} required/>Shipping Address {index + 1}</h6>
                  <p>{address.firstname} {address.lastname}</p>
                  <p>Email: {address.email}</p>
                  <p>Phone: {address.phone}</p>
                  <p>{address.address1} {address.address2}</p>
                  <p>{address.city}, {address.state}, {address.pincode}</p>
                  <p>{address.country}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Billing Addresses */}
          <div className="col-md-6">
            <div className="d-flex flex-column" style={{gap:'20px'}}>
              <h5>Billing Addresses</h5>
              {billingaddress.map((address, index) => (
                <div key={`billing_${index}`} className={`billing-address border rounded p-3 ${selectedBillingAddress === address ? 'selected' : ''}`} style={{ maxHeight: "150px", overflowY: "auto" }} onClick={() => handleDivClick('billing', index)}>
                  <h6><input type="radio" name="billingAddress" className="me-2" checked={selectedBillingAddress === address} onChange={() => {}} required/>Billing Address {index + 1}</h6>
                  {/* Display address details */}
                  <p>{address.firstname} {address.lastname}</p>
                  <p>Email: {address.email}</p>
                  <p>Phone: {address.phone}</p>
                  <p>{address.address1} {address.address2}</p>
                  <p>{address.city}, {address.state}, {address.pincode}</p>
                  <p>{address.country}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 d-flex justify-content-between p-5">
        <button className="btn btn-primary mt-3 me-3" onClick={handleClick}>
          <i className="bi bi-arrow-right-square me-1"></i>
          Continue
        </button>
        <button className="btn btn-secondary mt-3" onClick={() => setStep(2)}>
          <i className="bi bi-skip-forward me-1"></i>
          Skip
        </button>
      </div>
    </>
  )}
</div>
):(null)}
<div
            className="mb-3"
            style={{
              backgroundColor: step === 2 ? "#f0f0f0" : "#708090",
              padding: "10px",
            }}
          >
            <h5
              style={{
                color: step === 2 ? "black" : "white",
              }}
            >
              Billing Address
            </h5>
            {step === 2 && (
              <>
                <div className="mb-3">
                  <input
                    type="checkbox"
                    checked={skipShippingAddress}
                    onChange={handleSkipShippingChange}
                    className="me-1"
                  />
                  <label>
                    <strong>Ship to the same Address</strong>
                  </label>
                </div>
                <div className="row g-2">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Firstname"
                      name="firstname"
                      value={fields.firstname}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Lastname"
                      name="lastname"
                      value={fields.lastname}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      value={fields.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Country"
                      name="country"
                      value={fields.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="State"
                      name="state"
                      value={fields.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="City"
                      name="city"
                      value={fields.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Adress1"
                      name="address1"
                      value={fields.address1}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Adress2"
                      name="address2"
                      value={fields.address2}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Pincode"
                      name="pincode"
                      value={fields.pincode}
                      pattern="[0-9]{6}"
                      title="Please enter exactly 6 digits"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone"
                      name="phone"
                      value={fields.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-12 d-flex justify-content-between p-5">
                <button className="btn btn-secondary mt-3" onClick={handleBack}>
                <i class="bi bi-arrow-left-square"></i> Back
        </button>
        <button className="btn btn-primary mt-3 me-3" onClick={handleClick}>
          <i className="bi bi-arrow-right-square me-1"></i>
          Continue
        </button>
       
      </div>
              </>
            )}
  </div>
          <div
            className="mb-3"
            style={{
              backgroundColor:
                step === 3 && !skipShippingAddress ? "#f0f0f0" : "#708090",
              padding: "10px",
            }}
          >
            <h5
              style={{
                color: step === 3 ? "black" : "white",
              }}
            >
              Shipping Address
            </h5>
            {step === 3 && !skipShippingAddress && (
              <>
                <div className="mb-3">
                  <label className="form-label">Select Address Option:</label>
                  <select
                    className="form-select"
                    value={selectedOption}
                    onChange={handleOptionChange}
                    required
                  >
                    <option value="">Select Address Option</option>
                    <option value="new">Add New Address</option>
                    <option value="same">Use Same as Billing Address</option>
                  </select>
                </div>

                {selectedOption === "new" && (
                  <>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Firstname"
                          name="firstname"
                          value={newFields.firstname}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Lastname"
                          name="lastname"
                          value={newFields.lastname}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <input
                          type="email"
                          className="form-control mb-2"
                          placeholder="Email"
                          name="email"
                          value={newFields.email}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Country"
                          name="country"
                          value={newFields.country}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="State"
                          name="state"
                          value={newFields.state}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="City"
                          name="city"
                          value={newFields.city}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Adress1"
                          name="address1"
                          value={newFields.address1}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Adress2"
                          name="address2"
                          value={newFields.address2}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Pincode"
                          name="pincode"
                          value={newFields.pincode}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Phone"
                          name="phone"
                          value={newFields.phone}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedOption === "same" && (
                  <p>Shipping details will be the same as billing address.</p>
                )}
                <div className="col-12 d-flex justify-content-between p-5">
                  <button className="btn btn-secondary" onClick={handleBack}>
                    <i class="bi bi-arrow-left-square"></i> Back
                  </button>
                  <button
                    className="btn btn-primary me-2"
                    onClick={handleContinue}
                  >
                    <i class="bi bi-arrow-right-square me-1"></i>Continue
                  </button>
                </div>
              </>
            )}
          </div>

          <div
            className="mb-3"
            style={{
              backgroundColor: step === 4 ? "#f0f0f0" : "#708090",
              padding: "10px",
            }}
          >
            <h5
              style={{
                color: step === 4 ? "black" : "white",
              }}
            >
              Payment Information
            </h5>
            {step === 4 && (
              <>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Product Image</th>
                      <th>Product Name</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <img
                          src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${JSON.parse(product.image)[0]}`}
                            alt={product.name}
                            style={{ maxWidth: "60px", maxHeight: "100px" }}
                          />
                        </td>
                        <td className="text-secondary">{product.name}</td>
                        <td>{product.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="col-md-4 bg-white shadow float-md-end">
                  <div className="p-3 ">
                    <p className="mb-0 d-flex justify-content-between">
                      Sub-Total: <span>&#8377;{totalPrice}.00</span>
                    </p>
                    <hr />
                    <p className="mb-0 fw-bold d-flex justify-content-between">
                      Total Price:{" "}
                      <span className="fw-light">&#8377;{totalPrice}.00</span>
                    </p>
                  </div>
                </div>
                <div className="col-12 d-flex justify-content-between p-5">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={handleBack}
                  >
                    <i className="bi bi-arrow-left-square"></i> Back
                  </button>
                  <button className="btn btn-primary" onClick={handleContinue}>
                    <i className="bi bi-arrow-right-square me-1"></i> Continue
                  </button>
                </div>
              </>
            )}
          </div>

          <div
            className="mb-3"
            style={{
              backgroundColor: step === 5 ? "#f0f0f0" : "#708090",
              padding: "10px",
            }}
          >
            <h5
              style={{
                color: step === 5 ? "black" : "white",
              }}
            >
              Confirm Order
            </h5>
            {step === 5 && (
              <>
                {/* <div className="d-flex m-2" style={{ gap: "100px" }}>
                  <div style={{ padding: "10px" }}>
                    <h2>Billing Details:</h2>
                    <div>
                      <p>
                        {fields.firstname} {fields.lastname}
                      </p>
                      <p>Email: {fields.email}</p>
                      <p>phone: {fields.phone}</p>
                      <p>
                        {fields.address1} {fields.address2}
                      </p>
                      <p>
                        {fields.city},{fields.state},{fields.pincode}
                      </p>
                      <p>{fields.country}</p>
                    </div>
                  </div>

                  <div style={{ padding: "10px" }}>
                    <h2>Shipping Details:</h2>
                    {skipShippingAddress ? (
                      <>
                        <p>
                          {fields.firstname} {fields.lastname}
                        </p>
                        <p>Email: {fields.email}</p>
                        <p>Phone: {fields.phone}</p>
                        <p>
                          {fields.address1} {fields.address2}
                        </p>
                        <p>
                          {fields.city},{fields.state},{fields.pincode}
                        </p>
                        <p>{fields.country}</p>
                      </>
                    ) : (
                      <>
                        <p>
                          {selectedOption === "new"
                            ? newFields.firstname
                            : fields.firstname}{" "}
                          {selectedOption === "new"
                            ? newFields.lastname
                            : fields.lastname}
                        </p>
                        <p>
                          Email:{" "}
                          {selectedOption === "new"
                            ? newFields.email
                            : fields.email}{" "}
                        </p>
                        <p>
                          {" "}
                          Phone:{" "}
                          {selectedOption === "new"
                            ? newFields.phone
                            : fields.phone}
                        </p>
                        <p>
                          {selectedOption === "new"
                            ? newFields.address1
                            : fields.address1}{" "}
                          {selectedOption === "new"
                            ? newFields.address2
                            : fields.address2}
                        </p>
                        <p>
                          {" "}
                          {selectedOption === "new"
                            ? newFields.city
                            : fields.city}{" "}
                          ,
                          {selectedOption === "new"
                            ? newFields.state
                            : fields.state}{" "}
                          ,
                          {selectedOption === "new"
                            ? newFields.pincode
                            : fields.pincode}
                        </p>
                        <p>
                          {selectedOption === "new"
                            ? newFields.country
                            : fields.country}
                        </p>
                      </>
                    )}
                  </div>
                </div> */}
                <div className="d-md-flex m-2" style={{ gap: "100px" }}>
  <div style={{ padding: "10px" }}>
    <h2>Billing Details:</h2>
    <div>
      {selectedBillingAddress ? (
        <>
          <p>
            {selectedBillingAddress.firstname} {selectedBillingAddress.lastname}
          </p>
          <p>Email: {selectedBillingAddress.email}</p>
          <p>Phone: {selectedBillingAddress.phone}</p>
          <p>
            {selectedBillingAddress.address1} {selectedBillingAddress.address2}
          </p>
          <p>
            {selectedBillingAddress.city}, {selectedBillingAddress.state}, {selectedBillingAddress.pincode}
          </p>
          <p>{selectedBillingAddress.country}</p>
        </>
      ) : (
        <>
          <p>
            {fields.firstname} {fields.lastname}
          </p>
          <p>Email: {fields.email}</p>
          <p>Phone: {fields.phone}</p>
          <p>
            {fields.address1} {fields.address2}
          </p>
          <p>
            {fields.city}, {fields.state}, {fields.pincode}
          </p>
          <p>{fields.country}</p>
        </>
      )}
    </div>
  </div>
  <div style={{ padding: "10px" }}>
    <h2>Shipping Details:</h2>
    <div>
      {skipShippingAddress ? (
        <>
          <p>
            {fields.firstname} {fields.lastname}
          </p>
          <p>Email: {fields.email}</p>
          <p>Phone: {fields.phone}</p>
          <p>
            {fields.address1} {fields.address2}
          </p>
          <p>
            {fields.city}, {fields.state}, {fields.pincode}
          </p>
          <p>{fields.country}</p>
        </>
      ) : (
        <>
          {selectedShippingAddress ? (
            <>
              <p>
                {selectedShippingAddress.firstname} {selectedShippingAddress.lastname}
              </p>
              <p>Email: {selectedShippingAddress.email}</p>
              <p>Phone: {selectedShippingAddress.phone}</p>
              <p>
                {selectedShippingAddress.address1} {selectedShippingAddress.address2}
              </p>
              <p>
                {selectedShippingAddress.city}, {selectedShippingAddress.state}, {selectedShippingAddress.pincode}
              </p>
              <p>{selectedShippingAddress.country}</p>
            </>
          ) : (
            <>
              <p>
                {selectedOption === "new"
                  ? newFields.firstname
                  : fields.firstname}{" "}
                {selectedOption === "new"
                  ? newFields.lastname
                  : fields.lastname}
              </p>
              <p>
                Email:{" "}
                {selectedOption === "new"
                  ? newFields.email
                  : fields.email}{" "}
              </p>
              <p>
                Phone:{" "}
                {selectedOption === "new"
                  ? newFields.phone
                  : fields.phone}
              </p>
              <p>
                {selectedOption === "new"
                  ? newFields.address1
                  : fields.address1}{" "}
                {selectedOption === "new"
                  ? newFields.address2
                  : fields.address2}
              </p>
              <p>
                {selectedOption === "new"
                  ? newFields.city
                  : fields.city}{" "}
                ,
                {selectedOption === "new"
                  ? newFields.state
                  : fields.state}{" "}
                ,
                {selectedOption === "new"
                  ? newFields.pincode
                  : fields.pincode}
              </p>
              <p>
                {selectedOption === "new"
                  ? newFields.country
                  : fields.country}
              </p>
            </>
          )}
        </>
      )}
    </div>
  </div>
</div>

                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Product Image</th>
                      <th>Product Name</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <img
                           src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${JSON.parse(product.image)[0]}`}
                            alt={product.name}
                            style={{ maxWidth: "60px", maxHeight: "100px" }}
                          />
                        </td>
                        <td className="text-secondary">{product.name}</td>
                        <td>{product.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="col-md-4 bg-white shadow float-md-end">
                  <div className="p-3 ">
                    <p className="mb-0 d-flex justify-content-between">
                      Sub-Total: <span>&#8377;{totalPrice}.00</span>
                    </p>
                    <hr />
                    <p className="mb-0 fw-bold d-flex justify-content-between">
                      Total Price:{" "}
                      <span className="fw-light">&#8377;{totalPrice}.00</span>
                    </p>
                  </div>
                </div>

                <div className="col-12 d-flex justify-content-between p-5">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={handleBack}
                  >
                    <i className="bi bi-arrow-left-square"></i> Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={createPayment}
                  >
                    <i class="bi bi-bag-check-fill me-1"></i>Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Checkout;
