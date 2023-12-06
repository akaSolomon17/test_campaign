import React, { useState } from "react";
import "./AccTable.scss";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import AccPopup from "../AccountPopup/AccPopup";
import AccUpdatePopup from "../AccountPopup/AccUpdatePopup";
import { useDispatch } from "react-redux";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { deleteAccountAction } from "../../../store/actions/accountAction";
import useAxios from "../../../utils/useAxios";

const AccTable = (props) => {
  const api = useAxios();
  const listAccounts = props.listAccounts;
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isOpenPopup, setOpenPopup] = useState(false);
  // const [page, setPage] = useState(1);

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

  // const handleChangePage = (event, value) => {
  //   setPage(value);
  // };

  // const rowsPerPage = 5;

  // const startIndex = (page - 1) * rowsPerPage;
  // const endIndex = startIndex + rowsPerPage;

  // const props_data = props || [];
  // const slice_data = props_data.slice(startIndex, endIndex);

  // const count = Array.isArray(props) ? props.length : 0;

  function handleDeleteUser(user) {
    dispatch(deleteAccountAction(user.user_id, api));
  }

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

        <tbody>
          {listAccounts &&
            listAccounts.map((user, index) => {
              return (
                <React.Fragment key={index}>
                  <tr>
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
                      <AiFillDelete
                        className="btn"
                        onClick={() => handleDeleteUser(user)}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
        </tbody>
      </table>
      <Stack spacing={2} className="pagination-container">
        <Pagination
          // count={Math.ceil(count / rowsPerPage)} // Total number of pages
          // page={page}
          // onChange={handleChangePage}
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
