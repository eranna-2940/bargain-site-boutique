import React, { useState, useEffect } from "react";
import MyNavbar from "../navbar";
import Menu from "../menu";
import Filterdisplaynav from "../filterdisplaynav";
import { Link } from "react-router-dom";
import Product from "../Product";
import axios from "axios";
import Pagination from "../pagination";
import Footer from "../footer";

const Jewelryallcollection = () => {
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
  const [filteredProducts,setFilteredProducts]= useState([])
  // eslint-disable-next-line no-unused-vars
  const [viewRowIndex, setViewRowIndex] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/jewellery`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setProducts(res.data);
          setFilteredProducts(res.data)
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    setCurrentPage(1);
    setViewRowIndex(null);
  }, [pageSize]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const tableData = products.slice(startIndex, endIndex);
  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
      <nav className="p-2 ps-lg-5 pe-lg-5">
        <Link to="/" className="text-decoration-none text-dark">
          <i className="bi bi-house-fill"></i>
        </Link>
        &nbsp; / Jewellery
      </nav>
      <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5">
        <div className="col-lg-2 col-xs-12 col-md-12">
          <Menu />
        </div>

        <div className="col-xs-12 col-md-12 col-lg-10 ps-lg-3">
          <Filterdisplaynav pageSize={pageSize} setPageSize={setPageSize} />

          <div className="d-flex flex-wrap  justify-content-around gap-3">
            {tableData.length > 0 ? (
              tableData.map((product, index) => (
                <Product
                  product={product}
                  key={index}
                  rendercomp="jewelry"
                  type="jewelry"
                />
              ))
            ) : (
              <h4>No products to display</h4>
            )}
          </div>
          <Pagination
            stateData={products}
            pageSize={pageSize}
            setViewRowIndex={setViewRowIndex}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jewelryallcollection;
