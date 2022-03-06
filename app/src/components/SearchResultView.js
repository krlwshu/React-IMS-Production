import React, { useState } from "react";
import Chip from '@material-ui/core/Chip';
import Button from '@mui/material/Button'
import Box from '@mui/material/Box';

// Buttons
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { StyledDeleteIcon } from "./uiComponents/styled/InventorySearch-styles";

// Lists MUI
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';


// Typography
import Typography from '@mui/material/Typography';

// Redux 
import { useSelector, useDispatch } from "react-redux";
import { addItem, delItem } from "../redux/cartSlice";
import { selectItems } from "../redux/cartSlice";
import ButtonGroup from '@mui/material/ButtonGroup'





const styles = {
  root: {
    paddingTop: "25px",
    color: "#FFFFFF"
  },
  chipInactive: {
    backgroundColor: "#ff0b0ba8",
    color: "white"
  },
  chipActive: {
    backgroundColor: "#79ff25",
    color: "white"
  }
};

export default function Results({ teststate, result, onClickLink, ...rest }) {

  const dispatch = useDispatch();

  const items = useSelector(selectItems);

  // Remove from Redux state
  const handleDelItem = (data) => {
    dispatch(delItem({ id: data.id.raw }));
  }

  // Add to Redux state
  const handleAddItem = (data) => {
    const payload = {
      id: data.id.raw,
      prod_id: data.id.raw,
      product: data.product_code.raw,
      requested_quantity: 1,
      supplier: data.supplier.raw,
      manufacturer: data.manufacturer.raw,
      description: data.description.raw,
      supplier_id: data.supplier_id.raw
    }
    // console.log(payload)
    dispatch(addItem(payload));
  };

  const getCartItems = (id) => {
    const item = items.find((i) => i.id === id);
    return item ? item.requested_qty : 0;
  }

  return (


    <li className="sui-result">
      <div onClick={onClickLink} className="sui-result__header">

        {/* <a class="sui-result__title sui-result__title-link" href="504" target="_blank" rel="noopener noreferrer">Naginbhai Patel</a>         */}
        <a className="sui-result__title-link" href={"viewProduct?product=" + result.id.raw}>
          <span
            className="sui-result__title"
            // Snippeted results contain search term highlights with html and are
            // 100% safe and santitized, so we dangerously set them here
            dangerouslySetInnerHTML={{ __html: result.description.snippet }}
          />
        </a>
        <StyledDeleteIcon color="error" />

      </div>
      <div className="sui-result__body">
        <div className="col-lg-3">
          <div
            className="sui-result__image"
            style={{
              maxWidth: "140px",
              paddingLeft: "24px",
              paddingTop: "1.8rem"
            }}
          >
            <img
              // src={result.img.raw || '/images/img_placeholder.jpg'}
              src={'/images/img_placeholder.jpg'}
              alt="thumb"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center"
              }}
            />
          </div>
        </div>
        <div className="col-lg-5">

          <ul className="sui-result__details">
            <li>
              <span className="sui-result__key">Supplier</span>{" "}
              <span
                className="sui-result__value"
                dangerouslySetInnerHTML={{
                  __html: result.supplier.snippet
                }}
              />
            </li>
            <li>
              <span className="sui-result__key">Description</span>{" "}
              <span
                className="sui-result__value"
                dangerouslySetInnerHTML={{
                  __html: result.description.snippet
                }}
              />
            </li>
            <li>
              <span className="sui-result__key">Category</span>{" "}
              <span
                className="sui-result__value"
                dangerouslySetInnerHTML={{
                  __html: result.category.snippet
                }}
              />
            </li>
            <li>
              <span className="sui-result__key">Quantity</span>{" "}
              <Chip style={
                result.category.raw ? styles.chipActive : styles.chipInactive}
                className="sui-result__value"
                label="use for alert"
                size="small"
                color="primary"
              />
            </li>
          </ul>

        </div>
        <div className="col-lg-4">

          <div className="sui-result-actionBtns">
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Typography sx={{ mx: 2, fontWeight: "400" }} variant="p" component="div">
                Order More:
              </Typography>
              <AddCircleOutlineIcon className="sui-addToCart"
                size="small"
                onClick={() => handleAddItem(result)}
                color="success"
              >+
              </AddCircleOutlineIcon>
              <Box sx={{ fontWeight: "500" }} px={1}>
                {0}
              </Box>
              <RemoveCircleOutlineIcon className="sui-remFromCart"
                size="small"
                color="error"
                onClick={() => handleDelItem(result)}
              >
                -
              </RemoveCircleOutlineIcon>

            </ButtonGroup>
            {/* <AddCircleIcon onClick={() => handleAddItem(cell.row)} color="success" />
          <RemoveCircleIcon onClick={() => handleDeleteItem(cell.row)} color="error" /> */}
          </div>
        </div>
      </div>
    </li>
  )
};