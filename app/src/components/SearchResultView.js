import React from "react";
import Chip from '@material-ui/core/Chip';
import Button from '@mui/material/Button'



// Buttons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

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



// export default function SearchResultView() {
//   return (
//     <div>SearchResultView</div>
//   )
// }


export default function Results({ teststate, result, onClickLink, ...rest }) {


  const handleClick = (data) => {
    console.log(data.category.raw)
    console.log(data.description.raw)
    console.log(data.id.raw)


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
        <div className="col-lg-4">

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

          <div>
            <AddCircleIcon color="success" onClick={() => handleClick(result)} />
            <RemoveCircleIcon color="error" onClick={() => handleClick(result)} />
            {/* <AddCircleIcon onClick={() => handleAddItem(cell.row)} color="success" />
          <RemoveCircleIcon onClick={() => handleDeleteItem(cell.row)} color="error" /> */}
          </div>
        </div>
      </div>
    </li>
  )
};

