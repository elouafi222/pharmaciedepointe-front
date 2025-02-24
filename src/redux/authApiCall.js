import axios from "axios";
import toast from "react-hot-toast";
import { authActions } from "./authSlice";
export function loginUser(user) {
  return async (dispatch) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        user
      );
      dispatch(authActions.login(data));
      localStorage.setItem("pharmacie_de_la_ponite", JSON.stringify(data));
    } catch (error) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  };
}

export function logoutUser() {
  return (dispatch) => {
    dispatch(authActions.logout());
    localStorage.removeItem("pharmacie_de_la_ponite");
  };
}
