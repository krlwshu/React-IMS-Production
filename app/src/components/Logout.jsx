import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();
export default function Logout() {
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(/images/ims_stock_adobe.jpeg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <h3>Logged Out</h3>
              <p>You have been logged out.</p>
              <p>{Date("2015-03-25T12:00:00-06:30")}</p>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                <Link sx={{ color: "white" }} href="/">
                  {"Go to Login"}
                </Link>
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

Logout.propTypes = {
  setToken: PropTypes.func.isRequired,
};
