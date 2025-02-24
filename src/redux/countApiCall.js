import axios from "axios";
import { countActions } from "./countSlice";

export function getCount() {
  return async (dispatch, getState) => {
    try {
      dispatch(countActions.setLoading());
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/ordonnance/getCount`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        }
      );
      // console.log(data)cycleEnRetard
      dispatch(countActions.setCountMessages(data.messages));
      dispatch(countActions.setCountEnAttent(data.enAttent));
      dispatch(countActions.setCountCycleEnAttent(data.cycleEnRetard));
      dispatch(countActions.setCountDuJour(data.dujour));
      dispatch(countActions.setTerminerToday(data.terminerToday));
    } catch (error) {
      console.error("Failed to fetch counts:", error);
    } finally {
      dispatch(countActions.clearLoading());
    }
  };
}
