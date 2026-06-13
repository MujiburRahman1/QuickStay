import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/User.js";

const syncUserFromClerk = async (userId) => {
  const clerkUser = await clerkClient.users.getUser(userId);
  const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
  const username =
    `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
    clerkUser.username ||
    email.split("@")[0] ||
    "User";

  return User.create({
    _id: userId,
    email,
    username,
    image: clerkUser.imageUrl || "",
    recentSearchedCities: [],
  });
};

export const protect = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.json({ success: false, message: "not authenticated" });
    }

    let user = await User.findById(userId);

    if (!user) {
      try {
        user = await syncUserFromClerk(userId);
      } catch (error) {
        if (error.code === 11000) {
          user = await User.findById(userId);
        } else {
          console.error("Failed to sync user from Clerk:", error.message);
          return res.json({
            success: false,
            message: "Could not load user profile. Please try signing in again.",
          });
        }
      }
    }

    req.user = user;
    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};