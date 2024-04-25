import React, { useState, useEffect } from "react";
import Sellernavbar from "./Sellernavbar";
import Sellermenu from "./Sellermenu";
import Sellerpagination from "./sellerpagination";
import Sellerfooter from "./Sellerfooter";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Shipments() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [trackDetails, setTrackDetails] = useState([]);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setProducts(res.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching all products:", error);
      });

    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/updatepayment`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setOrders(res.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching orders:", error);
      });

    axios.get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/tracking`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setTrackDetails(res.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching tracking details:", error);
      });
  }, []);

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
 // Function to calculate weight based on product name length
const calculateWeight = (productName) => {
  // Return the number of letters in the product name
  return productName.length;
};

// Example usage
const productName = "Example Product";
const productWeight = calculateWeight(productName);

  
  const userId = parseInt(sessionStorage.getItem("user-token"));  

  const filteredProducts = products.map((product) => {
    // Find orders corresponding to the product
    const productOrders = orders.filter((order) => order.product_id === product.id && product.seller_id === userId);
  
    // Map over product orders and create a new product object for each order
    const mappedProducts = productOrders.map((order) => {
      const trackDetail = trackDetails.find((track) => track.order_id === order.orderID);
      const createdAt = trackDetail ? new Date(trackDetail.dateshipped) : null;
      const formattedDate = createdAt ? createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }) : '';
    
      const dateDelivered = trackDetail ? new Date(Math.round(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000)) : null;
      const formattedDate2 = dateDelivered ? dateDelivered.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }):"";
      return { 
        ...product, 
        orderID: order.orderID,
        trackingNumber: trackDetail ? trackDetail.tracking_number : '',
        dataShipped: formattedDate,
        dateDelivered: formattedDate2
      };
    });
  
    return mappedProducts;
  }).flat();

  // const filteredProducts = products.map((product) => {
  //   // Find orders corresponding to the product
  //   const productOrders = orders.filter((order) => order.product_id === product.id && product.seller_id === userId);
  
  //   // Map over product orders and create a new product object for each order
  //   const mappedProducts = productOrders.map((order) => {
  //     const trackDetail = trackDetails.find((track) => track.order_id === order.orderID);
  //     const trackingNumber = trackDetail ? trackDetail.tracking_number : '';
  //     const dataShipped = trackDetail ? new Date(trackDetail.dateshipped) : '';
  //     const orderID = order.orderID
  //     const dataShippedDate = dataShipped ? new Date(dataShipped) : null;
  //     const roundedDays = dataShippedDate ? Math.round((dataShippedDate.getTime() + 3 * 24 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000)) : null;
  //     const dateDelivered = dataShippedDate ? new Date(roundedDays * 24 * 60 * 60 * 1000) : null;
      
  //     return { 
  //       ...product, 
  //       trackingNumber,
  //        orderID,
  //       dataShipped: dataShipped ? dataShipped.toLocaleDateString('en-US', {
  //         year: 'numeric',
  //         month: '2-digit',
  //         day: '2-digit',
  //       }) : '',
  //       dateDelivered: dateDelivered ? dateDelivered.toLocaleDateString('en-US', {
  //         year: 'numeric',
  //         month: '2-digit',
  //         day: '2-digit',
  //       }) : '',
  //     };
  //   });
  
  //   return mappedProducts;
  // }).flat();

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
                <h4>Shipments</h4>
                <div className="d-flex gap-2">
                  <Link to="/addnewproduct">
                    <button className="btn btn-info">
                      <i className="bi bi-truck"></i> Set as shipped(selected)
                    </button>
                  </Link>
                  <Link to="/addnewproduct">
                    <button className="btn btn-success">
                      <i className="bi bi-check2-circle"></i> Set as delivered(selected)
                    </button>
                  </Link>
                </div>
              </div>

              <div className="border m-3 rounded">
                <div className="table-responsive p-3">
                  <table
                    id="dynamic-table"
                    className="table table-striped table-bordered table-hover dataTable no-footer"
                    role="grid"
                    aria-describedby="dynamic-table_info"
                  >
                    <thead>
                      <tr>
                        <th>
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
                        <th>Shipment#</th>
                        <th>Order#</th>
                        <th>Tracking Number</th>
                        <th>Total Weight</th>
                        <th>Date Shipped</th>
                        <th>Date Delivered</th>
                        <th>View</th>
                      </tr>
                    </thead>
                    <tbody>
                                { filteredProducts.length > 0 ?(
          filteredProducts.map((product, index) => {
            return (
              <tr key={index}>
                <td>
                  <label className="pos-rel">
                    <input
                      type="checkbox"
                      name={`checkbox-${index}`}
                      className="ace"
                    />
                    <span className="lbl"></span>
                  </label>
                </td>
                <td>{product.orderID}</td>
                <td>{product.name}</td>
                <td>{product.trackingNumber}</td>
                <td>{productWeight}</td>
                <td>{product.dataShipped}</td>
                <td>{product.dateDelivered}</td>
                <td>
                  <Link to={`/view/${product.orderID}`}>
                    <button className="btn btn-sm btn-info" >View</button>
                  </Link>
                </td>
              </tr>
            );
          })
                                ):(
          <tr> NO Data available</tr>
                      )
                    }
                    </tbody>
                  </table>
                </div>

                <Sellerpagination
                  stateData={products}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
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
