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
  IconButton,
  Typography,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { listOfUser, updateUserRegistrationDate } from "../../api/user";
import Loader from "../../components/loader";
import UserActionsDialog from "../../components/dialog-box";

const AdminUserTable = () => {
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [updateLoading, setUpdateLoader] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogFields, setDialogFields] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuUser, setMenuUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    if (!users.length) {
      setLoader(true);
      listOfUser()
        .then((response) => {
          const { data = [] } = response;
          setUsers(data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoader(false);
        });
    }
  }, []);

  const formatDialogFields = () => {
    return [
      {
        label: "Full Name",
        name: "fullName",
        value: dialogFields?.fullName,
        editable: false,
        isPrimary: true,
      },
      {
        label: "Mobile Number",
        name: "mobileNumber",
        value: dialogFields?.mobileNumber,
        editable: false,
      },
      {
        label: "Number of Participants",
        name: "teamMemberCount",
        value: dialogFields?.teamMemberCount,
        editable: false,
      },
      {
        label: "Registration Date",
        name: "registrationDate",
        value: dialogFields?.registrationDate,
        editable: true,
        type: "date",
      },
    ];
  };
  const handleDialogFieldChange = (name, value) => {
    setDialogFields((prev) => ({ ...prev, [name]: value }));
  };

  const openUserDialog = (user) => {
    setSelectedUser(user);
    setDialogFields({
      fullName: user.fullName || "",
      mobileNumber: user.mobileNumber || "",
      teamMemberCount: user.teamMemberCount || "",
      registrationDate: user.registrationDate || "",
    });
    setDialogOpen(true);
  };

  const handleSaveClick = (userId) => {
    if (dialogFields.registrationDate) {
      setUpdateLoader(true);
      updateUserRegistrationDate(userId, {
        registrationDate: dialogFields.registrationDate,
      })
        .then((response) => {
          // Add toast message
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setUpdateLoader(false);
        });
    }
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setMenuUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuUser(null);
  };

  const handleEdit = () => {
    if (menuUser) openUserDialog(menuUser);
    handleMenuClose();
  };

  return loader ? (
    <Loader />
  ) : (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {updateLoading && <Loader variant="overlay" />}
      <Box
        sx={{
          padding: isMobile ? 1.5 : 6,
          backgroundColor: "#f5f5f5",
          width: "auto",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold", color: "#2b2c30" }}
        >
          Admin User Management
        </Typography>

        <Box
          sx={{
            overflowX: "auto",
            width: "100%",
            display: "block", // important!
          }}
        >
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              borderRadius: "10px",
              padding: 2,
              minWidth: 700, // Add minimum width to prevent shrink
            }}
          >
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Mobile Number
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Payment Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Quiz Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Registration Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>{user.fullName || "N/A"}</TableCell>
                    <TableCell>{user.mobileNumber}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: user.isPaymentSuccessful ? "green" : "red",
                        }}
                      >
                        {user.isPaymentSuccessful ? "Paid" : "Unpaid"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: user.hasVoucher ? "green" : "orange" }}
                      >
                        {user.hasVoucher ? "Completed" : "Pending"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {dayjs(user.registrationDate).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit} disabled={menuUser?.hasVoucher}>
          Edit
        </MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </Menu>
      <UserActionsDialog
        open={dialogOpen}
        label={"Update Details"}
        handleClose={() => setDialogOpen(false)}
        fields={formatDialogFields()}
        onFieldChange={handleDialogFieldChange}
        actions={[
          {
            label: "Cancel",
            onClick: () => setDialogOpen(false),
            variant: "outlined",
          },
          {
            label: "Update Role",
            onClick: () => {
              handleSaveClick(selectedUser._id);
              setDialogOpen(false);
            },
            color: "primary",
          },
        ]}
      />
    </LocalizationProvider>
  );
};

export default AdminUserTable;
