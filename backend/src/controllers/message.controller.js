import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js"

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);

  } catch (error) {
    console.error("Error getting contacts: ", error);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    });

    res.status(200).json(messages);

  } catch (error) {
    console.error("Error getting messages by id: ", error);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    await newMessage.save();

    res.status(201).json(newMessage);

  } catch (error) {
    console.error("Error sending message: ", error);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    });

    const chatPartnerIds = [...new Set(messages.map(msg => msg.senderId.toString() === loggedInUserId ? msg.receiverId.toString() : msg.senderId.toString()))];

    const chatPartners = await User.find({
      _id: {
        $in: chatPartnerIds
      }
    }).select("-password");

    res.status(200).json(chatPartners);

  } catch (error) {
    console.error("Error getting chat partners: ", error);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}