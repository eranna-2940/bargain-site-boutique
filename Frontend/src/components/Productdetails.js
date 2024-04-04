import React, { useEffect, useState,useRef } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import MyNavbar from "./navbar";
import Footer from "./footer";
import axios from "axios";
import { useCart } from "./CartContext";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 1600, min: 1201 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 1200, min: 992 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 991, min: 768 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 2,
  },
};

export default function Productdetails() {
  const { id } = useParams();
  const location = useLocation();
  const { productdetails, admin } = location.state;
  productdetails.userid = sessionStorage.getItem("user-token");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    if (sessionStorage.getItem("token") !== "admin") {
      sessionStorage.getItem("user-token") !== null && setIsLoggedIn(true);
    }
  },[])

  // eslint-disable-next-line no-unused-vars
  const [values, setValues] = useState({
    accepted_by_admin: "true",
    id: id,
  });

  const handleProductlist = () => {
    axios
      .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/adminaccepted`, values)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    alert("Product added to the store successfully");
    window.location.href = "/bargain-site-boutique/";
  };
  const handleRejectClick = () => {
    const reason = prompt('Please enter the reason for rejection:');
    if (reason !== null) {
      axios.post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/adminrejected`, {id:id,reactedreason:reason})
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
      console.log('Reason for rejection:', reason);
      // You can send the reason to the backend or perform any other action
    } else {
      // The user clicked Cancel
      console.log('Rejection cancelled');
    }
    window.location.href = "/bargain-site-boutique/";
  };

  const { addToCart, addToWishlist, cartItems } = useCart();

  const handleAddToCart = () => {
    if (cartItems.length > 0) {
      var unique_item = true;
      cartItems.map((item) => {
        if (item.id === productdetails.id) {
          alert("Product already exists in the cart");
          unique_item = false;
          //eslint-disable-next-line array-callback-return
          return;
        }
        return null;
      });
      unique_item && addToCart(productdetails,"main");
    } else {
      addToCart(productdetails,"main");
    }
  };

  
  const handleAddToWishlist = () => {
    if (isLoggedIn) {
      addToWishlist(productdetails);
    } else {
      navigate("/login");
    }
  };
// useRef to hold the reference to the productdetailsimg
const productDetailsImgRef = useRef();
// useRef to hold the reference to the active subimage
const activeSubimageRef = useRef();

// Function to update the productdetailsimg and set the active subimage
const updateProductDetailsImg = (newSrc, index) => {
  productDetailsImgRef.current.src = `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${newSrc}`;

  // Remove border from the previous active subimage
  if (activeSubimageRef.current) {
    activeSubimageRef.current.style.border = "1px solid grey";
  }

  // Set border to the new active subimage
  const newActiveSubimage = document.getElementById(`subimage-${index}`);
  if (newActiveSubimage) {
    newActiveSubimage.style.border = "3px solid green";
    // newActiveSubimage.style.padding = "3px";
    activeSubimageRef.current = newActiveSubimage;
  }
};

