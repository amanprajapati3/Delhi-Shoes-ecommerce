import { Link, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { BsCartPlus } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loaders";

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { cart, addToCart, removeFromCart } = useCart();

  // PRODUCTS
  const products = wishlist?.products || [];

  // =========================
  // HANDLE CART
  // =========================
  const handleCart = async (e, product) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      navigate("/auth");
      return;
    }

    try {
      // CHECK CART ITEM
      const cartItem = cart?.items?.find((item) => {
        return (
          item?.product?._id === product?._id || item?.product === product?._id
        );
      });

      const alreadyInCart = !!cartItem;

      // =========================
      // REMOVE FROM CART
      // =========================
      if (alreadyInCart) {
        await removeFromCart(cartItem._id);

        toast.success("Removed from cart");
      }

      // =========================
      // ADD TO CART
      // =========================
      else {
        // CHECK VARIANTS
        const variants = product?.variants || [];

        // FIRST AVAILABLE VARIANT
        const firstVariant = variants.find((variant) => variant?.stock > 0);

        // OUT OF STOCK
        if (!firstVariant) {
          toast.error("Product is out of stock");

          return;
        }

        await addToCart(product._id, firstVariant._id, 1);

        toast.success("Added to cart");
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Cart action failed");
    }
  };

  // =========================
  // REMOVE WISHLIST
  // =========================

  const handleRemoveWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);

      toast.success("Removed from wishlist");
    } catch (error) {
      console.log(error);

      toast.error("Failed to remove");
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) return <Loader />;

  return (
    <div className="px-4 md:px-10 lg:px-16 py-8 min-h-screen bg-white">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>

        <p className="text-gray-500 mt-2 text-sm">
          {products.length} Product
          {products.length !== 1 && "s"} saved
        </p>
      </div>

      {/* EMPTY */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-gray-300 rounded-3xl">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <FaHeart className="text-red-500 text-3xl" />
          </div>

          <h2 className="text-2xl font-semibold mt-6 text-gray-800">
            Your wishlist is empty
          </h2>

          <p className="text-gray-500 mt-2 text-center max-w-md">
            Save your favorite products here and shop them later anytime.
          </p>

          <Link
            to="/shop"
            className="mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
          {products.filter((item) => item?.product).map((item) => {
              const product = item.product;
              // CHECK CART
              const cartItem = cart?.items?.find((cartItem) => {
                return (
                  cartItem?.product?._id === product?._id ||
                  cartItem?.product === product?._id
                );
              });

              const alreadyInCart = !!cartItem;

              return (
                <div
                  key={product._id}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    {/* REMOVE */}
                    <button
                      onClick={() => handleRemoveWishlist(product._id)}
                      className="absolute cursor-pointer top-3 right-3 z-20 bg-red-500 text-white p-2 rounded-full shadow hover:scale-110 transition-all duration-300"
                    >
                      <FaHeart size={14} />
                    </button>

                    {/* PRODUCT IMAGE */}
                    <Link to={`/product/${product._id}`}>
                      <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
                        {/* IMAGE 1 */}
                        <img
                          src={product?.images?.[0]?.url}
                          alt={product?.title}
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                        />

                        {/* IMAGE 2 */}
                        <img
                          src={
                            product?.images?.[1]?.url ||
                            product?.images?.[0]?.url
                          }
                          alt={product?.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      </div>
                    </Link>

                    {/* CART BUTTON */}
                    <button
                      onClick={(e) => handleCart(e, product)}
                      className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg text-sm cursor-pointer active:scale-110 font-medium

                    ${
                      alreadyInCart
                        ? "bg-red-500 text-white opacity-100 translate-y-0"
                        : "bg-black text-white translate-y-20 opacity-0 group-hover:translate-y-0  group-hover:opacity-100"
                    }
                    `}
                    >
                      <BsCartPlus size={18} />

                      {alreadyInCart ? "Remove From Cart" : "Add To Cart"}
                    </button>
                  </div>

                  {/* INFO */}
                  <div className="p-4">
                    {/* CATEGORY */}
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                      {product?.category}
                    </p>

                    {/* TITLE */}
                    <Link to={`/product/${product._id}`}>
                      <h2 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 hover:text-black transition-colors">
                        {product?.title}
                      </h2>
                    </Link>

                    {/* PRICE */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-lg font-bold text-black">
                        ₹{product?.price}
                      </span>

                      {product?.comparePrice > product?.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product?.comparePrice}
                        </span>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="mt-4">
                      <Link
                        to={`/product/${product._id}`}
                        className="block w-full border border-black text-black text-sm text-center py-2 rounded-lg hover:bg-black hover:text-white transition-all duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* BADGES */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
                    {product?.newArrival && (
                      <span className="bg-black text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wide">
                        New
                      </span>
                    )}

                    {product?.bestSeller && (
                      <span className="bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wide">
                        Bestseller
                      </span>
                    )}

                    {product?.featured && (
                      <span className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wide">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
