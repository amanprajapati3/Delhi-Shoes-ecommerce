import React, {
  useEffect,
  useState,
} from "react";

import {
  FaStar,
  FaRegStar,
  FaTrash,
  FaImage,
} from "react-icons/fa";
import axios from "../services/Axios";

import { toast } from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

const Review = ({ productId }) => {
  const { user } = useAuth();

  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [images, setImages] =
    useState([]);

  // =========================
  // GET REVIEWS
  // =========================

const fetchReviews = async () => {
  try {
    setLoading(true);

    const { data } = await axios.get(
      `/reviews/${productId}`
    );

    setReviews(data?.reviews || []);
  } catch (error) {
    console.log(error);

    setReviews([]);

    toast.error(
      "Failed to load reviews"
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  // =========================
  // IMAGE CHANGE
  // =========================

  const handleImageChange = (e) => {
    setImages(
      Array.from(e.target.files)
    );
  };

  // =========================
  // ADD REVIEW
  // =========================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!user) {
      toast.error(
        "Please login first"
      );
      return;
    }

    if (!comment.trim()) {
      toast.error(
        "Please write review"
      );
      return;
    }

    try {
      setSubmitting(true);

      const formData =
        new FormData();

      formData.append(
        "productId",
        productId
      );

      formData.append(
        "rating",
        rating
      );

      formData.append(
        "comment",
        comment
      );

      images.forEach((img) => {
        formData.append(
          "images",
          img
        );
      });

      const { data } =
        await axios.post(
          "/reviews/add",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },

            withCredentials: true,
          }
        );

      toast.success(data.message);

      setComment("");
      setRating(5);
      setImages([]);

      fetchReviews();
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Review failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // DELETE REVIEW
  // =========================

  const handleDelete =
    async (id) => {
      try {
        const { data } =
          await axios.delete(
            `/reviews/delete/${id}`,
            {
              withCredentials: true,
            }
          );

        toast.success(
          data.message
        );

        fetchReviews();
      } catch (error) {
        console.log(error);

        toast.error(
          error?.response?.data
            ?.message ||
            "Delete failed"
        );
      }
    };

  return (
    <div className="mt-24 mx-2 md:mx-20">
      {/* HEADING */}

      <div className="mb-10">
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#a07840] mb-2">
          Customer Feedback
        </p>

        <h2 className="text-3xl md:text-5xl font-semibold text-[#1a1a1a]">
          Reviews
        </h2>
      </div>

      {/* REVIEW FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-[#faf8f5] border border-[#ece8e1] rounded-3xl p-6 md:p-8 mb-12"
      >
        {/* STARS */}

        <div className="flex gap-2 mb-5">
          {[1, 2, 3, 4, 5].map(
            (star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setRating(star)
                }
              >
                {star <= rating ? (
                  <FaStar
                    className="text-yellow-400"
                    size={22}
                  />
                ) : (
                  <FaRegStar
                    className="text-gray-300"
                    size={22}
                  />
                )}
              </button>
            )
          )}
        </div>

        {/* TEXTAREA */}

        <textarea
          rows={5}
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
          placeholder="Write your review..."
          className="w-full rounded-2xl border border-gray-200 bg-white p-4 outline-none resize-none text-sm mb-5 focus:border-black transition"
        />

        {/* IMAGE INPUT */}

        <label className="inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer mb-5">
          <FaImage />

          Upload Images

          <input
            type="file"
            hidden
            multiple
            onChange={
              handleImageChange
            }
          />
        </label>

        {/* IMAGE PREVIEW */}

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-5">
            {images.map(
              (img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(
                    img
                  )}
                  alt=""
                  className="w-20 h-20 object-cover rounded-xl"
                />
              )
            )}
          </div>
        )}

        {/* BUTTON */}

        <button
          type="submit"
          disabled={submitting}
          className="bg-black md:ml-5 text-white px-7 py-3 rounded-xl uppercase tracking-[0.12em] text-xs hover:opacity-90 transition"
        >
          {submitting
            ? "Submitting..."
            : "Submit Review"}
        </button>
      </form>

      {/* REVIEWS */}

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews?.length === 0 ? (
        <div className="bg-[#faf8f5] rounded-3xl p-10 text-center text-gray-500">
          No reviews yet
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews?.map(
            (review) => (
              <div
                key={review._id}
                className="border border-[#ece8e1] rounded-3xl p-6 bg-white"
              >
                {/* TOP */}

                <div className="flex justify-between gap-4 mb-5">
                  <div className="flex gap-4">
                    <img
                      src={
                        review.userProfileImage ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>
                      <h4 className="font-semibold text-[#1a1a1a]">
                        {
                          review.userName
                        }
                      </h4>

                      <div className="flex gap-1 mt-1">
                        {[
                          ...Array(
                            review.rating
                          ),
                        ].map(
                          (
                            _,
                            i
                          ) => (
                            <FaStar
                              key={
                                i
                              }
                              className="text-yellow-400"
                              size={
                                14
                              }
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DELETE */}

                  {(user?._id ===
                    review.user ||
                    user?.role ===
                      "admin") && (
                    <button
                      onClick={() =>
                        handleDelete(
                          review._id
                        )
                      }
                      className="text-red-500 hover:scale-110 transition"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>

                {/* COMMENT */}

                <p className="text-gray-600 leading-7 mb-5 text-sm md:text-[15px]">
                  {
                    review.comment
                  }
                </p>

                {/* IMAGES */}

                {review.images
                  ?.length >
                  0 && (
                  <div className="flex flex-wrap gap-3">
                    {review.images.map(
                      (
                        img,
                        index
                      ) => (
                        <img
                          key={
                            index
                          }
                          src={
                            img.url
                          }
                          alt=""
                          className="w-24 h-24 object-cover rounded-2xl"
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Review;