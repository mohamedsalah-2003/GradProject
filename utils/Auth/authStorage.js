import { storage } from "./../storage";

export const updateStoredUnreadAlerts = async (count) => {
  const storedUser = await storage.get("user");

  if (!storedUser) return;

  const parsedUser = JSON.parse(storedUser);

  parsedUser.unreadAlerts = count;

  await storage.set("user", JSON.stringify(parsedUser));
};