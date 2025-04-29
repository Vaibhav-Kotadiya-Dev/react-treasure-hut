import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { listOfUser, updateUserRegistrationDate } from "../../api/user";
import Loader from "../../components/loader";

const AdminUserTable = () => {
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(false);
  const [updateLoading, setUpdateLoader] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedDate, setEditedDate] = useState(null);

  useEffect(() => {    
    if(!users.length){
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
  }, [JSON.stringify(users)]);

  const handleEditClick = (user) => {
    setEditingId(user.mobileNumber);
    setEditedDate(dayjs(user.registrationDate));
  };

  const handleSaveClick = (userId) => {
    if (editedDate) {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, registrationDate: editedDate }
            : user
        )
      );
      setUpdateLoader(true);
      updateUserRegistrationDate(userId, { registrationDate: editedDate })
        .then((response) => {
            if(response){
                // Add toaster afterwards
            }
        })
        .catch((error) => {
          console.error(`:::ERROR IN UPDATE::::${error}`);
        })
        .finally(() => {
          setUpdateLoader(false);
        });
    }
    setEditingId(null);
    setEditedDate(null);
  };

  return loader ? (
    <Loader />
  ) : (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {updateLoading && <Loader variant="overlay" />}
      <Box sx={{ padding: 10, backgroundColor: "#D2B48C"}}>
        <Typography
          variant="h5"
          sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}
        >
          Admin User Management
        </Typography>
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: "12px",
            padding: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Mobile Number
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Registration Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.mobileNumber}</TableCell>
                  <TableCell>
                    {editingId === user.mobileNumber ? (
                      <DatePicker
                        value={editedDate}
                        label="Edit Registration Date"
                        minDate={dayjs()}
                        format="DD/MM/YYYY"
                        onChange={(newDate) => setEditedDate(newDate)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            sx={{ minWidth: 180 }}
                          />
                        )}
                      />
                    ) : (
                      <Typography sx={{ fontSize: "14px" }}>
                        {dayjs(user.registrationDate).format("DD/MM/YYYY")}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === user.mobileNumber ? (
                      <IconButton
                        color="success"
                        onClick={() => handleSaveClick(user._id)}
                      >
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(user)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
};

export default AdminUserTable;

