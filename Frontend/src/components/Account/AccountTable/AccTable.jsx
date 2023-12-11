import React, { useState } from "react";
import "./AccTable.scss";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import AccPopup from "../AccountPopup/AccPopup";
import AccUpdatePopup from "../AccountPopup/AccUpdatePopup";
import { useDispatch, useSelector } from "react-redux";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { deleteAccountAction } from "../../../store/actions/accountAction";
import useAxios from "../../../utils/useAxios";

const AccTable = (props) => {
  const api = useAxios();
  const listAccounts = props.listAccounts;
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isOpenPopup, setOpenPopup] = useState(false);
  const currentUser = useSelector((state) => state.auth?.currentUser);

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

  function handleDeleteUser(user) {
    let notification = "Are you sure you want to delete?";
    if (window.confirm(notification) === true) {
      props.handleChangeCurrentPage();
      dispatch(
        deleteAccountAction(
          user.user_id,
          { key_word: props.keyWord, page_number: 1 },
          api
        )
      );
    } else {
      return;
    }
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
                      {user.user_id !== currentUser.user_id && (
                        <div>
                          <AiFillEdit
                            className="btn"
                            onClick={() => handleEditClick(user)}
                          />
                          <AiFillDelete
                            className="btn"
                            onClick={() => handleDeleteUser(user)}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
        </tbody>
      </table>
      {isOpenPopup && <AccPopup changePopup={changePopup} />}
      {selectedRecord && (
        <AccUpdatePopup record={selectedRecord} onClose={handleFormClose} />
      )}
    </div>
  );
};

export default AccTable;
