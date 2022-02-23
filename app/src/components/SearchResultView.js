import React from "react";
import Chip from '@material-ui/core/Chip';

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


export default ({ result, onClickLink,...rest }) => (

  <li className="sui-result">
    <div onClick={onClickLink} className="sui-result__header">

    {/* <a class="sui-result__title sui-result__title-link" href="504" target="_blank" rel="noopener noreferrer">Naginbhai Patel</a>         */}
     <a className="sui-result__title-link" href={"user-settings?user=" + result.id.raw}> 
                <span
                    className="sui-result__title"
                    // Snippeted results contain search term highlights with html and are
                    // 100% safe and santitized, so we dangerously set them here
                    dangerouslySetInnerHTML={{ __html: result.name.snippet }}
      />
      </a>
    </div>
    <div className="sui-result__body">
      <div
        className="sui-result__image"
        style={{
          maxWidth: "140px",
          paddingLeft: "24px",
          paddingTop: "10px"
        }}
      >
        <img
          src={result.avatar.raw || '/images/avatars/pp_boy4.jpg'}
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
      <ul className="sui-result__details">
        <li>
          <span className="sui-result__key">Name</span>{" "}
          <span
            className="sui-result__value"
            dangerouslySetInnerHTML={{
              __html: result.name.snippet
            }}
          />
        </li>
        <li>
          <span className="sui-result__key">Skills</span>{" "}
          <span
            className="sui-result__value"
            dangerouslySetInnerHTML={{
              __html: result.skills_raw.snippet
            }}
          />
        </li>
        <li>
          <span className="sui-result__key">Role</span>{" "}
          <span
            className="sui-result__value"
            dangerouslySetInnerHTML={{
              __html: result.role.snippet
            }}
          />
        </li>
        <li>
          <span className="sui-result__key">Internal ID</span>{" "}
          <span className="sui-result__value">{result.id.raw}</span>
        </li>
        <li>
          <span className="sui-result__key">Service Type</span>{" "}
          <span className="sui-result__value">{result.service_desc.raw}</span>
        </li>
        <li>
          <span className="sui-result__key">Active Status</span>{" "}
          {/* <span
            className="sui-result__value"
            dangerouslySetInnerHTML={{
              __html: result.active_status.snippet
            }}

          /> */}
                    <Chip style={
                        result.active_status.raw === "Active" ? styles.chipActive : styles.chipInactive}
                        className="sui-result__value"
                        label={result.active_status.raw}
                        size="small"
                        color="primary"
                    />
                </li>
            </ul>
        </div>
    </li>
);