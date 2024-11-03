import React, { useEffect, useState } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../theme";
import {
  Typography,
  useTheme,
  Button,
  CircularProgress,
  Pagination,
  TextField,
  MenuItem,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

//date
import { DatePicker } from "antd";
import moment from "moment";

const ActivityList = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [user_id, setUserId] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");

  // Helpers
  const [type, setType] = useState("date");
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Date Variables
  const { RangePicker } = DatePicker;

  // FETCHING ADMINS
  useEffect(() => {
    const apiUsers = BASE_URL + "api/v1/admin-list";

    axios
      .get(apiUsers, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setUsers(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // FETCHING ACTIVITIES
  useEffect(() => {
    const apiActivities =
      BASE_URL +
      "api/v1/activities?page=" +
      page +
      "&user_id=" +
      user_id +
      "&start_date=" +
      start_date +
      "&end_date=" +
      end_date;

    const data = {
      start_date,
      end_date,
      user_id,
    };

    axios
      .post(apiActivities, data, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status) {
          setLoader(false);
          setActivities(res.data.data.data);
          setLastPage(res.data.data.last_page);
        } else {
          setErrorMessage(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page, start_date, end_date, user_id]);

  // Pagination
  const handleChange = (e, page) => {
    setPage(page);
  };

  // Date function
  const onChangeYear = (date, dateString) => {
    if (date) {
      setStartDate(`${dateString}-01-01`);
      setEndDate(`${dateString}-12-31`);
    }
  };
  const onChangeMonth = (date, dateString) => {
    const firstDayOfMonth = moment(date).startOf("month");
    const lastDayOfMonth = moment(date).endOf("month");

    setStartDate(firstDayOfMonth.format("YYYY-MM-DD"));
    setEndDate(lastDayOfMonth.format("YYYY-MM-DD"));
  };
  const onChangeDate = (date, dateString) => {
    dateString?.map((date, index) => {
      if (index == 0) setStartDate(date);
      else setEndDate(date);
    });
  };

  console.log(activities);

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="row">
            <div className="col-md-12">
              <Typography
                variant="h2"
                className="mb-4"
                color={colors.greenAccent[300]}
              >
                Activity Log
              </Typography>
            </div>
          </div>
          {errorMessage != "" ? (
            <div className="row">
              <h5 className="text-danger">{errorMessage}</h5>
            </div>
          ) : (
            <>
              <div className="row">
                <div className="col-md-3 mt-4">
                  <TextField
                    label="Select Admin"
                    variant="outlined"
                    select
                    size="large"
                    type="text"
                    fullWidth
                    value={user_id || ""}
                    className="shadow-input"
                    onChange={(e) => {
                      setUserId(e.target.value);
                    }}
                  >
                    {users?.map((user, index) => (
                      <MenuItem value={user.id} key={index}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="col-md-3 mt-4">
                  <TextField
                    label="Time Period"
                    variant="outlined"
                    select
                    size="large"
                    type="text"
                    fullWidth
                    value={type || ""}
                    className="shadow-input"
                    onChange={(e) => {
                      setType(e.target.value);
                    }}
                  >
                    <MenuItem value={"year"}>Year</MenuItem>
                    <MenuItem value={"month"}>Month</MenuItem>
                    <MenuItem value={"date"}>Date Range</MenuItem>
                  </TextField>
                </div>
                <div className="col-md-3 mt-4">
                  {type == "year" && (
                    <DatePicker
                      picker="year"
                      onChange={onChangeYear}
                      size="large"
                      style={{ width: "100%", height: "58px" }}
                      className="shadow-input"
                      defaultValue={""}
                    />
                  )}
                  {type == "month" && (
                    <DatePicker
                      picker="month"
                      onChange={onChangeMonth}
                      size="large"
                      style={{ width: "100%", height: "58px" }}
                      className="shadow-input"
                    />
                  )}
                  {type == "date" && (
                    <RangePicker
                      onChange={onChangeDate}
                      size="large"
                      style={{ width: "100%", height: "58px" }}
                      className="shadow-input"
                    />
                  )}
                </div>
              </div>
              <table className="table table-hover table-striped mt-5">
                <thead>
                  <tr className="table-success">
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Event</th>
                    <th>Subject</th>
                    <th>Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activities?.map((activity, index) => (
                    <tr key={index}>
                      <th>{index + 1 + (page - 1) * 20}</th>
                      <td>{activity.log_name}</td>
                      <td>{activity.description}</td>
                      <td>{activity.event}</td>
                      <td>{activity.subject_type}</td>
                      <td>
                        {moment(activity.created_at).format(
                          "DD MMM, YYYY hh:mm a"
                        )}
                      </td>
                      <td>
                        <Link
                          href={`/activities/activityDetails/${activity.id}`}
                        >
                          <Button variant="contained" size="large">
                            Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="row justify-content-center">
                <div className="col-md-12 d-flex justify-content-center">
                  <Pagination
                    count={lastPage}
                    page={page}
                    color="secondary"
                    size="large"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(ActivityList);
