import React from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import MyNavbar from "./navbar";
import Footer from "./footer";

export default function Cartitems() {
  const navigate = useNavigate();
  const { cartItems, calculateTotalPrice, removeFromCart } = useCart();
  const totalPrice = calculateTotalPrice();

  const checkout = () => {
    if (sessionStorage.getItem("token") !== null) {
      navigate("/checkoutpage");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main className="container">
        <div className="row">
          <div className="col">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Product Image</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <button
                        type="button"
                        className="btn-close w-50"
                        onClick={() => removeFromCart(product.id)}
                      ></button>
                    </td>
                    <td>
                      <div style={{ width: "70px", height: "60px" }}>
                        <img
                          src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${JSON.parse(product.image)[0]}`}
                          alt={product.name}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            backgroundSize: "contain"
                          }}
                        />
                      </div>
                    </td>
                    <td className="text-secondary">{product.name}</td>
                    <td>&#8377;{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center">
              <p><b>Total Price: &#8377; {totalPrice}</b></p>
              <button
                type="button"
                className="btn btn-primary"
                disabled={cartItems.length === 0} // Disable the button if cart is empty
                onClick={checkout}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </main>
      <br/>
      <Footer />
    </div>
  );
}
