import React, { useState, useEffect } from "react";
import { Typography, Button, Tooltip, Stack, Alert, Card } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Wrapper } from "./uiComponents/styled/Dashboard-styles";

// import { useLocation } from "react-router-dom";

// const location = useLocation();
// console.log(location.pathname);
// NOT YET FUNCTIONAL - move to uiComponents after

function ManageProducts() {
  const [data, setData] = useState([]);

  async function getData() {
    await axios.post("/getSuppliersProductTypes").then(({ data }) => {
      setData(data);
    });
    console.log("fetched");
  }

  useEffect(() => {
    getData();
  }, []);

  const defaultFormState = {
    supplier: "",
    type: "",
    desc: "",
    manu: "",
    code: "",
    alert: 0,
  };
  const [formState, setFormState] = React.useState(defaultFormState);
  const [disabledState, setDisabledState] = React.useState({
    supplier: false,
    type: false,
    desc: false,
    manu: false,
    code: false,
    alert: false,
    textFieldDisabled: true,
    errors: 0,
    submitState: false,
    alert: {
      severity: "error",
      message: "Faled to create new product",
      hidden: true,
    },
  });

  const handleFormChange = (e) => {
    formState[e.target.id] = e.target.value;
    setFormState({ ...formState });

    // Unlock form (or not)
    if (formState.supplier && formState.type) {
      disabledState.textFieldDisabled = false;
    } else {
      disabledState.textFieldDisabled = true;
    }
    if (e.target.value === "") {
      disabledState[e.target.id] = true;
      disabledState.errors++;
    }

    setDisabledState({ ...disabledState });
    console.log(disabledState.errors);
  };

  const handleSubmit = () => {
    validateForm();

    if (disabledState.errors === 0) {
      let supplierId = data.find(
        (item) => item.company_name === formState.supplier
      ).id;

      axios
        .post("/createNewProduct", { formState, supplierId })
        .then((response) => {
          if (response.status) {
            console.log(response.data);
            disabledState.submitState = true;
            disabledState.alert.hidden = false;
            disabledState.alert.severity = "success";
            disabledState.alert.message = response.data;
            setDisabledState({ ...disabledState });
          } else {
            console.log("Error processing request");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }

    setFormState({ ...formState });
  };

  const validateForm = () => {
    disabledState.errors = 0;

    Object.keys(formState).forEach((key) => {
      if (formState[key] === "") {
        disabledState[key] = true;
        disabledState.errors++;
      } else {
        disabledState[key] = false;
      }
      setDisabledState({ ...disabledState });
    });
  };

  return (
    <Wrapper className="contact">
      <Typography variant="h4" component="h4">
        Add New Product
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
                error={disabledState.code}
                label="Product Name"
                onChange={(e) => handleFormChange(e)}
                fullWidth
              />
              <Tooltip title="Only Approved Suppliers" placement="right">
                <Autocomplete
                  onSelect={(e) => handleFormChange(e)}
                  options={[...new Set(data.map((item) => item.company_name))]}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Approved Supplier" />
                  )}
                  id="supplier"
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
            disabled={disabledState.textFieldDisabled}
            id="code"
            error={disabledState.code}
            label="Product Code"
            variant="filled"
            onChange={(e) => handleFormChange(e)}
            fullWidth
          />
        </div>
        <div className="col-lg-4">
          <TextField
            disabled={disabledState.textFieldDisabled}
            error={disabledState.manu}
            // id="filled-error"
            label="Manufacturer"
            variant="filled"
            id="manu"
            onChange={(e) => handleFormChange(e)}
            fullWidth
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-8">
          <Typography sx={{ pb: 3, pt: 5 }} variant="h5" component="h4">
            Product Description:
          </Typography>
          <TextField
            disabled={disabledState.textFieldDisabled}
            error={disabledState.desc}
            // id="filled-error"
            label="Product Description"
            variant="filled"
            id="desc"
            onChange={(e) => handleFormChange(e)}
            fullWidth
            size="large"
            multiline={true}
            rows={3}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <TextField
            disabled={disabledState.textFieldDisabled}
            error={disabledState.desc}
            label="Price"
            variant="filled"
            id="desc"
            onChange={(e) => handleFormChange(e)}
            sx={{ pt: 2 }}
            size="large"
            multiline={true}
            fullWidth
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
              sx={{ pt: 2, min: 0 }}
              disabled={disabledState.textFieldDisabled}
              error={disabledState.alert}
              label="Stock Alert Level"
              type="number"
              variant="filled"
              id="alert"
              InputProps={{ inputProps: { min: 0 } }}
              value={formState.alert}
              onChange={(e) => handleFormChange(e)}
              fullWidth
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
              hidden={disabledState.submitState}
              color="success"
            >
              Create New Product
            </Button>
            <Alert
              hidden={disabledState.alert.hidden}
              severity={disabledState.alert.severity}
            >
              {disabledState.alert.message}
            </Alert>
          </Stack>
        </div>
      </div>
    </Wrapper>
  );
}

export default ManageProducts;
