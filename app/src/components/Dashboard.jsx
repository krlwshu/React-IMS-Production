import React, { useState, useEffect } from "react";
import axios from "axios";

import { Typography, Card, Avatar, Stack, Divider } from "@mui/material";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";
import DoneOutlineOutlinedIcon from "@mui/icons-material/DoneOutlineOutlined";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import RouterIcon from "@mui/icons-material/Router";
import { Wrapper } from "./uiComponents/styled/Dashboard-styles";

// icons
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

// Charts
import DashPie from "./uiComponents/DashPie";

// Headers
import useToken from "./auth/useToken";

export default function Dashboard() {
  const { token } = useToken();
  const headers = { headers: { "x-access-token": JSON.parse(token) } };

  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      await axios.get("/getOrderUpdates", headers).then(({ data }) => {
        setData(data);
        setLoadingData(false);
      });
    }
    if (loadingData) {
      getData();
    }
  });

  const [loadingDataAlerts, setLoadingDataAlerts] = useState(true);
  const [alertingData, setAlertingData] = useState([]);

  const [loadingDash, setLoadingash] = useState(true);
  const [dashData, setDashData] = useState([]);

  useEffect(() => {
    async function getData() {
      await axios.get("/getAlerting", headers).then(({ data }) => {
        setAlertingData(data);
        setLoadingDataAlerts(false);
      });
    }
    if (loadingDataAlerts) {
      getData();
    }
  }, []);

  useEffect(() => {
    async function getData() {
      await axios.get("/getDashData", headers).then(({ data }) => {
        setDashData(data);
        setLoadingash(false);
        console.log(data);
      });
    }
    if (loadingDataAlerts) {
      getData();
    }
  }, []);

  const customDataKey = (data) => {
    console.log(data);
    return data.value;
  };

  return (
    <Wrapper className="dashboard">
      <h1>Inventory Dashboard</h1>
      <div className="row">
        <div className="col-lg-4">
          <Card sx={{ p: 5, radius: 5 }}>
            <Typography
              sx={{ pl: 5 }}
              variant="h5"
              component="h5"
              color="primary"
            >
              Order Status
            </Typography>
            {loadingDash === false && (
              <div style={{ height: 300 }}>
                <DashPie data={dashData} />
              </div>
            )}
          </Card>
        </div>
        <div className="col-lg-4">
          <Card sx={{ p: 5, radius: 5 }}>
            <Typography
              sx={{ pl: 5 }}
              variant="h5"
              component="h5"
              color="primary"
            >
              Order Status
            </Typography>
            {loadingDash === false && (
              <div style={{ height: 300 }}>
                <DashPie data={dashData} />
              </div>
            )}
          </Card>
        </div>
        <div className="col-lg-4">
          <Card sx={{ p: 5, radius: 5 }}>
            <Stack direction="row">
              <HourglassBottomOutlinedIcon
                color="secondary"
                sx={{ fontSize: 40 }}
                aria-label=""
              ></HourglassBottomOutlinedIcon>
              <Typography
                sx={{ pl: 5 }}
                variant="h5"
                component="h5"
                color="secondary"
              >
                Awaiting Supplier Response
              </Typography>
            </Stack>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
              }}
            >
              {data
                .filter((item) => item.supplier_approval_status === "New")
                .map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem key={`${item.id}_1`}>
                      <ListItemAvatar>
                        <Avatar>
                          <RouterIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`#${item.id} ${item.company_name}`}
                        secondary={`${item.requested_quantity} items requested (${item.product_code})`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
            </List>
          </Card>
        </div>
        <div className="col-lg-4">
          <Card sx={{ p: 5, radius: 5 }}>
            <Stack direction="row">
              <HourglassBottomOutlinedIcon
                color="primary"
                sx={{ fontSize: 40 }}
                aria-label=""
              ></HourglassBottomOutlinedIcon>
              <Typography
                sx={{ pl: 5 }}
                variant="h5"
                component="h5"
                color="primary"
              >
                Awaiting IM Approval
              </Typography>
            </Stack>
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
              }}
            >
              {data
                .filter((item) => item.supplier_approval_status === "Partial")
                .map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem key={item.id}>
                      <ListItemAvatar>
                        <Avatar>
                          <RouterIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`#${item.id} ${item.company_name}`}
                        secondary={`${item.supp_avail_qty}/${item.requested_quantity} available (${item.product_code})`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
            </List>
          </Card>
        </div>
        <div className="col-lg-6">
          <Card sx={{ p: 5, radius: 5 }}>
            <Stack direction="row">
              <WarningAmberIcon
                sx={{ fontSize: 40, color: "orange" }}
                aria-label=""
              ></WarningAmberIcon>
              <Typography
                sx={{ color: "orange", pl: 5 }}
                variant="h5"
                color="primary"
              >
                Low Quantity Alerts
              </Typography>
            </Stack>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {alertingData.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem key={item.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <RouterIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${item.manufacturer} - ${item.description} `}
                      secondary={`${item.qty_avail} items remaining - alert if below: ${item.alert_level}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}
