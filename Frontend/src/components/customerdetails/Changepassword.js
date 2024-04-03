import React from "react";
import MyNavbar from "../navbar";
import Customermenu from "./Customermenu";
import Footer from "../footer";
import Customerbanner from "./Customerbanner";

export default function Changepassword() {
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
          <form>
            <div>
              <div className="d-md-flex col-md-8 col-xs-12 mt-3 mb-3">
                <label htmlFor="oldpassword" className="col-md-4 col-xs-12">
                  Old Password
                </label>
                <div className="d-flex col-md-8">
                  <input
                    type="password"
                    name="oldpassword"
                    id="oldpassword"
                    placeholder="Old Password"
                    className="form-control"
                  />
                  &nbsp;<span className="text-danger fs-4">*</span>
                </div>
              </div>
              <div className="d-md-flex col-md-8 col-xs-12 mt-3 mb-3">
                <label htmlFor="newpassword" className="col-md-4 col-xs-12">
                  New Password
                </label>
                <div className="d-flex col-md-8">
                  <input
                    type="password"
                    name="newpassword"
                    id="newpassword"
                    placeholder="New Password"
                    className="form-control"
                    required
                  />
                  &nbsp;<span className="text-danger fs-4">*</span>
                </div>
              </div>
              <div className="d-md-flex col-md-8 col-xs-12 mt-3 mb-3">
                <label htmlFor="confirmpassword" className="col-md-4 col-xs-12">
                  Confirm Password
                </label>
                <div className="d-flex col-md-8">
                  <input
                    type="password"
                    name="confirmpassword"
                    id="confirmpassword"
                    placeholder="Confirm Password"
                    className="form-control"
                    required
                  />
                  &nbsp;<span className="text-danger fs-4">*</span>
                </div>
              </div>
            </div>
            <button type="button" className="btn btn-success mt-3 mb-5">
              Change Password
            </button>
          </form>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
