import React, { useEffect,useState } from "react";
import MyNavbar from "../navbar";
import Customermenu from "./Customermenu";
import Footer from "../footer";
import Customerbanner from "./Customerbanner";
import axios from "axios";

export default function Orders() {

  const [allProducts, setAllProducts] = useState([]);
  const [orders,setOrders]=useState([])

  
  useEffect(() => {
    // Fetch all products
    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setAllProducts(res.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching all products:", error);
      });

    // Fetch orders
    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setOrders(res.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching orders:", error);
      });
  }, []);
  const userId = parseInt(sessionStorage.getItem("user-token")); 

  const filteredProducts = allProducts.filter((product) =>
    orders.some((order) => order.buyer_id === userId && order.product_id === product.id)
  );
  console.log(filteredProducts)
// console.log(filteredProducts)
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
  {filteredProducts.length > 0 ? (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Product Image</th>
          <th>Product Name</th>
          <th>Total Price</th>
        </tr>
      </thead>
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
          </tr>
        ))}
      </tbody>
    </table>
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
