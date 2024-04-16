import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MyNavbar from "../navbar";
import Menu from "../menu";
import Filterdisplaynav from "../filterdisplaynav";
import Filter from "./filter";
import Highendcoutureimg from "../../images/highendcouture.jpg";
import Sareesimg from "../../images/sarees.webp";
import Lehengaimg from "../../images/lehanga.jpeg";
import Dressesimg from "../../images/dresses.webp";
import Twinningoutfitsimg from "../../images/twinningoutfits.jpg";
import Product from "../Product";
import axios from "axios";
import Pagination from "../pagination";
import Footer from "../footer";

const Womenallproducts = () => {
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [viewRowIndex, setViewRowIndex] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/women`)
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          setProducts(res.data);
          setFilteredProducts(res.data);
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
  const tableData = filteredProducts.slice(startIndex, endIndex);

  // console.log(products)
  const handleFilter = (filteredProducts) => {
    setFilteredProducts(filteredProducts);
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
      <h3
        className="ps-lg-5 ps-2 text-center"
        style={{ textShadow: "2px 3px 2px gray" }}
      >
        Womens Fashion
      </h3>
      <div className="scroll-container">
        <div className="m-md-4 m-2 ">
          <Link to="/highendcouture" className="text-dark text-decoration-none">
            <img
              src={Highendcoutureimg}
              alt="high end couture"
              className=" rounded-circle womenallimgs"
            />
            <p>High end Couture</p>
          </Link>
        </div>
        <div className="m-md-4 m-2">
          <Link to="/sarees" className="text-dark text-decoration-none">
            <img
              src={Sareesimg}
              alt="sarees"
              className=" rounded-circle womenallimgs"
            />
            <p>Sarees</p>
          </Link>
        </div>
        <div className="m-md-4 m-2">
          <Link to="/lehanga" className="text-dark text-decoration-none">
            <img
              src={Lehengaimg}
              alt="Lehangas"
              className=" rounded-circle womenallimgs"
            />
            <p>Lehangas</p>
          </Link>
        </div>
        <div className="m-md-4 m-2">
          <Link to="/dresses" className="text-dark text-decoration-none">
            <img
              src={Dressesimg}
              alt="dresses"
              className="rounded-circle womenallimgs"
            />
            <p>Dresses</p>
          </Link>
        </div>
        <div className="m-md-4 m-2">
          <Link
            to="/twinningoutfits"
            className="text-dark text-decoration-none"
          >
            <img
              src={Twinningoutfitsimg}
              alt="twinning outfits"
              className="rounded-circle womenallimgs"
            />
            <p>Twinning Outfits</p>
          </Link>
        </div>
      </div>
      <nav className="p-2 ps-lg-5 pe-lg-5">
        <Link to="/" className="text-decoration-none text-dark">
          <i className="bi bi-house-fill"></i>
        </Link>
        &nbsp; / Women
      </nav>
      <div className="d-lg-flex justify-content-around p-2 ps-lg-5 pe-lg-5 ">
        <div className="col-lg-2 col-xs-12 col-md-12">
          <Menu />
          <Filter products={products} onFilter={handleFilter} />
        </div>
        <div className="col-xs-12 col-md-12 col-lg-10 ps-lg-3">
          <Filterdisplaynav pageSize={pageSize} setPageSize={setPageSize} />

          <div className="d-flex flex-wrap  justify-content-around gap-3">
            {tableData.length > 0 ? (
              tableData.map((product, index) => (
                <Product product={product} key={index} admin="women" />
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

export default Womenallproducts;
