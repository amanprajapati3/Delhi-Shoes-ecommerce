import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "../services/axios";

// Create Context
const WishlistContext = createContext();

// Custom Hook
export const useWishlist = () =>
  useContext(WishlistContext);

// Provider
export const WishlistProvider = ({
  children,
}) => {

  const [wishlist, setWishlist] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  // GET WISHLIST
  const getWishlist = async () => {
    try {
      setLoading(true);

      const res =
        await axios.get(
          "/wishlist"
        );

      setWishlist(
        res.data.wishlist
      );

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ADD TO WISHLIST
  const addToWishlist =
    async (productId) => {
      try {
        const res =
          await axios.post(
            "/wishlist/add",
            { productId }
          );

        setWishlist(
          res.data.wishlist
        );

      } catch (error) {
        console.log(error);
      }
    };

  // REMOVE FROM WISHLIST
  const removeFromWishlist =
    async (productId) => {
      try {
        const res =
          await axios.delete(
            `/wishlist/remove/${productId}`
          );

        setWishlist(
          res.data.wishlist
        );

      } catch (error) {
        console.log(error);
      }
    };

  // OPTIONAL: CHECK IF PRODUCT EXISTS
  const isInWishlist = (
    productId
  ) => {
    return wishlist?.products?.some(
      (item) =>
        item.product === productId ||
        item.product?._id === productId
    );
  };

  // Load wishlist on start
  useEffect(() => {
    getWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        getWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;