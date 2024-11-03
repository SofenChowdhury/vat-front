import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

//redux imports
import { connect } from "react-redux";

// Theme imports
import { tokens } from "../theme";
import {
  Typography,
  useTheme,
  CircularProgress,
  Button,
  Pagination,
  TextField,
} from "@mui/material";

//axios
import axios from "axios";
import { BASE_URL } from "../../base";

// icons
import { Edit } from "@mui/icons-material";
import moment from "moment";

const bomList = ({ token, roles }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [keyword, setKeyword] = useState([]);

  const [boms, setBoms] = useState([]);
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
      const apiBom =
        BASE_URL + "api/v1/boms?page=" + currentPage + "&keyword=" + keyword;

      axios
        .get(apiBom, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          if (res.data.status == true) {
            setLoader(false);
            setBoms(res.data.data.data);
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
  }, [router.query.page, keyword]);

  // Pagination
  const handleChange = (e, page) => {
    setPage(page);

    router.push({ pathname: router.pathname, query: { page } });
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <Typography
            variant="h2"
            className="mb-4"
            color={colors.greenAccent[300]}
          >
            BOM List
          </Typography>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <TextField
            label="Sku/Name"
            variant="outlined"
            size="large"
            type="text"
            fullWidth
            onChange={(e) => setKeyword(e.target.value)}
            className="shadow-input"
          />
        </div>
      </div>
      {loader ? (
        <CircularProgress />
      ) : (
        <>
          {boms.length > 0 ? (
            <>
              <div className="row">
                <div className="col-md-12">
                  <h6 className="text-secondary">Search</h6>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr className="table-success">
                      <th>Bom NO.</th>
                      <th>Finished Good</th>
                      <th>SKU</th>
                      <th>Declared Price</th>
                      <th>Status</th>
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boms?.map((bom, index) => (
                      <tr key={index}>
                        <td className="align-middle">
                          <Link
                            href={`/bom/bomDetails/${bom.id}`}
                            className="anchor3"
                          >
                            {bom?.bom_number}
                          </Link>
                        </td>
                        <td className="align-middle">
                          {bom?.finish_goods?.title}
                        </td>
                        <td className="align-middle">
                          {bom?.finish_goods?.sku}
                        </td>
                        <td className="align-middle">
                          {Intl.NumberFormat().format(bom.price)}
                        </td>

                        {bom.status ? (
                          <td className="align-middle">Active</td>
                        ) : (
                          <td>Inactive</td>
                        )}

                        <td>{moment(bom.created_at).format("DD MMM, YYYY")}</td>

                        <td>
                          <Link
                            href={`/bom/bomVat/${bom.id}`}
                            className="anchor3"
                          >
                            <Button variant="contained" color="secondary" size="large">
                              4.3
                            </Button>
                          </Link>
                          {roles[0].id != 5 && (
                            <>
                              <Link
                                href={`/bom/bomAppendix/${bom.id}`}
                                className="anchor3 ms-1"
                              >
                                <Button variant="contained" color="secondary" size="large">
                                  পরিশিষ্ট ক (4.3)
                                </Button>
                              </Link>
                              <Link
                                href={`/bom/bomUpdate/${bom.id}`}
                                className="anchor3 ms-1"
                              >
                                <Button variant="contained" color="secondary" size="large">
                                  <Edit />
                                </Button>
                              </Link>
                            </>
                          )}
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
                          Showing {1 + (page - 1) * 20} - {20 + (page - 1) * 20}{" "}
                          out of {totalData}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="row">
                <div className="col-md-12">
                  <Typography
                    variant="h3"
                    className="mb-4"
                    color={colors.greenAccent[300]}
                  >
                    The list is empty!
                  </Typography>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

// export default bomList
const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    roles: state.auth.roles,
  };
};

export default connect(mapStateToProps)(bomList);
