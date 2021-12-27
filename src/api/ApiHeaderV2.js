// TODO: Check for all possible error codes
import axios from "axios";
import store from "@/store";

var axiosInstance = axios.create({
  baseURL: `${process.env.VUE_APP_API_ADMIN}`,
  timeout: 15000
});

axiosInstance.interceptors.request.use(
  config => {
    const token = "Bearer " + store.state.ActiveSession.access_token;
    config.headers.Authorization = token;
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(undefined, err => {
  let res = err.response;
  console.log(res);
  if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
    return new Promise((resolve, reject) => {
      store
        .dispatch("ActiveSession/refreshToken")
        .then(() => {
          err.config.__isRetryRequest = true;
          err.config.headers.Authorization =
            "Bearer " + store.state.ActiveSession.access_token;
          resolve(axios(err.config));
        })
        .catch(error => {
          console.log("Refresh login error: ", error);
          reject(error);
        });
    });
  }
});

export default axiosInstance;
