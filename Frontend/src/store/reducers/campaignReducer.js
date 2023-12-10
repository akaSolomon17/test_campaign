import {
  FETCH_CAMPAIGN_START,
  FETCH_CAMPAIGN_SUCCESS,
  FETCH_CAMPAIGN_FAILED,
} from "../types/campaignType";

const initialState = {
  listCampaigns: [],
  totalRecords: 0,
  isLoading: false,
};

const campaignReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CAMPAIGN_START:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_CAMPAIGN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listCampaigns: action.payload.campaign_list,
        totalRecords: action.payload.total_records,
      };
    case FETCH_CAMPAIGN_FAILED:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};
export default campaignReducer;
