import React, { useEffect, useState } from "react";
import MyNavbar from "../navbar";
import Customermenu from "./Customermenu";
// import { Link, useSearchParams } from "react-router-dom";
import Footer from "../footer";
import Customerbanner from "./Customerbanner";
import axios from "axios";

export default function Addresses() {
  const [address, setAddress] = useState([]);
  const [sellerdetails, setSellerDetails] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [orders, setOrders] = useState([]);

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
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/selleraccount`
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
  const [billingaddress, setBillingAddress] = useState([]);
  useEffect(() => {
    // Fetch all products
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveShippingAddress`
      )
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const userid = sessionStorage.getItem("user-token");
          setAddress(
            res.data.filter((item) => item.user_id === parseInt(userid))
          );
        }
      })
      .catch((error) => {
        console.log("Error fetching all products:", error);
      });
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveBillingAddress`
      )
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setBillingAddress(res.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching all products:", error);
      });
  }, []);

  const sellerId = parseInt(sessionStorage.getItem("user-token"));

  let filteredDetails = [];
  const sellerOrders = orders.filter((order) =>
    allProducts.some(
      (product) =>
        product.id === order.product_id && product.seller_id === sellerId
    )
  );
  filteredDetails = sellerOrders.map((order) =>
    billingaddress.find((item) => item.user_id === order.buyer_id)
  );

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
            {filteredDetails.length > 0 ||
            sellerdetails.length > 0 ||
            address.length > 0 ? (
              <>
                <div className="table-responsive">
                  {filteredDetails.length > 0 &&
                  sessionStorage.getItem("token") !== "admin" ? (
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>FirstName</th>
                          <th>LastName</th>
                          <th>email</th>
                          <th>Country</th>
                          <th>State</th>
                          <th>City</th>
                          <th>Address1</th>
                          <th>Pincode</th>
                        </tr>
                      </thead>
                      <tbody style={{ overflowY: "auto" }}>
                        {filteredDetails.map((item) => (
                          <tr>
                            <td>{item.firstname}</td>
                            <td>{item.lastname}</td>
                            <td>{item.email}</td>
                            <td>{item.country}</td>
                            <td>{item.state}</td>
                            <td>{item.city}</td>
                            <td>{item.address1}</td>
                            <td>{item.pincode}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : null}
                  {sessionStorage.getItem("token") === "admin" &&
                  sellerdetails.length > 0 ? (
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>SellerName</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Upi_id</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody style={{ overflowY: "auto" }}>
                        {sellerdetails.map((item) => (
                          <tr>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.phone}</td>
                            <td>{item.upi_id}</td>
                            <td>{item.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : null}
                  {address.length > 0 ? (
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>FirstName</th>
                          <th>LastName</th>
                          <th>email</th>
                          <th>Country</th>
                          <th>State</th>
                          <th>City</th>
                          <th>Address1</th>
                          <th>Pincode</th>
                        </tr>
                      </thead>
                      <tbody style={{ overflowY: "auto" }}>
                        {address.map((item) => (
                          <tr>
                            <td>{item.firstname}</td>
                            <td>{item.lastname}</td>
                            <td>{item.email}</td>
                            <td>{item.country}</td>
                            <td>{item.state}</td>
                            <td>{item.city}</td>
                            <td>{item.address1}</td>
                            <td>{item.pincode}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : null}
                </div>
              </>
            ) : (
              <p className="fs-6">No Addresses</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
