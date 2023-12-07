export const campaignServices = {
  fetchListCampaign: (api) => {
    let res = api.get(`/api/all_campaign`);
    return res;
  },
  createCampaign: (formData, api) => {
    let res = api.post(`/api/add_campaign`, formData);
    return res;
  },
  deleteCampaign: (campaignId, api) => {
    let res = api.delete(`/api/delete_campaign/${campaignId}`);
    return res;
  },
  updateCampaign: (campaignId, formData, api) => {
    let res = api.put(`/api/update_campaign/${campaignId}`, formData);
    return res;
  },
};
