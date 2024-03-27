import { Subscription } from "../Models/subscription.model.js";
import { User } from "../Models/user.model.js";

const subscriptionController = async (req, res) => {
  try {
    // find user
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.send({
        success: false,
        message: "Invalid User Subscription Not Allow",
      });
    }
    const subscriber = new Subscription({
      subscriber: user?._id,
      channel: user?._id,
    });
    const saveSubscriber = await subscriber.save();
    res
      .status(200)
      .send({ success: true, message: "Subscription Successfully" });
  } catch (error) {
    res.send({ error: true, message: "Routes is not found" });
  }
};

export { subscriptionController };
