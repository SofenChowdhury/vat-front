import React, { useState, useEffect } from "react";
import Router from "next/router";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../../theme";
import { Typography, useTheme, CircularProgress, Button } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../../base";

const ActivityDetails = ({ query, token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [activity, setActivity] = useState(null);

  const [attributeKeys, setAttributeKeys] = useState([]);
  const [oldKeys, setOldKeys] = useState([]);

  const id = query.id;

  const [loader, setLoader] = useState(true);

  // Fetch Details
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/activities/" + id;
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          setLoader(false);
          setActivity(res.data.data);
          setAttributeKeys(Object.keys(res.data.data.properties?.attributes));
          setOldKeys(Object.keys(res.data.data.properties?.old));
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  // RETURN TO LIST
  const goBack = () => {
    Router.push({
      pathname: "/activities/activityList",
    });
  };

  console.log(activity);

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Log Details
          </Typography>

          <div className="row">
            <div className="col-md-2 mt-4">
              <h6>Name:</h6>
            </div>
            <div className="col-md-4 mt-4">{activity.log_name}</div>
          </div>
          <div className="row">
            <div className="col-md-2 mt-2">
              <h6>Description:</h6>
            </div>
            <div className="col-md-4 mt-2">{activity.description}</div>
          </div>
          <div className="row">
            <div className="col-md-2 mt-2">
              <h6>Event:</h6>
            </div>
            <div className="col-md-4 mt-2">{activity.event}</div>
          </div>
          <div className="row">
            <div className="col-md-2 mt-2">
              <h6>Subject:</h6>
            </div>
            <div className="col-md-4 mt-2">{activity.subject_type}</div>
          </div>
          <div className="row">
            <div className="col-md-2 mt-2">
              <h6>Causer:</h6>
            </div>
            <div className="col-md-4 mt-2">{activity.causer?.name}</div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <table className="table table-striped table-bordered table-hover mt-5">
                <thead>
                  <tr>
                    <th colSpan={2} className="text-center">New</th>
                  </tr>
                  <tr>
                    <th className="col-4">Attribute</th>
                    <th className="col-4">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {attributeKeys.map((key) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{activity.properties.attributes[key]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <table className="table table-striped table-bordered table-hover mt-5">
                <thead>
                  <tr>
                    <th colSpan={2} className="text-center">Old</th>
                  </tr>
                  <tr>
                    <th className="col-4">Attribute</th>
                    <th className="col-4">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {oldKeys.map((key) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{activity.properties.old[key]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

ActivityDetails.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(ActivityDetails);
