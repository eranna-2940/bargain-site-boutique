import React, { useEffect, useState } from "react";
import MyNavbar from "../navbar";
import Customermenu from "./Customermenu";
import Footer from "../footer";
import Customerbanner from "./Customerbanner";
import axios from "axios";

export default function Orders() {
  const [allProducts, setAllProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sellerdetails,setSellerDetails]=useState([])

  useEffect(() => {
    // Fetch all products
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`
      )
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setAllProducts(res.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching all products:", error);
      });

    // Fetch orders
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`
      )
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setOrders(res.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching orders:", error);
      });
      axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/user`
      )
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setSellerDetails(res.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching orders:", error);
      });
  }, []);
  const userId = parseInt(sessionStorage.getItem("user-token"));

  const filteredProducts = allProducts.filter((product) =>
    orders.some(
      (order) => order.buyer_id === userId && order.product_id === product.id
    )
  );
  const filteredProduct = allProducts.filter((product) =>
    orders.some(
      (order) =>order.product_id === product.id && product.seller_id.toString() === sessionStorage.getItem('user-token')
    )
  );
  // const isAdmin = sessionStorage.getItem("token") === "admin";

// Aggregate products by seller ID and count the number of products for each seller
const sellerProductCounts = {};
const sellerProductStatus = {};

allProducts.forEach((product) => {
  const sellerId = product.seller_id.toString();
  if (!sellerProductCounts[sellerId]) {
    sellerProductCounts[sellerId] = 1;
  } else {
    sellerProductCounts[sellerId]++;
  }

  // Check if the product is sold or not based on its quantity
  if (product.quantity === 0) {
    if (!sellerProductStatus[sellerId]) {
      sellerProductStatus[sellerId] = { sold: 1, pending: 0 };
    } else {
      sellerProductStatus[sellerId].sold++;
    }
  } else {
    if (!sellerProductStatus[sellerId]) {
      sellerProductStatus[sellerId] = { sold: 0, pending: 1 };
    } else {
      sellerProductStatus[sellerId].pending++;
    }
  }
});

console.log(sellerProductCounts);
console.log(sellerProductStatus);

// console.log(sellerProductCounts);
console.log(sellerProductStatus);

  const handlecancel = (id, updatedQuantity) => {
    axios
      .post(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateproducts`,
        {
          product_id: parseInt(id),
          quantity: updatedQuantity,
        }
      )
      .then((response) => {
        console.log(response);
      });
    axios
      .delete(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updateorder/${id}`,
        {
          data: {
            userID: userId,
          },
        }
      )
      .then((res) => {
        alert("Are you sure order was cancelled");
        window.location.reload(false);
      })
      .catch((error) => {
        console.error("Error updating product quantity:", error);
      });
  };
  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
        <Customerbanner />

        <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5">
          <div className="col-lg-3 col-xs-12 col-md-12 p-lg-4 p-2">
            <Customermenu />
          </div>

          <div className="col-xs-12 col-md-12 col-lg-9 p-lg-4 p-2">
  {(filteredProducts.length > 0 || filteredProduct.length > 0 || Object.keys(sellerProductCounts).length > 0) ? (
    <>
      {filteredProducts.length > 0 ? (
        <table className="table table-hover">
          {/* Table header */}
          <thead>
            <tr>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Total Price</th>
              <th>Action</th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {filteredProducts.map((product, index) => (
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
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handlecancel(product.id, product.quantity + 1)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {filteredProduct.length > 0 && sessionStorage.getItem("token") !== "admin" ? (
        <table className="table table-hover">
          {/* Table header */}
          <thead>
            <tr>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Total Price</th>
              {/* Add other seller-specific columns if needed */}
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {filteredProduct.map((product, index) => (
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
                {/* Add other seller-specific columns if needed */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

{sessionStorage.getItem("token") === "admin" && Object.keys(sellerProductCounts).length > 0 ? (
  <table className="table table-hover">
    <thead>
      <tr>
        <th>Seller Name</th>
        <th>Number of Products</th>
        <th>Number of sold</th>
        <th>Number of unsold</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(sellerProductCounts).map((sellerId, index) => {
        const seller = sellerdetails.find((seller) => seller.user_id.toString() === sellerId);
        if (!seller) return null; // Skip rendering if seller is not found
        const soldCount = sellerProductStatus[sellerId]?.sold || 0;
        const pendingCount = sellerProductStatus[sellerId]?.pending || 0;

        return (
          <tr key={index}>
            <td>{seller.firstname}</td> {/* Make sure to adjust property name based on your data */}
            <td>{sellerProductCounts[sellerId]}</td>
            <td>{soldCount > 0 ? `${soldCount} Sold` : 0}</td>
            <td>{pendingCount > 0 ? `${pendingCount} Not Sold` : 0}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
) : null}
    </>
  ) : (
    <p>No orders</p>
  )}
</div>




        </div>
      </main>
      <Footer />
    </div>
  );
}
