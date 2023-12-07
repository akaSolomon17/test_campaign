import { campaignServices } from "../../services/campaignService";
import {
  FETCH_CAMPAIGN_FAILED,
  FETCH_CAMPAIGN_SUCCESS,
  FETCH_CAMPAIGN_START,
  CREATE_CAMPAIGN_FAILED,
  CREATE_CAMPAIGN_SUCCESS,
  CREATE_CAMPAIGN_START,
  DELETE_CAMPAIGN_FAILED,
  DELETE_CAMPAIGN_START,
  DELETE_CAMPAIGN_SUCCESS,
  UPDATE_CAMPAIGN_FAILED,
  UPDATE_CAMPAIGN_START,
  UPDATE_CAMPAIGN_SUCCESS,
} from "../types/campaignType";

//fetch list Campaign Action
export const fetchListCampaignAction = (api) => {
  return async (dispatch) => {
    dispatch(fetchListCampaignStart());
    const res = await campaignServices.fetchListCampaign(api);
    try {
      if (res.status === 200) {
        dispatch(fetchListCampaignSuccess(res.data.campaigns));
      } else {
        dispatch(fetchListCampaignFailed());
      }
    } catch (e) {
      dispatch(fetchListCampaignFailed());
    }
  };
};
export const fetchListCampaignStart = () => {
  return {
    type: FETCH_CAMPAIGN_START,
  };
};
export const fetchListCampaignSuccess = (payload) => {
  return {
    type: FETCH_CAMPAIGN_SUCCESS,
    payload,
  };
};
export const fetchListCampaignFailed = () => {
  return {
    type: FETCH_CAMPAIGN_FAILED,
  };
};

// create Campaign Action
export const createCampaignAction = (formData, api) => {
  return async (dispatch) => {
    dispatch(createCampaignStart());
    try {
      const res = await campaignServices.createCampaign(formData, api);
      if (res.status === 200) {
        dispatch(fetchListCampaignAction(api));
      } else {
        dispatch(createCampaignFailed());
      }
    } catch (e) {
      dispatch(createCampaignFailed());
    }
  };
};
export const createCampaignStart = () => {
  return {
    type: CREATE_CAMPAIGN_START,
  };
};
export const createCampaignSuccess = (payload) => {
  return {
    type: CREATE_CAMPAIGN_SUCCESS,
    payload,
  };
};
export const createCampaignFailed = () => {
  return {
    type: CREATE_CAMPAIGN_FAILED,
  };
};

// delete Campaign Action
export const deleteCampaignAction = (campaignId, api) => {
  return async (dispatch) => {
    dispatch(deleteCampaignStart());
    try {
      const res = await campaignServices.deleteCampaign(campaignId, api);
      if (res.status === 200) {
        dispatch(fetchListCampaignAction(api));
      } else {
        dispatch(deleteCampaignFailed());
      }
    } catch (e) {
      dispatch(deleteCampaignFailed());
    }
  };
};
export const deleteCampaignStart = () => {
  return {
    type: DELETE_CAMPAIGN_START,
  };
};
export const deleteCampaignSuccess = (payload) => {
  return {
    type: DELETE_CAMPAIGN_SUCCESS,
    payload,
  };
};
export const deleteCampaignFailed = () => {
  return {
    type: DELETE_CAMPAIGN_FAILED,
  };
};

// update Campaign Action
export const updateCampaignAction = (campaignId, dataCamp, api) => {
  return async (dispatch) => {
    dispatch(updateCampaignStart());
    try {
      const res = await campaignServices.updateCampaign(
        campaignId,
        dataCamp,
        api
      );
      if (res.status === 200) {
        dispatch(fetchListCampaignAction(api));
      } else {
        dispatch(updateCampaignFailed());
      }
    } catch (e) {
      dispatch(updateCampaignFailed());
    }
  };
};
export const updateCampaignStart = () => {
  return {
    type: UPDATE_CAMPAIGN_START,
  };
};
export const updateCampaignSuccess = (payload) => {
  return {
    type: UPDATE_CAMPAIGN_SUCCESS,
    payload,
  };
};
export const updateCampaignFailed = () => {
  return {
    type: UPDATE_CAMPAIGN_FAILED,
  };
};
