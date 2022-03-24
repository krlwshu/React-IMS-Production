import React, { useState, useEffect } from "react";
import { Typography, Button, Tooltip, Stack, Alert, Card } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Wrapper } from "./uiComponents/styled/Dashboard-styles";
import { useParams } from "react-router-dom";
import useToken from "./auth/useToken";

function AddProduct() {
  // get token
  const { token } = useToken();

  //Get product ID
  // const { slug } = useParams();

  // Load existing product data

  const defaultProductInfo = {
    product_name: "",
    company_name: "",
    category: "",
    supplier_id: "",
    product_code: "",
    manufacturer: "",
    description: "",
    unit_price: "",
    alert_level: "",
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
    message: "Product created :)",
    isHidden: false,
    severity: "success",
  };
  const alertError = {
    message: "Error updating product!!!",
    isHidden: false,
    severity: "Error",
  };

  console.log(alertState);
  const [data, setData] = useState([]);
  const [locked, setLocked] = useState(false);

  async function getData() {
    await axios
      .post("http://localhost:5000/getSuppliersProductTypes")
      .then(({ data }) => {
        console.log(data);
        setData(data);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  const handleFormChange = (e) => {
    const productinfo = {
      ...productInfo,
      [e.target.id]: e.target.value,
    };

    console.log(e);

    setProductInfo(productinfo);
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/createNewProduct", { productInfo })
      .then((response) => {
        if (response.status) {
          setLocked(true);
          setAlertState(alertSuccess);
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
                id="product_name"
                label="Product Name"
                onChange={handleFormChange}
                fullWidth
                value={productInfo.product_name}
              />

              <Tooltip
                placement="right"
                title={
                  <h5 style={{ color: "white" }}>
                    Select pre-approved supplier
                  </h5>
                }
              >
                <Autocomplete
                  onSelect={(e) => handleFormChange(e)}
                  options={[...new Set(data.map((item) => item.company_name))]}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Approved Supplier" />
                  )}
                  id="company_name"
                  value={productInfo.company_name}
                />
              </Tooltip>
              <Tooltip
                title="Select from list or enter free text"
                placement="right"
              >
                <Autocomplete
                  id="category"
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
            id="product_code"
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
            id="manufacturer"
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
            id="description"
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
            id="unit_price"
            onChange={(e) => handleFormChange(e)}
            sx={{ pt: 2 }}
            size="large"
            inputProps={{ min: 0 }}
            multiline={true}
            fullWidth
            value={productInfo.unit_price}
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
              id="alert_level"
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
              variant="outlined"
              onClick={handleSubmit}
              color="success"
              hidden={locked}
            >
              Create Product
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

export default AddProduct;
