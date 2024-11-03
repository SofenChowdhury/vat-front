import { tokens } from "../../theme";

import React, { useState, useEffect } from "react";
import Router from "next/router";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  TextareaAutosize,
  FormControl,
  Typography,
  useTheme,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { Upload } from "antd";
import axios from "axios";
import { connect } from "react-redux";
import { BASE_URL } from "../../../base";

const UpdateTicket = ({ token, query }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ticketTitle, setTicketTitle] = useState("");
  const [supportModule, setSupportModule] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [priority, setPriority] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
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

  // const handleCreateTicket = async () => {
  //   const apiUrl = BASE_URL + "api/v1/tickets/update/";
  //   const formData = new FormData();
  
  //   formData.append("title", ticketTitle);
  //   formData.append("description", description);
  //   formData.append("priority", priority);
  //   formData.append("module", supportModule);
  //   formData.append("status", 1);

  //   try {
  //     await axios.post(apiUrl, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setSuccessMessage("Ticket Updated successfully!");
  //     setErrorMessage("");
  //     setSubmittedSuccessfully(true);
  //   } catch (error) {
  //     setErrorMessage("An error occurred while creating the ticket.");
  //     setSuccessMessage("");
  //   }
  // };

  const onSubmit = (e) => {
    e.preventDefault();
    const apiTicket = BASE_URL + "api/v1/tickets/update";
    const ticketData = {
      title: ticketTitle,
      description: description,
      priority: priority,
      module: supportModule,
      status: "pending",
      id,
    };
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.post(apiTicket, ticketData, config).then((response) => {
      if (response.data.status) {
        alert("Ticket Updated");
        Router.push({
          pathname: "/tickets/ticket-list",
        });
      } else {
        console.log(response.data);
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
        console.log(res.data);
        if (res.data.status) {
          //setLoader(false);
          setTicketTitle(res.data.data.title);
          setSupportModule(res.data.data.module);
          setPriority(res.data.data.priority);
          setDescription(res.data.data.description);
          // setContactEmail(res.data.data.contact_email);
          // setContactAddress(res.data.data.contact_address);
          // setContactNumber(res.data.data.contact_number);
          // setContactPerson(res.data.data.contact_person);
          // setCompanyTin(res.data.data.company_tin);
          // setCompanyBin(res.data.data.company_bin);
        } else {
          setFormErrors(res.data.message);
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const goBack = () => {
    Router.push({
      pathname: "/tickets/ticket-list",
    });
  };

  return (
    <div>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <Typography variant="h2" className="mb-4" color={colors.greenAccent[300]}>
       Update Ticket
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            Update Company
          </Typography> */}
        <div style={{ flex: 1 }}>
          <FormControl fullWidth margin="normal">
            <h5 style={{ marginBottom: "8px" }}>Ticket Title</h5>
            <TextField
              value={ticketTitle || ""}
              onChange={(e) => setTicketTitle(e.target.value)}
              fullWidth
            />
          </FormControl>
        </div>
        <div style={{ flex: 1 }}>
          <FormControl fullWidth margin="normal">
            <h5 style={{ marginBottom: "8px" }}>Support Module</h5>
            <Select
              value={supportModule}
              onChange={(e) => setSupportModule(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select a support module
              </MenuItem>
              {supportModuleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ flex: 1 }}>
          <FormControl fullWidth margin="normal">
            <h5 style={{ marginBottom: "2px" }}>File Upload</h5>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "8px 0",
                border: "2px dashed #ccc",
                borderRadius: "4px",
                padding: "8px",
                // Set a minimum height to ensure centering works
              }}
            >
              <Upload
                customRequest={() => {}}
                fileList={file ? [file] : []}
                onChange={(info) => setFile(info.file)}
              >
                <Button>Drag and drop images here</Button>
              </Upload>
            </div>
          </FormControl>
        </div>
        <div style={{ flex: 1 }}>
          <FormControl fullWidth margin="normal">
            <h5 style={{ marginBottom: "8px" }}>Priority Level</h5>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ alignSelf: "stretch", marginBottom: "8px" }}
              displayEmpty // Adding this attribute to show the default option
            >
              <MenuItem value="" disabled>
                Select the priority level
              </MenuItem>
              {priorityOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  style={{
                    color:
                      option.value === "High"
                        ? "red"
                        : option.value === "Medium"
                        ? "blue"
                        : "green",
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <FormControl fullWidth margin="normal">
        <h5 style={{ marginBottom: "8px" }}>Ticket Description</h5>
        <TextareaAutosize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rowsMin={4}
          style={{ width: "100%", margin: "8px 0", minHeight: "120px" }}
        />
      </FormControl>
      

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
          Update Ticket
        </Button>
      </div>
    </div>
  );
};

UpdateTicket.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(UpdateTicket);
