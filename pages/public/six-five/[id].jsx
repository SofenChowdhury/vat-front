import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { CircularProgress } from "@mui/material";

// axios
import axios from "axios";
import { BASE_URL } from "../../../base";

// date
import moment from "moment";

const SixFive = ({ query, token }) => {
  const [transfersDetails, setTransfersDetails] = useState(null);
  const [loader, setLoader] = useState(true);
  const id = query.id;

  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/public/check-transfer/" + id;
    console.log(apiUrl);
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          setLoader(false);
          setTransfersDetails(res.data.data);
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const calculate = () => {
    let total = 0;
    transfersDetails?.transfer_items?.map((item) => {
      total += item.price * item.qty;
    });
    return total.toFixed(2);
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="p-3">
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <div className="row justify-content-md-center">
                  <div className="col-md-auto">
                    <b>Government of the People's Republic of Bangladesh</b>
                  </div>
                </div>
                <div className="row justify-content-md-center">
                  <div className="col-md-auto">
                    <b>National Board of Revenue</b>
                  </div>
                </div>

                <div className="row justify-content-md-center">
                  <div className="col-md-auto">
                    <b>
                      Invoice for Transfer Goods of Central Registered
                      Organization
                    </b>
                  </div>
                </div>
                <div className="row justify-content-md-center">
                  <div className="col-md-auto">
                    [See clauses (UMO) of Sub-Rule (1) of Rule 40]
                  </div>
                </div>
                <div className="row justify-content-md-center mt-2">
                  <div className="col-md-auto">
                    <b>Name of Registered Person: </b>
                    {transfersDetails?.from_branch.company.name}
                  </div>
                </div>
                <div className="row justify-content-md-center mt-1">
                  <div className="col-md-auto">
                    <b>BIN of Registered Person: </b>
                    {transfersDetails?.from_branch.company.company_bin}
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="row">
                  <div className="col-md-12">
                    <b className="float-end me-5">Mushak - 6.5</b>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-between mt-5">
              <div className="col-md-7">
                <b>Name of the unit/Branch/Warehouse Sending supply: </b>
                {transfersDetails?.from_branch.name}
              </div>
              <div className="col-md-5">
                <b>Challan No: </b>
                {transfersDetails.transfer_no}
              </div>
            </div>
            <div className="row justify-content-between">
              <div className="col-md-7">
                <b>Address: </b>
                {transfersDetails?.from_branch.address}
              </div>
              <div className="col-md-5">
                <b>Date of Issue: </b>
                {moment(transfersDetails.created_at).format("DD MMMM, YYYY")}
              </div>
            </div>
            <div className="row justify-content-between">
              <div className="col-md-7">
                <b>Name of the unit/Branch/Warehouse Receipent supply: </b>
                {transfersDetails?.to_branch.name}
              </div>
              <div className="col-md-5">
                <b>Time of Issue: </b>
                {moment(transfersDetails.created_at).format("hh:mm A")}
              </div>
            </div>
            <div className="row justify-content-between">
              <div className="col-md-7">
                <b>Address: </b>
                {transfersDetails?.to_branch.address}
              </div>

              <div className="col-md-5">
                <b>Vehicle Info: </b>
                {transfersDetails.vehicle_info}
              </div>
            </div>

            {/* TABLE */}
            <div className="mt-4">
              <table className="table table-hover table-bordered">
                <thead>
                  <tr className="text-center">
                    <th>S/L NO</th>
                    <th>Good/Service Description (Incases with Brand Name)</th>
                    <th>Quantity</th>
                    <th>Value Excluding Tax (TAKA)</th>
                    {/* <th>Amount of Applicable Tax (TAKA)</th> */}
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th>5</th>
                  </tr>
                  {transfersDetails?.transfer_items?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {item.item_info?.title} - {item.item_info?.sku}
                      </td>
                      <td>{item.qty}</td>
                      <td className="text-end">{item.price * item.qty}</td>
                      <td>{transfersDetails.note}</td>
                    </tr>
                  ))}
                  <tr>
                    <th colSpan={3} className="text-end">
                      Total
                    </th>
                    <td>{calculate()}</td>
                    {/* <td></td> */}
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="row mt-4">
              <div className="col-md-12">
                <b>Signature of Organization Officer-in-Charge:</b>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-12">
                <b>Name and Designation:</b>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12">
                <b>Mobile Number:</b>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

SixFive.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(SixFive);
