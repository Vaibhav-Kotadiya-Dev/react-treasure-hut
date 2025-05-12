import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Pagination,
  Chip
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { listOfUser } from "../../api/user";
import Loader from "../../components/loader";

const AdminUserTable = () => {
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setLoader(true);
    listOfUser(page, rowsPerPage)
      .then((response) => {
        const { users = [], total = 0 } = response.data;
        setUsers(users);
        setTotalCount(total);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [page]);
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return loader ? (
    <Loader variant="overlay" />
  ) : (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          padding: isMobile ? 1.5 : 6,
          // background:
          //   "linear-gradient(to right, #DBBA2C 40.33% 50%, white 50%)",
          width: "auto",
          minHeight: "calc(100vh - 100px)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold", textTransform: "uppercase" }}
        >
          Admin User Management
        </Typography>

        <Box
          sx={{
            overflowX: "auto",
            width: "100%",
            display: "block",
            boxShadow: "6px 6px 12px rgba(9, 9, 9, 0.1)!",
            border: "1px solid #e0e0e0",
            borderRadius: "7px",
          }}
        >
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              // borderRadius: "7px",
              padding: 2,
              minWidth: 700,
            }}
          >
            <Table sx={{ minWidth: 700, border: "1px solid #e0e0e0" }}>
              <TableHead >
                <TableRow sx={{ borderBottom: '1px solid #ccc'}}>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "center",
                      borderRight: "1px solid #f0f0f0"
                    }}
                  >
                    Full Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "center",
                      borderRight: "1px solid #f0f0f0"
                    }}
                  >
                    Mobile Number
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "center",
                      borderRight: "1px solid #f0f0f0"
                    }}
                  >
                    Payment Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "center",
                      borderRight: "1px solid #f0f0f0"
                    }}
                  >
                    Quiz Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      textAlign: "center",
                      borderRight: "1px solid #f0f0f0"
                    }}
                  >
                    Registration Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user._id} hover sx={{ borderBottom: '1px solid #f0f0f0' }}>
                    <TableCell sx={{ textAlign: "center", borderRight: "1px solid #f0f0f0" }}>
                      {user.fullName || "N/A"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", borderRight: "1px solid #f0f0f0"}}>
                      {user.mobileNumber}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", borderRight: "1px solid #f0f0f0" }}>
                      <Chip
                        label={user.isPaymentSuccessful ? "Paid" : "Unpaid"}
                        color={user.isPaymentSuccessful ? "success" : "default"}
                        size="small"
                        variant={
                          user.isPaymentSuccessful ? "filled" : "outlined"
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", borderRight: "1px solid #f0f0f0" }}>
                      <Chip
                        label={user.hasVoucher ? "Completed" : "Pending"}
                        color={user.hasVoucher? "success" : "warning"}
                        size="small"
                        variant={
                          user.hasVoucher? "filled" : "outlined"
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", borderRight: "1px solid #f0f0f0" }}>
                      {dayjs(user.registrationDate).format("DD/MM/YYYY")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Pagination
            count={Math.ceil(totalCount / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AdminUserTable;

