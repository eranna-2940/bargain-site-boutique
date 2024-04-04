import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import MyNavbar from "./navbar";
import Footer from "./footer";

export default function Emailverification() {
  const { state } = useLocation();

  const [values, setValues] = useState(state.values);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [otpsent,setOtpSent]=useState(false)

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const verifyOTP = () => {
    const otp = document.querySelector(".otp_num").value;
    axios
      .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/verify`, {
        email: values.email,
        otp: otp,
      })
      .then((res) => {
        if (res.status === 200) {
          setShowSuccess(true);
          setShowVerification(false);
          axios
            .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/register`, values)
            .then((res) => {
              if (res.data === "Error") {
                setErrorMessage("User Registration Failed");
              } else {
                alert("New user registered successfully");
                navigate("/");
              }
            })
            .catch((err) => console.log(err));
        } else {
          setErrorMessage("Invalid OTP");
          setShowSuccess(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const sendOTP = () => {
    axios
      .post(`${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/sendotp`, {
        email: values.email,
      })
      .then((res) => {
        if (res.status === 200) {
          setShowVerification(true);
          setErrorMessage("");
          setOtpSent(true)

        } else {
          setErrorMessage("Email not exist");
        }
      })
      .catch((err) => {
        setErrorMessage("Email not exist");
      });
  };

  return (
    <div className="fullscreen">
      <MyNavbar />
      <main>
      <div className="d-flex justify-content-center">
        <div className="container m-4">
          <div className="text-end">
            <Link to="/register" className="text-decoration-none">
              Back to Registration
            </Link>
          </div>
          <h3 className="text-primary text-center">Email Verification</h3>
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-auto">
              <input
                type="email"
                name="email"
                className="form-control"
                value={values.email}
                onChange={handleChange}
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-primary" onClick={sendOTP}  disabled={otpsent}>
                Send OTP
              </button>
            </div>
          </div>
          {showSuccess && (
            <div className="success text-success text-center">
              OTP verified successfully
            </div>
          )}
          {showVerification && (
            <div className="verification mt-4">
              <div className="title text-center">
                <p>
                  An OTP has been sent to{" "}
                  <span className="emailpartial">
                    ***{values.email.slice(3)}
                  </span>
                </p>
              </div>
              <div
                className="otp-input-fields m-auto d-flex justify-content-around p-4 shadow rounded"
                style={{ maxWidth: "320px" }}
              >
                <input
                  type="number"
                  className="otp_num w-auto text-center rounded border border-success"
                  maxLength={4}
                />
                <button onClick={verifyOTP} className="btn btn-primary">
                  Verify
                </button>
              </div>
            </div>
          )}
          {errorMessage && (
            <div className="error text-danger text-center">{errorMessage}</div>
          )}
        </div>
      </div>
      </main>
      <Footer/>
    </div>
  );
}
