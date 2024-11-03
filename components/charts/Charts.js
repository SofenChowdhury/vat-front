import React, { useEffect } from "react";

//charts
import { Bar, Pie, Line } from "react-chartjs-2";
import Chart from "chart.js/auto"; // important

//theme imports
import { Card, CardContent } from "@mui/material";

//redux imports
import { connect } from "react-redux";
//axios
import axios from "axios";
import { BASE_URL } from "../../base";

//moment
import moment from "moment";
import { useState } from "react";

//modal
import Modal from "../services/Modal";

//logout modal
import LogoutModal from "../forms/modalForms/Logout";

const Charts = ({ token }) => {
  const [salesData, setSalesData] = useState(null);
  const [salesDataVat, setSalesDataVat] = useState(null);

  //modals variables
  const [showModal, setShowModal] = useState(false);

  // FETCH CHART DATA
  useEffect(() => {
    const fetchData = async () => {
      const apiSales = BASE_URL + "api/v1/sales/report/comparison";

      const data = {
        start_date: "2023-01-01",
        end_date: "2023-12-31",
        type: "year",
      };

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        const response = await axios.post(apiSales, data, config);

        if (response.data.code == 103) {
          // alert("Session Expired! Please Logout and Login again!");
          setShowModal(true);
        } else {
          if (response.data.status) {
            setSalesData({
              labels: response.data.data.current_year?.map((data) =>
                moment(data.month_year, "MM-YYYY").format("MMMM")
              ),
              datasets: [
                {
                  label: "2023 Sales Value",
                  data: response.data.data.current_year?.map((data) =>
                    (+data.total_value).toFixed(2)
                  ),
                  // backgroundColor: [colors.greenAccent[400]],
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: ["rgb(75, 192, 192)"],
                  borderWidth: 1,
                },
              ],
            });
            setSalesDataVat({
              labels: response.data.data.current_year?.map((data) =>
                moment(data.month_year, "MM-YYYY").format("MMMM")
              ),
              datasets: [
                {
                  label: "2023 Sales VAT",
                  data: response.data.data.current_year?.map((data) =>
                    (+data.total_vat).toFixed(2)
                  ),
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                },
              ],
            });
          } else {
            console.log(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Modal onClose={() => setShowModal(false)} show={showModal} height={200} width={400}>
        <LogoutModal />
      </Modal>
      <div className="row ">
        {salesData != null && (
          <div className="col-md-6 mt-5">
            <Card>
              <CardContent className="text-center">
                <Bar data={salesData} height={100} />
              </CardContent>
            </Card>
          </div>
        )}
        {salesDataVat != null && (
          <div className="col-md-6 mt-5">
            <Card>
              <CardContent className="text-center">
                <Line data={salesDataVat} height={100} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(Charts);
