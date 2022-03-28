import React, { useState } from "react";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useNavigate from "react-router-dom";
import { LoginWrapper } from "./uiComponents/styled/Login-styles";

async function loginUser(credentials) {
  return fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

const theme = createTheme();

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
    });
    setToken(token);
  };

  return (
    <LoginWrapper>
      <video
        className="vid"
        style={{
          backgroundSize: "cover",
          width: "100vw",
          backgroundPosition: "left",
          transform: "scale(1.4)",
          overflow: "hidden",
        }}
        autoPlay
        muted
        loop
        id="myVideo"
      >
        <source src="/video/DJI_0005.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
      {/* <div className="box">
        <div className="center">
          <h1>Inventory Management System</h1>
          <p></p>
          <button id="myBtn" onclick="myFunction()">
            Pause
          </button>
        </div>
      </div> */}
      <div className="overlay"></div>
      <div className="overlay2">
        <Grid container component="main" sx={{ height: "100vh", px: "30%" }}>
          <CssBaseline />

          <Grid item xs={12} sm={8} md={12} elevation={6} square>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  height: 70,
                  width: 70,
                  m: 1,
                  mt: "35%",
                  bgcolor: "primary.main",
                }}
              >
                <LockOutlinedIcon />
              </Avatar>

              <Typography colo="secondary" component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{ left: 0, color: "white" }}
                  component="h3"
                  variant="h3"
                >
                  Inventory Management System
                </Typography>
              </Box>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  sx={{ fontSize: "1.2rem" }}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item></Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </div>
      <div className="overlay3"></div>
    </LoginWrapper>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
