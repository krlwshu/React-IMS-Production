import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { StyledBox } from "./styled/Order.styles";
import RouterIcon from "@mui/icons-material/Router";
import Grid from "@mui/material/Grid";

//List
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

//Modal
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

// Axios - posting order data to server
import axios from "axios";

import { Box, Stack, ButtonGroup } from "@mui/material";

// Redux part
import { useSelector, useDispatch } from "react-redux";
import { selectItems, setQty, resetCart } from "../../redux/cartSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InventoryCart(props) {
  // Dispatch Redux actions
  const dispatch = useDispatch();

  //Get Items from Redux state
  const items = useSelector(selectItems);
  console.log(items);

  // Set items in cart - tot up all quantities
  const itemCount = items.length
    ? items
        .map((item) => item.requested_quantity)
        .reduce((prev, next) => parseInt(prev) + parseInt(next))
    : 0;

  // Handle state of shopping cart side bar - move to Redux
  const { openState, setOpenState, orderState, setOrderState } = props;
  useEffect(() => {}, [orderState]);

  const [orderProcessStatus, setOrderProcessStatus] = React.useState({
    orders: [],
    showAlert: false,
  });

  // Handle order submit
  const handleSubmit = () => {
    console.log(items);
    axios
      .post("http://localhost:5000/submitOrder", items)
      .then((response) => {
        if (response) {
          orderProcessStatus.showAlert = true;
          orderProcessStatus.orders = [
            ...new Set(response.data.map((item) => item.orderId)),
          ];
          setOrderProcessStatus(orderProcessStatus);
          dispatch(resetCart());
        } else {
          console.log("Error processing request");
        }
      })
      .catch((e) => {
        console.log(e);
      });
    setOpen(false);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleEmptyCart = () => {
    dispatch(resetCart());
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle drawer toggle
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && event.key != "Escape") {
      return;
    }
    setOpenState(false);
  };

  const handleChangeQty = (e, id) => {
    dispatch(setQty({ id: id, requested_quantity: parseInt(e.target.value) }));
  };

  const list = (anchor) => (
    <StyledBox role="presentation" onKeyDown={toggleDrawer(anchor, false)}>
      <Box sx={{ m: 3 }}>
        <Typography variant="h4" component="h3">
          Order New Items ({itemCount})
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {items.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem key={item.prod_id} sx={{ pl: 4, pb: 2 }} button>
                <ListItemAvatar>
                  <Avatar>
                    <RouterIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.description}
                  secondary={`Man: ${item.manufacturer} - Supplier: ${item.supplier}`}
                />
                <TextField
                  edge="end"
                  id="standard-number"
                  inputProps={{
                    min: 0,
                    style: { textAlign: "center", fontSize: "1.4rem" },
                  }}
                  type="number"
                  onChange={(e) => handleChangeQty(e, item.prod_id)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="standard"
                  defaultValue={item.requested_quantity}
                />
              </ListItem>

              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Grid>

      <Box sx={{ m: 3 }}>
        <Typography variant="h3" component="h2">
          <Alert hidden={true} severity="info">
            Orders
          </Alert>
          <Stack
            hidden={orderProcessStatus.showAlert}
            spacing={2}
            pt={2}
            direction="row"
          >
            <ButtonGroup
              hidden={itemCount === 0 ? true : false}
              variant="text"
              color="primary"
              aria-label=""
            >
              <Button
                sx={{ mr: 1 }}
                variant="contained"
                onClick={handleClickOpen}
              >
                Submit
              </Button>
              <Button
                sx={{ ml: 1 }}
                onClick={handleEmptyCart}
                variant="outlined"
              >
                Remove All Items
              </Button>
            </ButtonGroup>
          </Stack>
          <Alert hidden={!orderProcessStatus.showAlert} severity="success">
            Order processed! Order IDs:
            {orderProcessStatus.orders.join(", ")}
          </Alert>
        </Typography>
      </Box>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm Order Submission?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description"></DialogContentText>
          <Alert severity="info">
            The supplier will be notified by email. You can view updates in
            manage orders section.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button color="success" variant="outlined" onClick={handleSubmit}>
            OK
          </Button>
          <Button color="error" variant="contained" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </StyledBox>
  );

  let anchor = "right";
  return (
    <div>
      <React.Fragment key={anchor}>
        <Drawer
          anchor={anchor}
          open={openState}
          onClose={toggleDrawer(anchor, false)}
        >
          {list(anchor)}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
