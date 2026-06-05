import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "../services/axios";

// CREATE CONTEXT
const AuthContext = createContext();

// CUSTOM HOOK
export const useAuth = () =>
  useContext(AuthContext);

// PROVIDER
export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(
      localStorage.getItem("token") ||
        null
    );

  const [loading, setLoading] =
    useState(true);

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    setUser(null);

    setToken(null);

    localStorage.removeItem(
      "token"
    );
  };

  // =========================
  // GET PROFILE
  // =========================

  const getProfile = async () => {
    try {
      const res = await axios.get(
        "/auth/profile"
      );

      setUser(res.data.user);
    } catch (error) {
      console.log(error);

      logout();
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const updateProfile = async (
  formData
) => {
  const res = await axios.put(
    "/auth/update-profile",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  setUser(res.data.user);

  return res.data;
};

  // =========================
  // LOAD USER ON REFRESH
  // =========================

  useEffect(() => {
    if (token && !user) {
      getProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  // =========================
  // REGISTER
  // =========================

  const register = async (
    data
  ) => {
    const res = await axios.post(
      "/auth/register",
      data
    );

    setToken(res.data.token);

    localStorage.setItem(
      "token",
      res.data.token
    );

    setUser(res.data.user);
  };

  // =========================
  // LOGIN
  // =========================

  const login = async (data) => {
    const res = await axios.post(
      "/auth/login",
      data
    );

    setToken(res.data.token);

    localStorage.setItem(
      "token",
      res.data.token
    );

    setUser(res.data.user);

    return res.data.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        getProfile,
        updateProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;