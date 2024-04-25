import React, { useState, useEffect } from "react";
import Sellernavbar from "./Sellernavbar";
import Sellermenu from "./Sellermenu";
import Sellerfooter from "./Sellerfooter";
import Sellerpagination from "./sellerpagination";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Sellerproducts() {
  // eslint-disable-next-line no-unused-vars
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [filteredProducts, setFilteredProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [viewRowIndex, setViewRowIndex] = useState(null);
  const userid = sessionStorage.getItem('user-token')

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/allproducts`)
  //     .then((res) => {
  //       if (res.data !== "Fail" && res.data !== "Error") {
  //         const filteredProducts = res.data.filter(item => 
  //           item.seller_id.toString() === sessionStorage.getItem("user-token") &&
  //          item.rejectedReason
  //       );        
  //         setProducts(filteredProducts);

  //         setFilteredProducts(filteredProducts);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    // Fetching all products
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sellerproducts`)
      .then((res) => {
        console.log(res.data);
        if (res.data !== "Fail" && res.data !== "Error") {
          const rejectedProducts = res.data.filter(item => item.rejectedReason !== null && item.accepted_by_admin === "false" && item.seller_id.toString() === userid);
          const approvedProducts = res.data.filter(item => item.accepted_by_admin === "true" && item.seller_id.toString() === userid);
           
          const pendingProducts = res.data.filter(item =>item.rejectedReason === null && item.accepted_by_admin === "false" && item.seller_id.toString() === userid);

          const mergedProducts = [...approvedProducts, ...rejectedProducts, ...pendingProducts];
           setFilteredProducts(mergedProducts)

          // console.log(approvedProducts)
          // // Fetching admin products (rejected)
          // axios
          //   .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/adminproducts`)
          //   .then((adminRes) => {
          //     console.log(adminRes.data);
          //     if (adminRes.data !== "Fail" && adminRes.data !== "Error") {
          //       const rejectedProducts = adminRes.data.filter(item => item.rejectedReason !== null && item.accepted_by_admin === "false" && item.seller_id.toString() === userid);
          //       // Fetching pending products
          //       const pendingProducts = adminRes.data.filter(item =>item.rejectedReason === null && item.accepted_by_admin === "false" && item.seller_id.toString() === userid);
          //       // Merge all products
          //       const mergedProducts = [...approvedProducts, ...rejectedProducts, ...pendingProducts];
          //       setProducts(mergedProducts);
          //       setFilteredProducts(mergedProducts)
          //     }
          //   })
          //   .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, [userid]);
  
  useEffect(() => {
    setCurrentPage(1);
    setViewRowIndex(null);
  }, [pageSize]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  // eslint-disable-next-line no-unused-vars
  const tableData = filteredProducts.slice(startIndex, endIndex);

  const handleDelete = (id) => {
    axios
    .delete(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/handleproducts/${id}`)
    .then((response) => {
      // console.log(response.data);
      alert("Product has been deleted!");
      window.location.reload(false);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <div className="">
      <Sellernavbar />
      <div className="d-md-flex">
        <div className="col-md-2 selleraccordion">
          <Sellermenu />
        </div>
        <div className="col-md-10 ">
          <div className="fullscreen2">
            <main>
              <div className="d-flex justify-content-between m-2">
                <h4>Products</h4>
                <Link to="/addnewproduct">
                  <button className="btn btn-primary">
                    <i className="bi bi-plus-square-fill"></i> Add new product
                  </button>
                </Link>
              </div>

              <div className="border m-3 rounded">
                <div className="table-responsive p-3">
                  <table
                    id="dynamic-table"
                    className="table table-striped table-bordered table-hover dataTable no-footer"
                    role="grid"
                    aria-describedby="dynamic-table_info"
                  >
                    <thead className="">
                      <tr role="row">
                        <th
                          className="sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="ID: activate to sort column ascending"
                        >
                          Product ID
                        </th>
                        <th
                          className="sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="Name: activate to sort column ascending"
                        >
                          Picture
                        </th>
                        <th
                          className="sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="Address:activate to sort column ascending"
                        >
                          Product Name
                        </th>
                        <th
                          className="hidden-480 sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="City: activate to sort column ascending"
                        >
                          Price Including Shipping
                        </th>
                        <th
                          className="hidden-480 sorting p-3"
                          tabIndex="0"
                          aria-controls="dynamic-table"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="Timings: activate to sort column ascending"
                        >
                          Product Status
                        </th>
                        <th
                          className="hidden-480 sorting p-3"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="Status"
                        >
                          Order Created Date
                        </th>
                        <th
                          className="hidden-480 sorting p-3"
                          rowSpan="1"
                          colSpan="1"
                          aria-label="Status"
                        >
                          Edit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.id}</td>
                            <td style={{width:"100px",height:"100px"}}>
                              <img
                                src={`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/images/${JSON.parse(item.image)[0]}`}
                                // height="100px"
                                // width="100px"
                                alt="sellerproduct"
                                style={{maxWidth:"100%",height:"100px",objectFit:"contain"}}
                              ></img>
                            </td>
                            <td>{item.name}</td>
                            <td>&#8377;{item.price}.00</td>
                                    <td>
                            {item.accepted_by_admin === 'true' ? 
                              <span className="text-success" style={{fontWeight:"600"}}>Approved</span> : 
                              (item.rejectedReason ? 
                                <>
                                  <div><span className="text-danger" style={{fontWeight:"600"}}>Rejected</span></div>
                                  <div>Reason : {item.rejectedReason}</div>
                                </> : 
                                <span className="text-warning" style={{fontWeight:"600"}}>...Pending</span>)}
                      </td>
                            <td></td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(item.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <Sellerpagination
                  stateData={products}
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
