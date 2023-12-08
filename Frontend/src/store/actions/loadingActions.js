import { TURN_ON_LOADING, TURN_OFF_LOADING } from "../types/loadingType";

export const turnOnLoading = () => {
  return {
    type: TURN_ON_LOADING,
  };
};

export const turnOffLoading = () => {
  return {
    type: TURN_OFF_LOADING,
  };
};
