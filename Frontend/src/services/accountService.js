export const accountServices = {
  fetchListAccount: (initInfo, api) => {
    let res = api.get(
      `/api/all_user_info?key_word=${initInfo.key_word}&page_number=${initInfo.page_number}`
    );
    return res;
  },
  createAccount: (formData, api) => {
    let res = api.post(`/api/add_user`, formData);
    return res;
  },
  deleteAccount: (accountId, api) => {
    let res = api.post(`/api/delete_user`, { user_id: accountId });
    return res;
  },
  updateAccount: (dataAcc, api) => {
    let res = api.put(`/api/update_user`, { dataAcc });
    return res;
  },
};
