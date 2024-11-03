import React, { useState } from "react";

// select forms
import { Multiselect } from "multiselect-react-dropdown";
import Form from "react-bootstrap/Form";

// Icons Import
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PersonIcon from "@mui/icons-material/Person";

const CreatePermission = () => {
    

  const [aLLroles, setALLRoles] = useState([]);
  const [formErrors, setFormErrors] = useState("");


  const [selectedRoles, setSelectedRoles] = useState([]);


  const rolesAdd = (list, item) => {
    setSelectedRoles((selectedRoles) => [...selectedRoles, item]);
  };

  const rolesRemove = (list, item) => {
    setSelectedRoles(selectedRoles.filter((i) => i.name !== item.name));
  };
  return (
    <div>
      hi
    </div>
  );
};

export default CreatePermission;
