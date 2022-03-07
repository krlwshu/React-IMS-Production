import React, { useState, useEffect } from "react";
import { Typography, Button, Tooltip, Stack, Alert, Card } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Wrapper } from "./uiComponents/styled/Dashboard-styles";
import { useLocation, useParams } from "react-router-dom";
import useToken from "./auth/useToken";

function ManageProducts() {
  // get token
  const { token } = useToken();

  //Get product ID
  const location = useLocation();
  const { slug } = useParams();

  // Load existing product data

  const defaultProductInfo = {
    product_name: "",
    company_name: "",
    category: "",
    product_code: "",
    manufacturer: "",
    description: "",
    unit_price: "",
    alert_level: "",
    id: "",
  };

  const [loadingData, setLoadingData] = useState(true);
  const [productInfo, setProductInfo] = useState(defaultProductInfo);

  // alert state
  const [alertState, setAlertState] = useState({
    isHidden: true,
    severity: "error",
    message: "Nothing to see here!",
  });

  const alertSuccess = {
    message: "Product Updated :)",
    isHidden: false,
    severity: "success",
  };
  const alertError = {
    message: "Error updating product!!!",
    isHidden: false,
    severity: "Error",
  };

  useEffect(() => {
    async function getData() {
      await axios
        .post(
          "/getProductDetails",
          { id: slug },
          { headers: { "x-access-token": JSON.parse(token) } }
        )
        .then(({ data }) => {
          setProductInfo(data);
          setLoadingData(false);
        });
    }
    if (loadingData) {
      getData();
    }
  }, [productInfo]);

  const [data, setData] = useState([]);

  async function getData() {
    await axios.post("/getSuppliersProductTypes").then(({ data }) => {
      setData(data);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  const handleFormChange = (e) => {};

  const handleSubmit = () => {
    axios
      .post("/createNewProduct", { productInfo })
      .then((response) => {
        if (response.status) {
        } else {
          console.log("Error processing request");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Wrapper className="contact">
      ``
      <Typography variant="h4" component="h4">
        Manage Product Item:{" "}
        <b>
          <i>{productInfo.product_name}</i>
        </b>
      </Typography>
      <div className="row align-items-center my-5">
        <div className="col-lg-2">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              border: "solid 1px lightgrey",
              borderRadius: 2,
              pt: 3,
              height: 200,
              width: 200,
              p: 3,
              flexDirection: "column",
            }}
            noValidate
            autoComplete="off"
          >
            <AddCircleOutlineIcon sx={{ fontSize: "5rem", opacity: 0.5 }} />
            <p>Add Image</p>
          </Box>
        </div>
        <div className="col-lg-6">
          <p></p>

          <Box
            sx={{ pt: 3, "& .MuiTextField-root": { m: 1, width: "100%" } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="pname"
                label="Product Name"
                onChange={(e) => handleFormChange(e)}
                fullWidth
                value={productInfo.product_name}
              />

              <Tooltip
                color="error"
                placement="right"
                title={
                  <h5 style={{ color: "white" }}>
                    This field cannot be changed!
                  </h5>
                }
              >
                <TextField
                  id="supplier"
                  label="Supplier Company"
                  fullWidth
                  value={productInfo.company_name}
                  disabled
                />
              </Tooltip>
              <Tooltip
                title="Select from list or enter free text"
                placement="right"
              >
                <Autocomplete
                  id="type"
                  onSelect={(e) => handleFormChange(e)}
                  options={[...new Set(data.map((item) => item.category))]}
                  renderInput={(params) => (
                    <TextField {...params} label="Product Type" />
                  )}
                  placeholder="Search within list, or enter new category"
                  value={productInfo.category}
                />
              </Tooltip>
            </div>
          </Box>
        </div>
      </div>
      <Typography variant="h5" component="h4">
        Product Details:
      </Typography>
      <div style={{ paddingTop: "2rem" }} className="row">
        <div className="col-lg-4">
          <TextField
            id="code"
            label="Product Code"
            variant="filled"
            onChange={(e) => handleFormChange(e)}
            fullWidth
            value={productInfo.product_code}
          />
        </div>
        <div className="col-lg-4">
          <TextField
            // id="filled-error"
            label="Manufacturer"
            variant="filled"
            id="manu"
            onChange={(e) => handleFormChange(e)}
            fullWidth
            value={productInfo.manufacturer}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-8">
          <Typography sx={{ pb: 3, pt: 5 }} variant="h5" component="h4">
            Product Description:
          </Typography>
          <TextField
            // id="filled-error"
            label="Product Description"
            variant="filled"
            id="desc"
            onChange={(e) => handleFormChange(e)}
            fullWidth
            size="large"
            multiline={true}
            rows={3}
            value={productInfo.description}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <TextField
            label="Price"
            variant="filled"
            type="number"
            id="price"
            onChange={(e) => handleFormChange(e)}
            sx={{ pt: 2 }}
            size="large"
            inputProps={{ min: 0 }}
            multiline={true}
            fullWidth
            value={productInfo.unit_price || 0}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <Tooltip
            title="Get notified when levels are running low"
            placement="right"
          >
            <TextField
              sx={{ pt: 2 }}
              // error={disabledState.alert}
              label="Stock Alert Level"
              type="number"
              variant="filled"
              id="alert"
              inputProps={{
                min: 0,
              }}
              onChange={(e) => handleFormChange(e)}
              fullWidth
              value={productInfo.alert_level}
            />
          </Tooltip>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <Stack sx={{ width: "100%", pt: 10 }}>
            <Button
              sx={{ width: 250 }}
              variant="contained"
              onClick={handleSubmit}
              color="success"
            >
              Update Product
            </Button>
            <Alert hidden={alertState.isHidden} severity={alertState.severity}>
              {alertState.message}
            </Alert>
          </Stack>
        </div>
      </div>
    </Wrapper>
  );
}

export default ManageProducts;
