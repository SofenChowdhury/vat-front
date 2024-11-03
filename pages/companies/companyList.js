import React, { useEffect, useState } from "react";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../theme";
import { Typography, useTheme, Button, CircularProgress } from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Icon import
import EditIcon from "@mui/icons-material/Edit";

const companyList = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [companies, setCompanies] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const apiCompanies = BASE_URL + "api/v1/companies";

    axios
      .get(apiCompanies, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.data.status == true) {
          setLoader(false);
          setCompanies(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="row">
            <div className="col-10">
              <Typography
                variant="h2"
                className="mb-4"
                color={colors.greenAccent[300]}
              >
                Companies
              </Typography>
            </div>
            <div className="col-2 mt-1">
              <Link href="/companies/createCompany" className="anchor">
                <Button variant="outlined" size="large">Create Company</Button>
              </Link>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr className="table-success">
                  <th scope="col">#</th>
                  <th scope="col">Company ID</th>
                  <th scope="col">Company Name</th>
                  <th scope="col">Company BIN</th>
                  <th scope="col">Contact Person</th>
                  <th scope="col">Contact Email</th>
                  <th scope="col">Contact Phone</th>
                  <th scope="col">Contact Address</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td className="text-center">{company.id}</td>
                    <td>{company.name}</td>
                    <td>{company.company_bin}</td>
                    <td>{company.contact_person}</td>
                    <td>{company.contact_email}</td>
                    <td>{company.contact_number}</td>
                    <td>{company.contact_address}</td>
                    <td>
                      <Link href={`/companies/updateCompany/${company.id}`}>
                        <button className="btn btn-light btn-sm me-1">
                          <EditIcon cursor="pointer" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default connect(mapStateToProps)(companyList);
