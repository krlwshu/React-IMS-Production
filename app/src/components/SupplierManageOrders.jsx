import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { Typography, Button, Stack, TextField } from "@mui/material";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

//Modal
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

// Styles
import { StyledContainer } from "./uiComponents/styled/Order.styles";
import { Wrapper } from "./uiComponents/styled/Dashboard-styles";

// Headers / token
import useToken from "../components/auth/useToken";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DataTable() {
  const { token } = useToken();

  const [submitDialogOpen, setSubmitDialogOpen] = React.useState(false);

  const handleCloseDialog = () => {
    setSubmitDialogOpen(false);
  };

  // Load Data

  const [expanded, setExpanded] = React.useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [orderData, setOrderData] = useState([]);

  // TEMP
  const [searchParams, setSearchParams] = useSearchParams();
  // console.log(searchParams.get("s"));
  if (searchParams.get("s")) {
    localStorage.setItem("supplier_id", searchParams.get("s"));
  }

  async function getData() {
    const headers = { headers: { "x-access-token": JSON.parse(token) } };
    await axios
      .get("http://localhost:5000/getOrderItems", headers)
      .then(({ data }) => {
        setOrderData(data);
        setLoadingData(false);
        setReloadState(false);
      });
    console.log("fetched");
  }

  useEffect(() => {
    getData();
  }, []);

  const handleAvaChange = (e, row) => {
    setOrderData((prev) => {
      const itemId = prev.find((item) => item.id === row.row.id);

      if (itemId) {
        return prev.map((item) =>
          item.id === row.row.id ? { ...item, available: e.target.value } : item
        );
      }
    });
  };

  const columns = [
    { field: "parent_order", headerName: "Main Order Ref.", width: "200" },
    { field: "id", headerName: "Item Order Number", width: "200" },
    { field: "product_name", headerName: "Product Name", width: 130 },
    { field: "product_code", headerName: "Product Code", width: 130 },
    { field: "manufacturer", headerName: "Manufacturer", width: 130 },
    { field: "description", headerName: "Description", width: 400 },
    { field: "requested_quantity", headerName: "Qty. Requested", width: 130 },
    {
      field: "supp_avail_qty",
      headerName: "Available",
      width: 130,
      renderCell: (row) => {
        return (
          <TextField
            id={`${row.id}-btn`}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputProps: { min: 0, max: row.row.requested_quantity },
              defaultValue: row.row.supp_avail_qty,
            }}
            value={
              orderData.findIndex((item) => item.id == row.id).supp_avail_qty
            }
            onChange={(e) => {
              handleAvaChange(e, row);
            }}
            variant="standard"
          />
        );
      },
    },
    {
      field: "supplier_approval_status",
      headerName: "Status",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
    },
    {
      field: "date_created",
      headerName: "Date Created",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      width: 160,
    },
    {
      field: "action",
      headerName: "Order Response",
      description: "",
      sortable: false,
      filterable: false,
      width: 300,
      renderCell: (row) => {
        return (
          <Stack direction="row">
            <Button
              variant="outlined"
              aria-label="delete"
              color="success"
              onClick={() => handleOrderItemApproval(row.id)}
              sx={{ mr: 2 }}
            >
              <DoneIcon color="success" />
            </Button>
            <Button
              aria-label="delete"
              color="error"
              variant="outlined"
              onClick={() => handleOrderItemReject(row.id)}
            >
              <CloseIcon color="error" />
            </Button>
          </Stack>
        );
      },
    },
  ];

  // Order approval handler - protects the order integrity. If in full, DB updated, no questions asked, new quantities updated.
  // Else if partial, user confirmation required. Requires requestor approval before q update.
  const handleOrderItemApproval = (id) => {
    // Check if in full or partial - if partial, dialog
    const item = orderData.find((item) => item.id === id);
    console.log(orderData);
    let respData = {
      item_order_id: id,
      app_status:
        item.available == item.requested_quantity ? "Approved" : "Partial",
      app_qty: parseInt(item.available),
    };

    if (item.available == item.requested_quantity) {
      submitOrderResponse(respData);
    } else {
      // Queue item into state pending confirmation, display dialog
      setAwaitConfirm(respData);
      setSubmitDialogOpen(true);
    }
  };

  const [awaitConfirm, setAwaitConfirm] = React.useState({});
  const handleConfirm = () => {
    submitOrderResponse(awaitConfirm);
    setSubmitDialogOpen(false);
  };

  // Process change - (reload table)
  const [reloadState, setReloadState] = React.useState(false);

  //Handle order rejection (instant rejection, no dialog)
  const handleOrderItemReject = (id) => {
    let respData = {
      item_order_id: id,
      app_status: "Rejected",
      app_qty: 0,
    };
    submitOrderResponse(respData);
  };

  // Send order to server (generic function)
  const submitOrderResponse = (data) => {
    axios
      .post("http://localhost:5000/processOrderItem", data)
      .then((response) => {
        if (response.status) {
          setReloadState(true);
          // console.log(response.data);
        } else {
          console.log("Error processing request");
        }
      })
      .catch((e) => {
        console.log(e);
      });
    getData();
  };

  return (
    <Wrapper>
      <div className="row">
        <div className="col-lg-12">
          <Typography
            variant="h3"
            component="h3"
            sx={{ pb: 5, fontWeight: 400 }}
          >
            Orders
          </Typography>
          <Typography
            variant="h6"
            component="h6"
            sx={{ pb: 5, fontWeight: 400 }}
          >
            You have ({(orderData.length && orderData.length) || 0}) orders in
            your queue
          </Typography>
        </div>
        <div className="col-lg-12">
          <div style={{ height: 560, minWidth: "100%" }}>
            <DataGrid
              rows={orderData}
              columns={columns}
              sx={{ width: "100%" }}
              pageSize={20}
              rowsPerPageOptions={[5]}
              // checkboxSelection
            />
          </div>
        </div>
      </div>
      <Dialog
        open={submitDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {" "}
          <WarningAmberIcon color="warning" /> Partial Order Submission
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You are submitting a partial order which requires{" "}
            <b>requestor approval</b>. You will be notified by email when the
            requestor submits a response.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="success" onClick={handleConfirm}>
            Submit
          </Button>
          <Button variant="contained" color="error" onClick={handleCloseDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Wrapper>
  );
}
