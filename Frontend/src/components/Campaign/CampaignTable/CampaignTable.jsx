import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./CampaignTable.scss";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { FaCircleDot } from "react-icons/fa6";
import CreateCampaign from "../CreateCampaign/CreateCampaign";
import EditCampaign from "../CreateCampaign/EditCampaign";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { deleteCampaignAction } from "../../../store/actions/campaignActions";
import useAxios from "../../../utils/useAxios";

const CampaignTable = (props) => {
  const api = useAxios();
  const dispatch = useDispatch();
  const listCampaigns = props.listCampaigns;
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isOpenPopup, setOpenPopup] = useState(false);
  // const [page, setPage] = useState(1);

  const handleEditClick = (record) => {
    setSelectedRecord(record);
  };

  const handleFormClose = () => {
    setSelectedRecord(null);
  };

  const changePopup = () => {
    setOpenPopup(!isOpenPopup);
  };

  function handleDeleteUser(campaign) {
    dispatch(deleteCampaignAction(campaign.campaign_id, api));
  }

  // const handleChangePage = (event, value) => {
  //   setPage(value);
  // };

  // const rowsPerPage = 5;

  // const startIndex = (page - 1) * rowsPerPage;
  // const endIndex = startIndex + rowsPerPage;
  // const slice = props.data || [];
  // const slice_data = slice.slice(startIndex, endIndex);

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
        <tbody>
          {listCampaigns &&
            listCampaigns.map((campaign, index = campaign.campaign_id) => {
              return (
                <React.Fragment key={index}>
                  <tr>
                    <td>{campaign.name}</td>
                    <td>
                      <FaCircleDot
                        className="fa-duotone"
                        icon="fa-duotone fa-circle"
                        style={{
                          color: campaign.user_status ? "green" : "red",
                        }}
                      />
                    </td>
                    <td>{campaign.used_amount}</td>
                    <td>{campaign.usage_rate}</td>
                    <td>{campaign.budget}</td>
                    <td>{campaign.start_date}</td>
                    <td>{campaign.end_date}</td>
                    <td>
                      <AiFillEdit
                        className="btn"
                        onClick={() =>
                          handleEditClick({
                            ...campaign,
                            preview_img: campaign.creatives.preview_img,
                            user_id: campaign.user_id,
                          })
                        }
                      />
                      <AiFillDelete
                        className="btn"
                        onClick={() => handleDeleteUser(campaign)}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
        </tbody>
      </table>

      {/* <Stack spacing={2} className="pagination-container">
        <Pagination
          count={Math.ceil(props.data?.length / rowsPerPage)} // Total number of pages
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Stack> */}

      {isOpenPopup && <CreateCampaign changePopup={changePopup} />}
      {selectedRecord && (
        <EditCampaign record={selectedRecord} onClose={handleFormClose} />
      )}
    </div>
  );
};

export default CampaignTable;
