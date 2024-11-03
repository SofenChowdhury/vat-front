import { BASE_URL } from "../../base";

import React, { useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  TextareaAutosize,
  FormControl,
} from "@mui/material";
import { Upload } from "antd";
import axios from "axios";
import { connect } from "react-redux";
import Router from "next/router";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

/////Testing///////////
let Editor; // Define Editor outside the component scope
if (typeof window !== "undefined") {
  // Check if we're in a browser environment
  Editor = require("react-draft-wysiwyg").Editor; // Import Editor only if in browser
  require("react-draft-wysiwyg/dist/react-draft-wysiwyg.css");
  // ... other imports related to react-draft-wysiwyg
}

// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { EditorState, ContentState, convertToRaw } from "draft-js";

const CreateTicket = ({ token }) => {
  const [ticketTitle, setTicketTitle] = useState("");
  const [supportModule, setSupportModule] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [priority, setPriority] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  ///testing start v1
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  // testing end v1

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };


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

  const handleCreateTicket = async () => {
    const apiTickets = BASE_URL + "api/v1/tickets/create";
    const formData = new FormData();

    formData.append("title", ticketTitle);
    // formData.append("description", description);
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
    formData.append("description", htmlContent);

    formData.append("priority", priority);
    formData.append("module", supportModule);
    formData.append("status", 1);
    formData.append("file", file);

    try {
      await axios.post(apiTickets, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      // setSuccessMessage("Ticket created successfully!");
      setSuccessOpen(true);

      // setErrorMessage("");
      // setSubmittedSuccessfully(true);
      Router.push({
        pathname: "/tickets/ticket-list",
      });
    } catch (error) {
      // setErrorMessage("An error occurred while creating the ticket.");
      console.log(error);
      setErrorOpen(true);
      // setSuccessMessage("");
    }
  };

  const goBack = () => {
    Router.push({
      pathname: "/",
    });
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  // PHOTO
  const onChange = async (e) => {
    let files = e.target.files || e.dataTransfer.files;
    // console.log(files);
    if (files.length > 0) {
      uploadDocuments(e, files[0]);
    }
  };
  const uploadDocuments = async (event, file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const response = submitFile(reader.result, file.name);
          resolve(response);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };
  const submitFile = (result, name) => {
    // console.log(result, name);
    setFile(result);
  };


  return (
    <div>
      {/* {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>} */}
      <Snackbar
        open={successOpen}
        autoHideDuration={1500}
        onClose={handleSuccessClose}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSuccessClose}
          severity="success"
        >
          Ticket Successfully Created
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={errorOpen}
        autoHideDuration={1500}
        onClose={handleErrorClose}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleErrorClose}
          severity="error"
        >
          Error while creating ticket
        </MuiAlert>
      </Snackbar>

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
            <h5 style={{ marginBottom: "8px" }}>Ticket Title</h5>
            <TextField
              value={ticketTitle}
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
              <Button
                variant="contained"
                component="label"
                color="secondary"
                // sx={{ width: '100%' }} //set button size in percentage
                sx={{ width: '60%' }}
                size="large"
              >
                Add Image
                <input
                  hidden
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={onChange}
                />
              </Button>
            </div>
          </FormControl>
          {file ? (
                <img className="form-control mt-3" src={file} />
              ) : (
                // <input
                //   type="text"
                //   className="form-control input mt-3"
                //   placeholder="Please upload a Image."
                //   disabled
                // />
                <></>
              )}
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

      {/* <FormControl fullWidth margin="normal">
        <h5 style={{ marginBottom: "8px"}}>Ticket Description</h5>
        <TextareaAutosize
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rowsMin={4}
          style={{ width: "100%", margin: "8px 0", minHeight: "120px" ,padding:"10px"}}
        />
      </FormControl> */}
      <FormControl fullWidth margin="normal">
        <h5 style={{ marginBottom: "8px" }}>Ticket Description</h5>
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          placeholder="Description"
          wrapperStyle={{ height: "240px" }} // Adjust the height as needed
          editorStyle={{ height: "200px" }} // Adjust the height as needed
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
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          style={{ background: "green", color: "white" }}
          onClick={handleCreateTicket}
          size="large"
        >
          Create Ticket
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(CreateTicket);
