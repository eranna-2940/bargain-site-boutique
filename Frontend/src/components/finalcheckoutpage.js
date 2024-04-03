import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Finalcheckoutpage() {
  // eslint-disable-next-line no-unused-vars
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("user-token");
    if (!token) return;

    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/addcart`)
      .then((response) => {
        if (response.data !== "Fail" && response.data !== "Error") {
          if (sessionStorage.getItem("user-token") !== null) {
            const filteredProducts = response.data.filter((item) => item.userid.toString() === sessionStorage.getItem("user-token"));
            setProduct(filteredProducts);

            // Execute update request for each item in the cart
            filteredProducts.forEach((item) => {
              axios
                .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`, {
                  payment_status: true,
                  token,
                  product_id: item.product_id,
                  main_id: item.id
                })
                .then((res) => {
                  alert("Payment completed and product purchased");
                  window.location.href = `${process.env.REACT_APP_HOST}3000/bargain_db`;
                })
                .catch((err) => console.log("Error updating payment status:", err));
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }, []);

  return <div>Loading...</div>;
}
