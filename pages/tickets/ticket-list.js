import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Router from "next/router";



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
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// Icon import
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const companyList = ({ token }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tickets, setTickets] = useState([]);
  const [loader, setLoader] = useState(true);

  const router = useRouter();

  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    // Get the current page from the query params
    const currentPage = Number(router.query.page) || 1;

    // Update the page state only if it's different from the current page
    if (currentPage !== page) {
      setPage(currentPage);
    }

    const fetchData = () => {
      setLoader(true);
      //  const apiTickets = "http://10.100.18.116/vat-backend/public/api/v1/tickets/";
      const apiTickets = BASE_URL + "api/v1/tickets/";

      axios
        .get(apiTickets, {
          headers: { Authorization: "Bearer " + token },
        })

        .then((res) => {
          console.log(res.data);
          if (res.data.status == true) {
            setLoader(false);
            setTickets(res.data.data.data);
            const lastPage = res.data.data.last_page;
            const totalData = res.data.data.total;

            // Reset the page to 1 if there's only one page of data
            if (lastPage === 1 && currentPage !== 1) {
              router.push({ pathname: router.pathname, query: { page: 1 } });
              return;
            }

            // Update the lastPage and totalData states
            setLastPage(lastPage);
            setTotalData(totalData);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchData();
  }, [router.query.page]);

  // DELETING Ticket without reloading the full page
  const onDelete = (e, id, name) => {
    const ticketData = { id };
    const apiTicket = BASE_URL + "api/v1/tickets/delete";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios.post(apiTicket, ticketData, config).then((response) => {
      console.log(response.data);
      if (response.data.status) {
        // alert(`Deleted Ticket ${name}`);
        // Remove the deleted ticket from the local state
        setTickets(tickets.filter((ticket) => ticket.id !== id));
        alert(`Deleted Ticket ${name}`);
      } else {
        console.log(response.data);
      }
    });
  };

  // Pagination
  const handleChange = (e, page) => {
    setPage(page);

    router.push({ pathname: router.pathname, query: { page } });
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          <div className="row">
            <div className="col-md-6">
              <Typography
                variant="h2"
                className="mb-4"
                color={colors.greenAccent[300]}
              >
                Ticket List
              </Typography>
            </div>
            <div className="col-md-6">
              <Link href="/tickets/create-ticket" className="anchor">
                <Button variant="outlined" className="float-end" size="large">
                  Create Ticket
                </Button>
              </Link>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr className="table-success">
                  <th scope="col">#</th>
                  <th scope="col">Ticket Title</th>
                  <th scope="col">Support Module</th>
                  <th scope="col">Priority Level</th>
                  {/* <th scope="col">Ticket Description</th> */}
                  {/* <th scope="col">Contact Email</th>
                  <th scope="col">Contact Phone</th>
                  <th scope="col">Contact Address</th> */}
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr key={index}>
                    {/* <th scope="row">{index + 1}</th> */}
                    <th>{index + 1 + (page - 1) * 20}</th>
                    <td>
                      <Link
                        href={`/tickets/ticket-details/${ticket.id}`}
                        className="anchor3"
                      >
                        {ticket.title}
                      </Link>
                    </td>
                    {/* <td className="">{ticket.title}</td> */}
                    <td>{ticket.module}</td>
                    <td>{ticket.priority}</td>
                    {/* <td>{ticket.description}</td> */}
                  {/* working html-formatted text */}
                    {/* <td> <div dangerouslySetInnerHTML={{ __html: ticket.description }} /></td> */}
                    {/* <td>{company.company_bin}</td>
                    <td>{company.contact_person}</td>
                    <td>{company.contact_email}</td>
                    <td>{company.contact_number}</td>
                    <td>{company.contact_address}</td> */}
                    <td>
                      <Link href={`/tickets/update-ticket/${ticket.id}`}>
                        <button className="btn btn-light btn-sm me-1">
                          <EditIcon cursor="pointer" />
                        </button>
                      </Link>

                      <button
                        className="btn btn-light btn-sm text-danger"
                        onClick={(e) => onDelete(e, ticket.id, ticket.title)}
                      >
                        <DeleteIcon cursor="pointer" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-12 d-flex justify-content-center">
              <Pagination
                count={lastPage}
                page={page}
                color="secondary"
                size="large"
                onChange={handleChange}
              />
              {page === lastPage ? (
                <>
                  {totalData === 0 ? (
                    <span className="ms-3 mt-2">Showing 0 out of 0</span>
                  ) : (
                    <span className="ms-3 mt-2">
                      Showing {1 + (page - 1) * 20} - {totalData} out of{" "}
                      {totalData}
                    </span>
                  )}
                </>
              ) : (
                <>
                  {totalData === 0 ? (
                    <span className="ms-3 mt-2">Showing 0 out of 0</span>
                  ) : (
                    <span className="ms-3 mt-2">
                      Showing {1 + (page - 1) * 20} - {20 + (page - 1) * 20} out
                      of {totalData}
                    </span>
                  )}
                </>
              )}
            </div>
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