const datta = JSON.parse(productdetails.image);
const firstImage = datta[0];


  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        <nav className="p-2 ps-lg-5 pe-lg-5">
          <Link to="/" className="text-decoration-none text-dark">
            <i className="bi bi-house-fill"></i>
          </Link>
          &nbsp; /{" "}
          <Link
            to={"/" + productdetails.product_type}
            className="text-decoration-none text-dark"
          >
            {productdetails.product_type}
          </Link>
          /{" "}
          <Link
            to={"/" + productdetails.category}
            className="text-decoration-none text-dark"
          >
            {productdetails.category}
          </Link>{" "}
          / {productdetails.name}
        </nav>
        <div className="p-2 ps-lg-5 pe-lg-5 d-lg-flex">
          <div className="p-2 ps-lg-4 pe-lg-4 d-flex flex-column justify-content-between col-lg-5">
          <div className="ms-auto me-auto text-center productdetailsimgdiv">
           <img
              src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${firstImage}`}
              ref={productDetailsImgRef}
              alt="product"
              className="productdetailsimg"
            />
           </div>
           <div className="ms-auto me-auto">
            <Carousel responsive={responsive} className=" mt-2 productdetailscarousel">
                {datta.map((product, index) => (
                  <div
                    className="card m-3"
                    key={index}
                    id={`subimage-${index}`}
                    onClick={() => updateProductDetailsImg(product, index)}
                    style={{border:"1px solid grey"}}
                  >
                    <img
                      src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${product}`}
                      alt="images"
                      // height="100%"
                      // width="100%"
                      style={{ cursor: "pointer",maxWidth:"100%",height:"110px",objectFit:"contain",alignSelf:"center" ,padding:"3px"}}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
          <div className="ps-md-3 p-2 col-lg-7">
            <h2 className="text-secondary">{productdetails.name}</h2>
            <p>{productdetails.description}</p>
            <br />
            <div className="d-flex col-md-9">
              <p className=" col-md-4 col-lg-5">
                <b>Location</b>
              </p>
              <p className=" col-md-8 col-lg-10">: {productdetails.location}</p>
            </div>
            <div className="d-flex col-md-9">
              <p className=" col-md-4 col-lg-5">
                <b>Color</b>
              </p>
              <p className=" col-md-8 col-lg-10">: {productdetails.color}</p>
            </div>
            <div className="d-flex col-md-9">
              <p className=" col-md-4 col-lg-5">
                <b>Can it be altered</b>
              </p>
              <p className=" col-md-8 col-lg-7">
                : {productdetails.alteration}
              </p>
            </div>
            <div className="d-flex col-md-9">
              <p className=" col-md-4 col-lg-5">
                <b>Size</b>
              </p>
              <p className=" col-md-8 col-lg-10">: {productdetails.size}</p>
            </div>
            <div className="d-flex col-md-9">
              <p className=" col-md-4 col-lg-5">
                <b>Size (Measurements)</b>
              </p>
              <p className=" col-md-8 col-lg-10">
                : {productdetails.measurements}
              </p>
            </div>

            {productdetails.material !== null && (
              <div className="d-flex col-md-9">
                <p className=" col-md-4 col-lg-5">
                  <b>Material</b>
                </p>
                <p className=" col-md-8 col-lg-10">
                  : {productdetails.material}
                </p>
              </div>
            )}
            {productdetails.occasion !== null && (
              <div className="d-flex col-md-9">
                <p className=" col-md-4 col-lg-5">
                  <b>Occasion</b>
                </p>
                <p className=" col-md-8 col-lg-10">
                  : {productdetails.occasion}
                </p>
              </div>
            )}
            {productdetails.type !== null && (
              <div className="d-flex col-md-9">
                <p className=" col-md-4 col-lg-5">
                  <b>type</b>
                </p>
                <p className=" col-md-8 col-lg-10">: {productdetails.type}</p>
              </div>
            )}
            {productdetails.brand !== null && (
              <div className="d-flex col-md-9">
                <p className=" col-md-4 col-lg-5">
                  <b>Brand</b>
                </p>
                <p className=" col-md-8 col-lg-10">: {productdetails.brand}</p>
              </div>
            )}
            {productdetails.product_condition !== null && (
              <div className="d-flex col-md-9">
                <p className=" col-md-4 col-lg-5">
                  <b>Product_Condition</b>
                </p>
                <p className=" col-md-8 col-lg-10">
                  : {productdetails.product_condition}
                </p>
              </div>
            )}
            {productdetails.style !== null && (
              <div className="d-flex col-md-9">
                <p className=" col-md-4 col-lg-5">
                  <b>Style</b>
                </p>
                <p className=" col-md-8 col-lg-10">: {productdetails.style}</p>
              </div>
            )}
            {productdetails.season !== null && (
              <div className="d-flex col-md-9">
                <p className=" col-md-4 col-lg-5">
                  <b>Season</b>
                </p>
                <p className=" col-md-8 col-lg-10">: {productdetails.season}</p>
              </div>
            )}
            {productdetails.fit !== null && (
              <div className="d-flex col-md-9">
                <p className=" col-md-4 col-lg-5">
                  <b>Fit</b>
                </p>
                <p className=" col-md-8 col-lg-10">: {productdetails.fit}</p>
              </div>
            )}
            {productdetails.length !== null && (
              <div className="d-flex col-md-9">
                <p className=" col-md-4 col-lg-5">
                  <b>Length</b>
                </p>
                <p className=" col-md-8 col-lg-10">: {productdetails.length}</p>
              </div>
            )}
            <div className="d-flex col-md-9">
              <p className=" col-md-4 col-lg-5">
                <b>Times Worn</b>
              </p>
              <p className=" col-md-8  col-lg-10">: {productdetails.worn}</p>
            </div>
            <div className="d-flex col-md-9">
              <p className=" col-md-4 col-lg-5">
                <b>Product ID</b>
              </p>
              <p className=" col-md-8 col-lg-10">: {id}</p>
            </div>

            <p className="text-success fs-4">
              <b>&#8377;{productdetails.price}.00</b>
            </p>
            {admin !== "admin" ? (
              <>
                <div className="d-flex">
                  <b> QTY </b>: &nbsp;
                  <select className="form-select" style={{ width: "60px" }}>
                    <option value={1}>1</option>
                  </select>
                  <button
                    type="submit"
                    className="btn btn-secondary ms-3"
                    onClick={handleAddToCart}
                  >
                    ADD TO CART
                  </button>
                </div>
                <button
                  type="button"
                  className="btn  btn-outline-secondary mt-3 mb-3"
            onClick={handleAddToWishlist}

                >
                  <i className="bi bi-heart-fill" /> ADD TO WISHLIST
                </button>
              </>
            ) : (
              <>
              <button
                type="button"
                onClick={handleProductlist}
                className="btn  btn-outline-secondary mt-3 mb-3"
              >
                ADD TO PRODUCT LIST
              </button>
              &nbsp;
              <button
               type="button"
               className="btn  btn-danger mt-3 mb-3"
               onClick={handleRejectClick}
              >
                Reject
              </button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
