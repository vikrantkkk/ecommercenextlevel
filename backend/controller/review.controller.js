const Review = require("../models/review.model");
const Product = require("../models/product.model");
const uploadOnCloudinary = require("../utils/cloudinaryConfig");

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const { id } = req.user;
    if (!(productId && rating)) {
      return res
        .status(400)
        .json({ message: "Product and rating are required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = await Review.findOne({
      user: id,
      product: productId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product." });
    }

    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
      return res.status(400).json({ message: "Image file is missing" });
    }

    const images = await uploadOnCloudinary(imageLocalPath);

    if (!images.url) {
      return res
        .status(400)
        .json({ message: "Error while uploading on image" });
    }
    const review = await Review.create({
      user: id,
      product: productId,
      rating,
      comment,
      images: images.url,
    });

    // Add the review to the product's reviews array
    product.reviews.push(review._id);

    if (product) {
      const newRatingCount = Product.rating.count + 1;
      const newAverageRating =
        (product.ratings.average * product.ratings.count + rating) /
        newRatingCount;

      product.ratings.average = newAverageRating;
      product.ratings.count = newRatingCount;
      await product.save();
    }
    return res
      .status(201)
      .json({ message: "Review created successfully", data: review });
  } catch (error) {
    console.log(error);
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { reviewId } = req.params;
    const { id } = req.user;
    const review = await Review.findOne({ _id: reviewId, user: id });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (rating === undefined) review.rating = rating;
    if (comment) review.comment = comment;

    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
      return res.status(400).json({ message: "Image file is missing" });
    }

    const images = await uploadOnCloudinary(imageLocalPath);

    if (!images.url) {
      return res
        .status(400)
        .json({ message: "Error while uploading on image" });
    }
    if (imageLocalPath) review.images = images.url;
    await review.save();
    //update the product rating and count
    const product = await Product.findById(review.product);
    if (product) {
      const newAverageRating =
        (product.ratings.average * product.ratings.count -
          review.rating +
          rating) /
        product.ratings.count;

      product.ratings.average = newAverageRating;
      await product.save();
    }
    return res
      .status(200)
      .json({ message: "Review updated successfully", data: review });
  } catch (error) {
    console.log(error);
  }
};
