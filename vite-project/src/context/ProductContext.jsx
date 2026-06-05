import { createContext, useContext, useEffect, useState } from "react";

import axios from "../services/axios";

// Create Context
const ProductContext = createContext();

// Custom Hook
export const useProduct = () => useContext(ProductContext);

// Provider
export const ProductProvider = ({ children }) => {  
  const [products, setProducts] = useState([]);

  const [singleProduct, setSingleProduct] = useState(null);

  const [loading, setLoading] = useState(false);

  // GET ALL PRODUCTS
  const getAllProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/products/all");
      console.log(res.data);

      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // GET SINGLE PRODUCT
  const getSingleProduct = async (id) => {
    try {
      setLoading(true);

      const res = await axios.get(`/products/${id}`);

      setSingleProduct(res.data.product);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        singleProduct,
        loading,
        getAllProducts,
        getSingleProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
