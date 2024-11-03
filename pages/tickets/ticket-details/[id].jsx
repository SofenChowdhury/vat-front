import { tokens } from "../../theme";
import React, { useState, useEffect } from "react";
import Router from "next/router";
import moment from "moment";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  TextareaAutosize,
  FormControl,
  Typography,
  useTheme,
  Grid,
  Paper,
  Divider,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";

import { Upload } from "antd";
import axios from "axios";
import { connect } from "react-redux";
import { BASE_URL } from "../../../base";

const TicketDetails = ({ token, query }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ticketTitle, setTicketTitle] = useState("");
  const [supportModule, setSupportModule] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [priority, setPriority] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [comment, setComment] = useState("");
  const [commentapi, setCommentapi] = useState(null);
  const [ticketstatuses, setTicketStatuses] = useState(null);
  const [selectedTicketStatus, setSelectedTicketStatus] = useState("");

  const [thumbnail, setThumbnail] = useState("");

  const id = +query.id;

  const supportModuleOptions = [
    { label: "Purchase", value: "Purchase" },
    { label: "Sales", value: "Sales" },
    { label: "Mushak", value: "Mushak" },
    { label: "Products", value: "Products" },
    { label: "Stock", value: "Stock" },
    { label: "Bom", value: "Bom" },
  ];

  const priorityOptions = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];

  const ticketStatus = [
    { label: "Pending", value: "Pending" },
    { label: "Assigned", value: "Assigned" },
    { label: "Under Progress", value: "Under Progress" },
    { label: "Completed", value: "Completed" },
    { label: "Closed", value: "Closed" },
  ];
  const onSubmit = (e) => {
    e.preventDefault();
    const apiTicket = BASE_URL + "api/v1/comments/create";
    const ticketComment = {
      ticket_id: id,
      message: comment,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(apiTicket);
    console.log(ticketComment);

    axios.post(apiTicket, ticketComment, config).then((response) => {
      if (response.data.status) {
        setComment("");
      } else {
        setFormErrors(response.data.errors);
      }
    });
  };

  // Fetch Ticket Details
  useEffect(() => {
    const apiUrl = BASE_URL + "api/v1/tickets/" + id;
    // const apiUrl = `http://13.213.35.25/api/v1/tickets/${id}`
    axios
      .get(apiUrl, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        // console.log(res.data);
        if (res.data.status) {
          //setLoader(false);
          setTicketTitle(res.data.data.title);
          setSupportModule(res.data.data.module);
          setPriority(res.data.data.priority);
          setDescription(res.data.data.description);
          setCommentapi(res.data.data.comment);

          {
            res.data.data.file
              ? setThumbnail(BASE_URL + "storage/tickets/" + res.data.data.file)
              : setThumbnail("");
          }
        } else {
          setFormErrors(res.data.message);
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [comment]);
  // console.log(commentapi);
  const goBack = () => {
    Router.push({
      pathname: "/tickets/ticket-list",
    });
  };

  const handleTicketStatusChange = (event) => {
    setSelectedTicketStatus(event.target.value); // Update the state when a new option is selected
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTicketStatus, setFilteredTicketStatus] = useState([]);
  //testing//
  // useEffect(() => {
  //   // Fetch ticket status options from an API endpoint
  //   const apiUrl = BASE_URL + "api/v1/admin/" ;
  //   // const apiUrl = `http://13.213.35.25/api/v1/tickets/${id}`
  //   axios
  //     .get(apiUrl, {
  //       headers: { Authorization: "Bearer " + token },
  //     })
  //     .then((response) => {
  //       setFilteredTicketStatus(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching ticket status options:", error);
  //     });
  // }, []);

  // const handleSearchChange = (e) => {
  //   const query = e.target.value;
  //   setSearchQuery(query);

  //   // Filter the ticket status options based on the search query
  //   const filteredOptions = ticketStatus.filter((option) =>
  //     option.label.toLowerCase().includes(query.toLowerCase())
  //   );
  //   setFilteredTicketStatus(filteredOptions);
  // };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filteredOptions = ticketStatus.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTicketStatus(filteredOptions);

    // Update the API URL based on the search query
    const apiUrl = BASE_URL + "api/v1/admin/" + query;
    // console.log(apiUrl);
    // Fetch ticket status options using the updated apiUrl
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFilteredTicketStatus(response.data.data);
        console.log("fdfd", response.data);
      })
      .catch((error) => {
        console.error("Error fetching ticket status options:", error);
      });
  };

  return (
    <div>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
        Ticket Details
      </Typography>

      <Card variant="outlined" style={{ margin: "", padding: "8px" }}>
        <CardContent>
          <div
            style={{
              display: "flex",
              marginBottom: "8px",
              justifyContent: "space-between",
              padding: "5px",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <Typography variant="subtitle1">
                <h5>Ticket Title: {ticketTitle}</h5>
              </Typography>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <Typography variant="subtitle1">
                <h5>Support Module: {supportModule}</h5>
              </Typography>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginBottom: "8px",
              justifyContent: "space-between",
              padding: "5px",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <Typography variant="subtitle1">
                <h5>File:</h5>
              </Typography>

              {thumbnail && (
                <img
                  className="form-control mt-3"
                  src={thumbnail}
                  alt="Path not found!"
                />
              )}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <Typography variant="subtitle1">
                <h5>Priority Level: {priority}</h5>
              </Typography>
            </div>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <Typography variant="subtitle1">
              <h5>Ticket Description:</h5>
            </Typography>
            <Typography variant="body1">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </Typography>
          </div>
        </CardContent>
      </Card>

      {/* ekhane haat diba na  */}
      {/* <FormControl fullWidth margin="normal">
        <h5 style={{ marginBottom: "8px" }}>Ticket Status</h5>
        <Select
          value={selectedTicketStatus} // Use the selected value from state
          onChange={handleTicketStatusChange} // Use the provided handler
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select Ticket Status
          </MenuItem>
          {ticketStatus.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <h5 style={{ marginBottom: "8px" }}>Search</h5>
        <TextField
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search Ticket Status"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                
              </InputAdornment>
            ),
          }}
        />
      </FormControl> */}
      <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
        <FormControl fullWidth>
          <h5 style={{ marginBottom: "8px" }}>Ticket Status</h5>
          <Select
            value={selectedTicketStatus}
            onChange={handleTicketStatusChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Ticket Status
            </MenuItem>
            {ticketStatus.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <h5 style={{ marginBottom: "8px" }}>Search</h5>
          <TextField
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Ticket Status"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {/* You can add an icon here if needed */}
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          marginTop: "12px",
        }}
      >
        <Typography
          variant="h2"
          className="mb-0"
          color={colors.greenAccent[300]}
        >
          Comments
        </Typography>
        {commentapi?.map((comment, index) => (
          <Paper key={index} sx={{ p: 2, mt: 1 }}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid justifyContent="left" item xs zeroMinWidth>
                {/* <h5 style={{ margin: 0, textAlign: "left" }}>
                  {comment.commented_by.name}
                </h5>
                <div style={{ textAlign: "left" }}>{comment.message}</div>

                <div style={{ textAlign: "left", color: "gray" }}>
                  Posted{" "}
                  {moment(comment.created_at).format("MMMM D, YYYY h:mm A")}
                </div> */}
                <div style={{ textAlign: "left" }}>
                  <Typography
                    variant="h5"
                    style={{ margin: 0, textAlign: "left" }}
                  >
                    {comment.commented_by.name}
                  </Typography>
                  <p style={{ textAlign: "left", margin: 0 }}>
                    {comment.message}
                  </p>

                  <Typography
                    variant="body2"
                    style={{ textAlign: "left", color: "gray" }}
                  >
                    Posted{" "}
                    {moment(comment.created_at).format("MMMM D, YYYY h:mm A")}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </div>

      <FormControl fullWidth margin="normal">
        {/* <h5 style={{ marginBottom: "8px" }}>Ticket Description</h5> */}
        <TextareaAutosize
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a new Comment"
          minRows={2}
          style={{
            width: "100%",
            margin: "8px 0",
            minHeight: "60px",
            padding: "10px",
          }}
        />
      </FormControl>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          style={{ background: "red", color: "white" }}
          onClick={goBack}
          size="large"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          style={{ background: "green", color: "white" }}
          onClick={onSubmit}
          size="large"
        >
          Post Comment
        </Button>
      </div>
    </div>
  );
};

TicketDetails.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(TicketDetails);
