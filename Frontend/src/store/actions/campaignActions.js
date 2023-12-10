import { campaignServices } from "../../services/campaignService";
import { toast } from "react-toastify";
import {
  FETCH_CAMPAIGN_SUCCESS,
  CREATE_CAMPAIGN_SUCCESS,
  DELETE_CAMPAIGN_SUCCESS,
  UPDATE_CAMPAIGN_SUCCESS,
} from "../types/campaignType";
import { turnOffLoading, turnOnLoading } from "./loadingActions";

//fetch list Campaign Action
export const fetchListCampaignAction = (initInfo, api) => {
  return async (dispatch) => {
    try {
      dispatch(turnOnLoading());
      const res = await campaignServices.fetchListCampaign(initInfo, api);
      dispatch(turnOffLoading());
      if (res.status === 200) {
        dispatch(fetchListCampaignSuccess(res.data.campaign_list));
      } else {
        dispatch(turnOffLoading());
      }
    } catch (e) {
      console.log(e);
      dispatch(turnOffLoading());
    }
  };
};

export const fetchListCampaignSuccess = (payload) => {
  return {
    type: FETCH_CAMPAIGN_SUCCESS,
    payload,
  };
};

// create Campaign Action
export const createCampaignAction = (formData, api) => {
  return async (dispatch) => {
    try {
      dispatch(turnOnLoading());
      const res = await campaignServices.createCampaign(formData, api);
      dispatch(turnOffLoading());
      if (res.status === 200) {
        dispatch(fetchListCampaignAction(api));
        toast.success("Create Campaign Successfully!");
      } else {
        dispatch(turnOffLoading());
      }
    } catch (e) {
      console.log(e);
      dispatch(turnOffLoading());
    }
  };
};

export const createCampaignSuccess = (payload) => {
  return {
    type: CREATE_CAMPAIGN_SUCCESS,
    payload,
  };
};

// delete Campaign Action
export const deleteCampaignAction = (campaignId, api) => {
  return async (dispatch) => {
    try {
      dispatch(turnOnLoading());
      const res = await campaignServices.deleteCampaign(campaignId, api);
      dispatch(turnOffLoading());
      if (res.status === 200) {
        dispatch(fetchListCampaignAction(api));
        toast.success("Delete Campaign Successfully!");
      } else {
        dispatch(turnOffLoading());
      }
    } catch (e) {
      console.log(e);
      dispatch(turnOffLoading());
    }
  };
};

export const deleteCampaignSuccess = (payload) => {
  return {
    type: DELETE_CAMPAIGN_SUCCESS,
    payload,
  };
};

// update Campaign Action
export const updateCampaignAction = (campaignId, dataCamp, api) => {
  return async (dispatch) => {
    try {
      dispatch(turnOnLoading());
      const res = await campaignServices.updateCampaign(
        campaignId,
        dataCamp,
        api
      );
      dispatch(turnOffLoading());
      if (res.status === 200) {
        dispatch(fetchListCampaignAction(api));
        toast.success("Update Campaign Successfully!");
      } else {
        dispatch(turnOffLoading());
      }
    } catch (e) {
      console.log(e);
      dispatch(turnOffLoading());
    }
  };
};

export const updateCampaignSuccess = (payload) => {
  return {
    type: UPDATE_CAMPAIGN_SUCCESS,
    payload,
  };
};
