import React, { useState } from "react";
import "./AccTable.scss";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import AccPopup from "../AccountPopup/AccPopup";
import AccUpdatePopup from "../AccountPopup/AccUpdatePopup";
import { useDispatch } from "react-redux";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const AccTable = (props) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isOpenPopup, setOpenPopup] = useState(false);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const handleEditClick = (record) => {
    setSelectedRecord(record);
  };

  const handleFormClose = () => {
    setSelectedRecord(null);
  };

  const changePopup = () => {
    setOpenPopup(!isOpenPopup);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const rowsPerPage = 5;

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const slice = props.data || [];
  const slice_data = slice.slice(startIndex, endIndex);

  function renderTable() {
    return slice_data.map((user, key) => {
      return (
        <>
          <tr key={user.user_id}>
            <td>{user.user_id}</td>
            <td>{`${user.first_name} ${user.last_name}`}</td>
            <td>{user.email}</td>
            <td>{user.address}</td>
            <td>{user.phone}</td>
            <td>{user.role_id}</td>
            <td>
              <AiFillEdit
                className="btn"
                onClick={() => handleEditClick(user)}
              />
              <AiFillDelete className="btn" />
            </td>
          </tr>
        </>
      );
    });
  }

  const count = Array.isArray(props.data) ? props.data.length : 0;

  return (
    <div className="acc-table-data">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>{renderTable()}</tbody>
      </table>
      <Stack spacing={2} className="pagination-container">
        <Pagination
          count={Math.ceil(count / rowsPerPage)} // Total number of pages
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Stack>
      {isOpenPopup && <AccPopup changePopup={changePopup} />}
      {selectedRecord && (
        <AccUpdatePopup record={selectedRecord} onClose={handleFormClose} />
      )}
    </div>
  );
};

export default AccTable;
