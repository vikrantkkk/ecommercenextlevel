const Address = require("../models/address.model");
const User = require("../models/user.model");

exports.createAdress = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).populate("addresses");
    const { street, city, state, country, postalCode, type, isDefault } =
      req.body;

    if (!(street && city && state && country && postalCode && type)) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (user.addresses.length >= 5) {
      return res
        .status(400)
        .json({ message: "You can only add up to 5 addresses" });
    }

    if (isDefault) {
      await Address.updateMany(
        { user: id, isDefault: true },
        { isDefault: false }
      );
    }

    const newAddress = await Address.create({
      user: id,
      street,
      city,
      state,
      country,
      postalCode,
      type,
      isDefault,
    });
    user.addresses.push(newAddress._id);
    await user.save();
    return res
      .status(201)
      .json({ message: "Address created successfully", data: newAddress });
  } catch (error) {
    console.log(error);
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).populate("addresses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User addresses", data: user.addresses });
  } catch (error) {
    console.log(error);
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.user;

    const { street, city, state, country, postalCode, type, isDefault } =
      req.body;

    const { addressId } = req.params;

    const address = await Address.findOne({ user: id, _id: addressId });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (isDefault) {
      await Address.updateMany(
        { user: id, isDefault: true },
        { isDefault: false }
      );
    }

    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.postalCode = postalCode || address.postalCode;
    address.type = type || address.type;
    address.country = country || address.country;
    address.isDefault = isDefault;

    const updatedAddress = await address.save();
    res
      .status(200)
      .json({ message: "Address updated successfully", data: updatedAddress });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { id } = req.user;
    const address = await Address.findOneAndDelete({
      user: id,
      _id: addressId,
    });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};
