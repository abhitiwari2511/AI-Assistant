import { User } from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";
import uploadFile from "../utils/fileUpload";

const updateAssistant = asyncHandler(async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    if (!assistantName) {
      return res.status(400).json({ message: "assistantName is required" });
    }
    let assistantImage;
    if (req.file) {
      const uploadResult = await uploadFile(req.file.path);
      assistantImage = uploadResult?.secure_url || uploadResult?.url;
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      (req as any).user._id,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      message: "update assistant error",
    });
  }
});

export default updateAssistant;
