import Link from "next/link";

//redux imports
import { connect } from "react-redux";

//theme imports
import { tokens } from "./theme";
import {
  Typography,
  useTheme,
  Card,
  CardActions,
  CardContent,
  Button,
} from "@mui/material";

//icons
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import FaceIcon from "@mui/icons-material/Face";
import BusinessIcon from "@mui/icons-material/Business";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ExtensionIcon from "@mui/icons-material/Extension";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";

// Charts
import Charts from "../components/charts/Charts";

const Home = ({ roles, userName }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <div className="row">
        <div className="col-md-12 text-center">
          <Typography variant="h1" color={colors.greenAccent[300]}>
            Hello {userName}, Welcome to FairVAT!
          </Typography>
        </div>
      </div>

      {roles[0].id === 5 ? (
        <>
          <div className="row">
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <ShoppingBagIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Sales
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/orders/OrderList" className="anchor">
                    <Button size="large" variant="contained">
                      6.3
                    </Button>
                  </Link>
                  <Link href="/orders/returnList" className="anchor">
                    <Button size="large" variant="contained">
                      6.7
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <ShoppingCartIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Purchases
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/purchases/purchaseList" className="anchor">
                    <Button size="large" variant="contained">
                      List
                    </Button>
                  </Link>
                  <Link href="/purchases/returnList" className="anchor">
                    <Button size="large" variant="contained">
                      6.8
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <FaceIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Customers
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/customers/customerList" className="anchor">
                    <Button size="large" variant="contained">
                      List
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <StoreIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Vendors
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/vendors/vendorList" className="anchor">
                    <Button size="large" variant="contained">
                      List
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <>
          <Charts />
          <div className="row">
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <ShoppingBagIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Sales
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/orders/OrderList" className="anchor">
                    <Button size="large" variant="contained">
                      List
                    </Button>
                  </Link>
                  <Link href="/orders/returnList" className="anchor">
                    <Button size="large" variant="contained">
                      Returns
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <ShoppingCartIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Purchases
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/purchases/purchaseList" className="anchor">
                    <Button size="large" variant="contained">
                      List
                    </Button>
                  </Link>
                  <Link href="/purchases/returnList" className="anchor">
                    <Button size="large" variant="contained">
                      Returns
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <FaceIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Customers
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/customers/customerList" className="anchor">
                    <Button size="large" variant="contained">
                      List
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <StoreIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Vendors
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/vendors/vendorList" className="anchor">
                    <Button size="large" variant="contained">
                      List
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <ReceiptIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Mushak
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/mushak/report" className="anchor">
                    <Button size="large" variant="contained">
                      Report
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <ReceiptIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    BOM
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/bom/bomList" className="anchor">
                    <Button size="large" variant="contained">
                      List
                    </Button>
                  </Link>
                  <Link href="/bom/bomTemplate" className="anchor">
                    <Button size="large" variant="contained">
                      Upload
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <BusinessIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Companies
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/companies/companyList" className="anchor">
                    <Button size="large" variant="contained">
                      List
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <AccountTreeIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Branches
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/branch/branchList" className="anchor">
                    <Button size="large" variant="contained">
                      List
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <ExtensionIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Finished Goods
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/products/finishedGoodList" className="anchor">
                    <Button size="large" variant="contained">
                      List
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <FormatPaintIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Raw Materials
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/products/rawMaterialList" className="anchor">
                    <Button size="large" variant="contained">
                      List
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <DesignServicesIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Services
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/products/serviceList" className="anchor">
                    <Button size="large" variant="contained">
                      List
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
            <div className="col-md-3">
              <Card className="mt-5">
                <CardContent className="text-center">
                  <BeachAccessIcon
                    fontSize="large"
                    color="secondary"
                    className="mb-3"
                  />
                  <Typography variant="h3" color={colors.primary[600]}>
                    Accessories
                  </Typography>
                </CardContent>
                <CardActions className="justify-content-center">
                  <Link href="/products/accessoriesList" className="anchor">
                    <Button size="large" variant="contained">
                      List
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    roles: state.auth.roles,
    userName: state.auth.name,
  };
};

export default connect(mapStateToProps)(Home);
