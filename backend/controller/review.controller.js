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

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { id } = req.user;
    const review = await Review.findOne({ _id: reviewId, user: id });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    await review.remove();
    const product = await Product.findById(review.product);
    if (product) {
      const newRatingCount = product.ratings.count--;
      const newAverageRating =
        newRatingCount === 0
          ? 0
          : (product.ratings.average * product.ratings.count - review.rating) /
            newRatingCount;

      product.ratings.count = newRatingCount;
      product.ratings.average = newAverageRating;
      await product.save();
    }
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllProductreview = async (req, res) => {
  try {
    const { id } = req.user;
    const review = await Product.findById(id).populate("reviews");
    if (!review) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({
      message: "All product reviews fetched successfully",
      data: review,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getSingleReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId).populate("user", "name");
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    return res.status(200).json({
      message: "Review details",
      data: review,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.markReviewAsHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    review.helpfulCount += 1;
    await review.save();
    return res
      .status(200)
      .json({ message: "Review marked as helpful", data: review });
  } catch (error) {
    console.log(error);
  }
};

exports.addReplyToReview = async (req, res) => {
  try {
    const { comment } = req.body;
    const { reviewId } = req.params;
    const { id } = req.user;
    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    const newReply = {
      user: id,
      comment,
      createdAt: new Date(),
    };
    review.replies.push(newReply);
    await review.save();
    return res
      .status(201)
      .json({ message: "Reply added successfully", data: review });
  } catch (error) {
    console.log(error);
  }
};

exports.removeReplyReview = async (req, res) => {
  try {
    const { replyId, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    const replyIndex = review.replies.findIndex(
      (reply) => reply._id.toString() === replyId
    );

    if (replyIndex === -1) {
      return res.status(404).json({ message: "Reply not found" });
    }
    review.replies.splice(replyIndex, 1);
    await review.save();
    return res.status(200).json({ message: "Reply removed successfully" });
  } catch (error) {
    console.log(error);
  }
};
