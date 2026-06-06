import axios from "axios";

const instance = axios.create({
  baseURL: "https://delhi-shoes-ecommerce.onrender.com/api",
  withCredentials: false,
});

// REQUEST INTERCEPTOR (Attach Token)
instance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers[
        "Authorization"
      ] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR (Handle Errors)
instance.interceptors.response.use(
  (response) => response,
  (error) => {

    // Token expired / invalid
    if (
      error.response &&
      error.response.status === 401
    ) {
      localStorage.removeItem("token");

      // optional redirect
      if (
         error.response &&
         error.response.status === 401
         ) { 
         localStorage.removeItem("token");
          }
    }

    return Promise.reject(error);
  }
);

export default instance;
