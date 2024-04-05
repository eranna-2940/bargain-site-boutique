import React, { useState, useEffect } from "react";
import Sellernavbar from "./Sellernavbar";
import Sellermenu from "./Sellermenu";
import Sellerfooter from "./Sellerfooter";
import Sellerpagination from "./sellerpagination";
import axios from "axios";
// import { Link } from "react-router-dom";

export default function Sellerorders() {
  // eslint-disable-next-line no-unused-vars
  const [allProducts, setAllProducts] = useState([]);
  const [orders,setOrders]=useState([])
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const [viewRowIndex, setViewRowIndex] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
    setViewRowIndex(null);
  }, [pageSize]);
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
  const [userdetails,setUserDetails]= useState([])

  useEffect(() => {
    // Fetch all products
    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/user`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const userid = sessionStorage.getItem("user-token");
          setUserDetails(res.data.filter((item)=>item.user_id.toString() === userid))
        }
      })
      .catch((error) => {
        console.log("Error fetching all products:", error);
      });
    },[])
  // const userId = parseInt(sessionStorage.getItem("user-token"));  

  // // Filter products that have orders
  // const filteredProducts = allProducts.filter((product) => {
  //   const order = orders.find((order) => order.product_id === product.id && order.buyer_id === userId);
  //   return order;
  // }).map((product) => {
  //   const order = orders.find((order) => order.product_id === product.id && order.buyer_id === userId);
  //   const userDetails = userdetails.find((user) => user.user_id === userId);
    
  //   return { 
  //     ...product, 
  //     paymentStatus: order.payment_status,
  //     orderID: order.orderID,
  //     customerName: userDetails ? userDetails.firstname : '' 
  //   };
  // });
  const userId = parseInt(sessionStorage.getItem("user-token"));  

// Filter products that have orders
const filteredProducts = allProducts.map((product) => {
  // Find orders corresponding to the product
  const productOrders = orders.filter((order) => order.product_id === product.id && order.buyer_id === userId);
  
  // Map over product orders and create a new product object for each order
  const mappedProducts = productOrders.map((order) => {
    const userDetails = userdetails.find((user) => user.user_id === order.buyer_id);
    return { 
      ...product, 
      paymentStatus: order.payment_status,
      orderID: order.orderID,
      customerName: userDetails ? userDetails.firstname + userDetails.lastname : ''
    };
  });

  return mappedProducts;
}).flat();

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  // eslint-disable-next-line no-unused-vars
  const tableData = filteredProducts.slice(startIndex, endIndex);
  
  const handleChecked = (e) => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    if (e.currentTarget.checked) {
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
      }
    } else {
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
    }
  };
  
  return (
    <div className="">
      <Sellernavbar />
      <div className="d-md-flex">
        <div className="col-md-2 selleraccordion">
          <Sellermenu />
        </div>
        <div className="col-md-10">
          <div className="fullscreen2">
            <main>
              <div className="d-flex justify-content-between m-2">
                <h4>Orders</h4>
                {/* <Link to="/addnewproduct">
                  <button className="btn btn-primary">
                    <i class="bi bi-plus-square-fill"></i> Add new product
                  </button>
                </Link> */}
              </div>
              <div className="border m-2">
                <div className=" p-2 bg-light text-danger">
                {tableData.length > 0 ? (null):(<b>Order Payment Status, reflects if the buyer has successfully
                  paid for the order. This does not mean the Seller has been
                  paid. Seller will be paid, once the product has been shipped
                  and buyer confirms receipt of the product</b>)}  
                </div>
                <div className="table-responsive p-3">
                  <table
                    id="dynamic-table"
                    className="table table-striped table-bordered table-hover dataTable no-footer"
                    role="grid"
                    aria-describedby="dynamic-table_info"
                  >
                    <thead className="">
                      <tr role="row">
                        <th className="sorting p-3" rowSpan="1" colSpan="1">
                          <label className="pos-rel">
                            <input
                              type="checkbox"
                              name="allcheckboxes"
                              className="ace"
                              onChange={handleChecked}
                            />
                            <span className="lbl"></span>
                          </label>
                        </th>
                        <th
                          className="sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="ID: activate to sort column ascending"
                        >
                          Order#
                        </th>
                        <th
                          className="sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="Name: activate to sort column ascending"
                        >
                          Order Payment Status
                        </th>
                        <th
                          className="sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="Address:activate to sort column ascending"
                        >
                          Customer
                        </th>
                        <th
                          className="hidden-480 sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="City: activate to sort column ascending"
                        >
                          Created on
                        </th>
                        <th
                          className="hidden-480 sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="Timings: activate to sort column ascending"
                        >
                          Product IDs
                        </th>
                        <th
                          className="hidden-480 sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="Status"
                        >
                          Add Tracking#
                        </th>
                        <th
                          className="hidden-480 sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="Status"
                        >
                          view
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                  {tableData.map((product, index) => (
                    <tr key={index}>
                      <td></td>
                      <td className="text-secondary">{product.name}</td>
                      <td>{product.paymentStatus ? <span className="text-success" style={{fontWeight:'600'}}>SUCCESS</span> : ""}</td>
                      <td>{product.customerName}</td>
                      <td></td>
                      <td>{product.orderID}</td>
                      <td></td>
                      <td><button className="btn btn-success">view</button></td>
                    </tr>
                  ))}
                </tbody>
                  </table>
                </div>
                <Sellerpagination
                  stateData={filteredProducts}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  setViewRowIndex={setViewRowIndex}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </main>
            <Sellerfooter />
          </div>
        </div>
      </div>
    </div>
  );
}
