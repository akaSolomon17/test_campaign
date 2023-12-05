import React, { useState } from "react";
import "./CampaignTable.scss";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import CreateCampaign from "../CreateCampaign/CreateCampaign";
import EditCampaign from "../CreateCampaign/EditCampaign";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Footer from "../../Footer/Footer";

const CampaignTable = (props) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isOpenPopup, setOpenPopup] = useState(false);
  const [page, setPage] = useState(1);

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

  const renderTable = () => {
    return slice_data.map((campaign) => (
      <tr key={campaign.campaign_id}>
        <td>{campaign.name}</td>
        <td>
          {/* {
              <td>
                {campaign.status === 1 ? (
                  <FontAwesomeIcon
                    icon="fa-duotone fa-circle"
                    style={{
                      "--fa-primary-color": "#03c200",
                      "--fa-secondary-color": "#03c200",
                    }}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon="fa-duotone fa-circle"
                    style={{
                      "--fa-primary-color": "#f00000",
                      "--fa-secondary-color": "#e60000",
                    }}
                  />
                )}
                {
                  <FontAwesomeIcon
                    icon="fa-duotone fa-circle"
                    style={{
                      "--fa-primary-color": "#03c200",
                      "--fa-secondary-color": "#03c200",
                    }}
                  />
                }
              </td>
            } */}
        </td>
        <td>{campaign.email}</td>
        <td>{campaign.address}</td>
        <td>{campaign.phone}</td>
        <td>{campaign.role_id}</td>
        <td>{campaign.action}</td>
        <td>
          <AiFillEdit
            className="btn"
            onClick={() => handleEditClick(campaign)}
          />
          <AiFillDelete className="btn" />
        </td>
      </tr>
    ));
  };

  return (
    <div className="camp-table-data">
      <table>
        <thead>
          <tr>
            <th>Campaign Name</th>
            <th>Status</th>
            <th>Used Amount</th>
            <th>Usage Rate</th>
            <th>Budget</th>
            <th>Start date</th>
            <th>End date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{renderTable()}</tbody>
      </table>

      <Stack spacing={2} className="pagination-container">
        <Pagination
          count={Math.ceil(props.data?.length / rowsPerPage)} // Total number of pages
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Stack>

      {isOpenPopup && <CreateCampaign changePopup={changePopup} />}
      {selectedRecord && (
        <EditCampaign record={selectedRecord} onClose={handleFormClose} />
      )}
    </div>
  );
};

export default CampaignTable;
