import React, { useEffect, useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Button,
  Select,
  MenuItem,
  Drawer,
  Box,
  Divider,
  List,
  ListItem,
  Avatar,
} from "@mui/material";

import {
  Warning,
  Error,
  CheckCircle,
} from "@mui/icons-material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import axios from "axios";

const Dashboard = () => {

  const [buyers, setBuyers] = useState([]);

  const [search, setSearch] = useState("");

  const [riskFilter, setRiskFilter] =
    useState("ALL");

  const [vpnOnly, setVpnOnly] =
    useState(false);

  const [promoOnly, setPromoOnly] =
    useState(false);

  const [selectedBuyer, setSelectedBuyer] =
    useState(null);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {

    try {

      const response = await axios.get(
        "http://localhost:8000/buyers"
      );

      setBuyers(response.data);

    } catch (error) {

      console.error(
        "Error fetching buyers",
        error
      );

    }
  };

  const handleFileUpload = async (
    event
  ) => {

    const file =
      event.target.files[0];

    if (!file) return;

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    try {

      await axios.post(
        "http://localhost:8000/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Excel uploaded successfully!"
      );

      fetchBuyers();

    } catch (error) {

      console.error(
        "Upload failed",
        error
      );

      alert("Upload failed");

    }
  };

  const openBuyerDrawer = (
    buyer
  ) => {

    setSelectedBuyer(buyer);

    setDrawerOpen(true);

  };

  const closeDrawer = () => {

    setDrawerOpen(false);

  };

  const generateRelationshipSignals = (
    buyer
  ) => {

    const signals = [];

    if (!buyer) return signals;

    if (
      buyer.shared_accounts >= 5
    ) {

      signals.push(
        `${buyer.shared_accounts} buyers linked to same infrastructure`
      );

    }

    if (buyer.vpn_detected) {

      signals.push(
        "VPN / Proxy masking detected"
      );

    }

    if (
      buyer.return_ratio >= 50
    ) {

      signals.push(
        "Abnormally high return behavior"
      );

    }

    if (
      buyer.orders_last_24h >= 10
    ) {

      signals.push(
        "High velocity ordering pattern"
      );

    }

    if (buyer.promo_abuse) {

      signals.push(
        "Promo abuse ring suspected"
      );

    }

    if (
      buyer.address_quality ===
      "GARBLED"
    ) {

      signals.push(
        "Synthetic / manipulated address"
      );

    }

    return signals;
  };

  const calculateDynamicRisk = (
    buyer
  ) => {

    let score = 0;

    if (buyer.vpn_detected) {
      score += 25;
    }

    if (
      buyer.address_quality ===
      "GARBLED"
    ) {
      score += 20;
    }

    if (
      buyer.shared_accounts >= 5
    ) {
      score += 20;
    }

    if (
      buyer.return_ratio >= 50
    ) {
      score += 15;
    }

    if (
      buyer.orders_last_24h >= 10
    ) {
      score += 10;
    }

    if (buyer.promo_abuse) {
      score += 10;
    }

    if (
      buyer.delivery_failures >= 3
    ) {
      score += 10;
    }

    let level = "GREEN";

    if (score >= 60) {

      level = "RED";

    } else if (score >= 30) {

      level = "AMBER";

    }

    return {
      score,
      level,
    };
  };

  const generateTimelineEvents = (
    buyer
  ) => {

    if (!buyer) return [];

    const events = [];

    events.push({
      time: "09:10 AM",
      event:
        "Buyer account created",
    });

    if (
      buyer.orders_last_24h >= 5
    ) {

      events.push({
        time: "09:30 AM",
        event:
          "Multiple high velocity orders detected",
      });

    }

    if (buyer.promo_abuse) {

      events.push({
        time: "09:42 AM",
        event:
          "Promo abuse pattern triggered",
      });

    }

    if (buyer.vpn_detected) {

      events.push({
        time: "10:05 AM",
        event:
          "VPN / Proxy connection detected",
      });

    }

    if (
      buyer.address_quality ===
      "GARBLED"
    ) {

      events.push({
        time: "10:15 AM",
        event:
          "Address validation failed",
      });

    }

    if (
      buyer.return_ratio >= 50
    ) {

      events.push({
        time: "10:45 AM",
        event:
          "High return ratio escalation",
      });

    }

    return events;
  };

  const filteredBuyers =
    buyers.filter((buyer) => {

      const matchesSearch =
        buyer.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const dynamicRisk =
        calculateDynamicRisk(
          buyer
        );

      const matchesRisk =
        riskFilter === "ALL"
          ? true
          : dynamicRisk.level ===
            riskFilter;

      const matchesVpn =
        vpnOnly
          ? buyer.vpn_detected ===
            true
          : true;

      const matchesPromo =
        promoOnly
          ? buyer.promo_abuse ===
            true
          : true;

      return (
        matchesSearch &&
        matchesRisk &&
        matchesVpn &&
        matchesPromo
      );

    });

  const lowRiskCount =
    buyers.filter(
      (b) =>
        calculateDynamicRisk(b)
          .level === "GREEN"
    ).length;

  const mediumRiskCount =
    buyers.filter(
      (b) =>
        calculateDynamicRisk(b)
          .level === "AMBER"
    ).length;

  const highRiskCount =
    buyers.filter(
      (b) =>
        calculateDynamicRisk(b)
          .level === "RED"
    ).length;

  return (
    <div
      style={{
        background: "#f4f6f8",
        minHeight: "100vh",
      }}
    >

      <AppBar
        position="static"
        sx={{
          background:
            "#081330",
        }}
      >

        <Toolbar>

          <Avatar
            sx={{
              marginRight: 2,
            }}
          >
            R
          </Avatar>

          <Typography variant="h5">
            Ecommerce Buyer Risk Dashboard
          </Typography>

        </Toolbar>

      </AppBar>

      <Container
        maxWidth="xl"
        sx={{
          marginTop: 4,
        }}
      >

        <Grid
          container
          spacing={3}
        >

          <Grid
            item
            xs={12}
            md={3}
          >

            <Card
              sx={{
                borderRadius: 4,
              }}
            >

              <CardContent>

                <Typography variant="h5">
                  Low Risk Buyers
                </Typography>

                <Typography variant="h2">
                  {lowRiskCount}
                </Typography>

                <CheckCircle
                  color="success"
                  fontSize="large"
                />

              </CardContent>

            </Card>

          </Grid>

          <Grid
            item
            xs={12}
            md={3}
          >

            <Card
              sx={{
                borderRadius: 4,
              }}
            >

              <CardContent>

                <Typography variant="h5">
                  Medium Risk Buyers
                </Typography>

                <Typography variant="h2">
                  {mediumRiskCount}
                </Typography>

                <Warning
                  color="warning"
                  fontSize="large"
                />

              </CardContent>

            </Card>

          </Grid>

          <Grid
            item
            xs={12}
            md={3}
          >

            <Card
              sx={{
                borderRadius: 4,
              }}
            >

              <CardContent>

                <Typography variant="h5">
                  High Risk Buyers
                </Typography>

                <Typography variant="h2">
                  {highRiskCount}
                </Typography>

                <Error
                  color="error"
                  fontSize="large"
                />

              </CardContent>

            </Card>

          </Grid>

        </Grid>

        <Card
          sx={{
            marginTop: 5,
            borderRadius: 5,
            padding: 2,
          }}
        >

          <CardContent>

            <Typography
              variant="h4"
              sx={{
                marginBottom: 3,
              }}
            >
              Buyer Investigation Queue
            </Typography>

            <Box
              display="flex"
              gap={2}
              flexWrap="wrap"
              marginBottom={3}
            >

              <TextField
                label="Search buyer"
                variant="outlined"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

              <Select
                value={riskFilter}
                onChange={(e) =>
                  setRiskFilter(
                    e.target.value
                  )
                }
                sx={{
                  minWidth: 130,
                }}
              >

                <MenuItem value="ALL">
                  ALL
                </MenuItem>

                <MenuItem value="RED">
                  RED
                </MenuItem>

                <MenuItem value="AMBER">
                  AMBER
                </MenuItem>

                <MenuItem value="GREEN">
                  GREEN
                </MenuItem>

              </Select>

              <Button
                variant={
                  vpnOnly
                    ? "contained"
                    : "outlined"
                }
                color="error"
                onClick={() =>
                  setVpnOnly(
                    !vpnOnly
                  )
                }
              >
                VPN BUYERS
              </Button>

              <Button
                variant={
                  promoOnly
                    ? "contained"
                    : "outlined"
                }
                color="warning"
                onClick={() =>
                  setPromoOnly(
                    !promoOnly
                  )
                }
              >
                PROMO ABUSE
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {

                  setRiskFilter(
                    "ALL"
                  );

                  setVpnOnly(false);

                  setPromoOnly(
                    false
                  );

                  setSearch("");

                }}
              >
                RESET FILTERS
              </Button>

              <Button
                variant="contained"
                component="label"
                startIcon={
                  <CloudUploadIcon />
                }
                sx={{
                  backgroundColor:
                    "#081330",
                  "&:hover": {
                    backgroundColor:
                      "#003566",
                  },
                }}
              >
                Upload Excel

                <input
                  type="file"
                  hidden
                  accept=".xlsx,.xls"
                  onChange={
                    handleFileUpload
                  }
                />

              </Button>

            </Box>

            <TableContainer
              component={Paper}
            >

              <Table>

                <TableHead>

                  <TableRow>

                    <TableCell>
                      Buyer ID
                    </TableCell>

                    <TableCell>
                      Name
                    </TableCell>

                    <TableCell>
                      Risk
                    </TableCell>

                    <TableCell>
                      Dynamic Score
                    </TableCell>

                    <TableCell>
                      IP Address
                    </TableCell>

                    <TableCell>
                      Fingerprint
                    </TableCell>

                    <TableCell>
                      Shared Accounts
                    </TableCell>

                    <TableCell>
                      Return Ratio
                    </TableCell>

                    <TableCell>
                      Orders 24H
                    </TableCell>

                    <TableCell>
                      Address
                    </TableCell>

                    <TableCell>
                      VPN
                    </TableCell>

                    <TableCell>
                      Promo Abuse
                    </TableCell>

                    <TableCell>
                      Delivery Failures
                    </TableCell>

                  </TableRow>

                </TableHead>

                <TableBody>

                  {filteredBuyers.map(
                    (buyer) => {

                      const dynamicRisk =
                        calculateDynamicRisk(
                          buyer
                        );

                      return (

                        <TableRow
                          key={buyer.id}
                          hover
                          onClick={() =>
                            openBuyerDrawer(
                              buyer
                            )
                          }
                          sx={{
                            cursor:
                              "pointer",
                          }}
                        >

                          <TableCell>
                            {buyer.id}
                          </TableCell>

                          <TableCell>
                            {buyer.name}
                          </TableCell>

                          <TableCell>

                            <Chip
                              label={
                                dynamicRisk.level
                              }
                              color={
                                dynamicRisk.level ===
                                "RED"
                                  ? "error"
                                  : dynamicRisk.level ===
                                    "AMBER"
                                  ? "warning"
                                  : "success"
                              }
                            />

                          </TableCell>

                          <TableCell>

                            <Chip
                              label={
                                dynamicRisk.score
                              }
                              color={
                                dynamicRisk.level ===
                                "RED"
                                  ? "error"
                                  : dynamicRisk.level ===
                                    "AMBER"
                                  ? "warning"
                                  : "success"
                              }
                            />

                          </TableCell>

                          <TableCell>
                            {buyer.ip_address}
                          </TableCell>

                          <TableCell>
                            {buyer.device_fingerprint}
                          </TableCell>

                          <TableCell>
                            {buyer.shared_accounts}
                          </TableCell>

                          <TableCell>
                            {buyer.return_ratio}%
                          </TableCell>

                          <TableCell>
                            {buyer.orders_last_24h}
                          </TableCell>

                          <TableCell>
                            {buyer.address_quality}
                          </TableCell>

                          <TableCell>
                            {buyer.vpn_detected
                              ? "YES"
                              : "NO"}
                          </TableCell>

                          <TableCell>
                            {buyer.promo_abuse
                              ? "YES"
                              : "NO"}
                          </TableCell>

                          <TableCell>
                            {
                              buyer.delivery_failures
                            }
                          </TableCell>

                        </TableRow>

                      );

                    }
                  )}

                </TableBody>

              </Table>

            </TableContainer>

          </CardContent>

        </Card>

      </Container>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
      >

        <Box
          sx={{
            width: 420,
            padding: 3,
          }}
        >

          {selectedBuyer && (

            <>

              <Typography
                variant="h4"
                gutterBottom
              >
                {selectedBuyer.name}
              </Typography>

              <Typography
                variant="h6"
              >
                Dynamic Risk Score:
                {" "}
                {
                  calculateDynamicRisk(
                    selectedBuyer
                  ).score
                }
              </Typography>

              <Divider
                sx={{
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />

              <Typography
                variant="h6"
              >
                Linked Fraud Intelligence
              </Typography>

              <List>

                {generateRelationshipSignals(
                  selectedBuyer
                ).map(
                  (
                    signal,
                    index
                  ) => (

                    <ListItem
                      key={index}
                    >

                      <Chip
                        label={
                          signal
                        }
                        color="error"
                        sx={{
                          width:
                            "100%",
                        }}
                      />

                    </ListItem>

                  )
                )}

              </List>

              <Divider
                sx={{
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />

              <Typography
                variant="h6"
              >
                Fraud Activity Timeline
              </Typography>

              <List>

                {generateTimelineEvents(
                  selectedBuyer
                ).map(
                  (
                    item,
                    index
                  ) => (

                    <ListItem
                      key={index}
                    >

                      <Box>

                        <Typography
                          variant="body2"
                          color="textSecondary"
                        >
                          {item.time}
                        </Typography>

                        <Typography
                          variant="body1"
                        >
                          {item.event}
                        </Typography>

                      </Box>

                    </ListItem>

                  )
                )}

              </List>

            </>

          )}

        </Box>

      </Drawer>

    </div>
  );
};

export default Dashboard;