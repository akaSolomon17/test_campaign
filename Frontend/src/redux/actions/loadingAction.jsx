import ACTIONS from "./index";

export const turnOnLoading = () => {
  return {
    type: ACTIONS.TURN_ON_LOADING,
  };
};

export const turnOffLoading = () => {
  return {
    type: ACTIONS.TURN_OFF_LOADING,
  };
};
