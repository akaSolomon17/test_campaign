// import React, { useState } from "react";

// import useTable from "../../../store/useTable";
// import Footer from "../../Footer/Footer";

// const DashboardTable = (props) => {
//   const [page, setPage] = useState(1);

//   const rowsPerPage = 5;

//   const { pageData: slice, pages: range } = useTable(
//     props.data || [],
//     page,
//     rowsPerPage
//   );

//   function renderTable() {
//     return slice.map((campaign) => {
//       return (
//         <tr key={campaign.campaign_id}>
//           <td>{campaign.name}</td>
//           <td>
//             {/* {
//               <td>
//                 {campaign.status === 1 ? (
//                   <FontAwesomeIcon
//                     icon="fa-duotone fa-circle"
//                     style={{
//                       "--fa-primary-color": "#03c200",
//                       "--fa-secondary-color": "#03c200",
//                     }}
//                   />
//                 ) : (
//                   <FontAwesomeIcon
//                     icon="fa-duotone fa-circle"
//                     style={{
//                       "--fa-primary-color": "#f00000",
//                       "--fa-secondary-color": "#e60000",
//                     }}
//                   />
//                 )}
//                 {
//                   <FontAwesomeIcon
//                     icon="fa-duotone fa-circle"
//                     style={{
//                       "--fa-primary-color": "#03c200",
//                       "--fa-secondary-color": "#03c200",
//                     }}
//                   />
//                 }
//               </td>
//             } */}
//           </td>
//           <td>{campaign.email}</td>
//           <td>{campaign.address}</td>
//           <td>{campaign.phone}</td>
//           <td>{campaign.role_id}</td>
//         </tr>
//       );
//     });
//   }

//   return (
//     <div className="camp-table-data">
//       <table>
//         <thead>
//           <tr>
//             <th>Campaign Name</th>
//             <th>Status</th>
//             <th>Used Amount</th>
//             <th>Usage Rate</th>
//             <th>Budget</th>
//             <th>Start date</th>
//             <th>End date</th>
//           </tr>
//         </thead>
//         <tbody>{renderTable()}</tbody>
//       </table>
//       <Footer range={range} slice={slice} setPage={setPage} page={page} />
//     </div>
//   );
// };

// export default DashboardTable;
import React, { useState } from "react";
import Footer from "../../Footer/Footer";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const DashboardTable = (props) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const slice = props.data || [];
  const slice_data = slice.slice(startIndex, endIndex);

  function renderTable() {
    return slice_data.map((campaign) => (
      <tr key={campaign.campaign_id}>
        // <td>{campaign.name}</td>
        //{" "}
        <td>
          //{" "}
          {/* {
//               <td>
//                 {campaign.status === 1 ? (
//                   <FontAwesomeIcon
//                     icon="fa-duotone fa-circle"
//                     style={{
//                       "--fa-primary-color": "#03c200",
//                       "--fa-secondary-color": "#03c200",
//                     }}
//                   />
//                 ) : (
//                   <FontAwesomeIcon
//                     icon="fa-duotone fa-circle"
//                     style={{
//                       "--fa-primary-color": "#f00000",
//                       "--fa-secondary-color": "#e60000",
//                     }}
//                   />
//                 )}
//                 {
//                   <FontAwesomeIcon
//                     icon="fa-duotone fa-circle"
//                     style={{
//                       "--fa-primary-color": "#03c200",
//                       "--fa-secondary-color": "#03c200",
//                     }}
//                   />
//                 }
//               </td>
//             } */}
          //{" "}
        </td>
        // <td>{campaign.email}</td>
        // <td>{campaign.address}</td>
        // <td>{campaign.phone}</td>
        // <td>{campaign.role_id}</td>
        //{" "}
      </tr>
    ));
  }

  const handleChangePage = (event, value) => {
    setPage(value);
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
    </div>
  );
};

export default DashboardTable;
