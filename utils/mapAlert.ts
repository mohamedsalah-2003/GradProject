export function normalizeAlert(alert: any) {
  const severity = (alert?.severity || "").toLowerCase();

  const isCritical =
    severity === "critical" || severity === "high";

  return {
    id: alert._id,
    title: "Anomaly Detected",
    description: alert.message,
    type: isCritical ? "Critical" : "Warning",
    time: new Date(alert.createdAt).toISOString(),
    unread: alert.isRead === false,
    deviceName: alert.deviceId?.name ?? "Unknown",
    location: alert.deviceId?.location ?? alert.homeId?.name ?? "Unknown",
    homeName: alert.homeId?.name ?? "",
    anomalyType: alert.anomalyType ?? "Unknown",
    isResolved: alert.isResolved ?? false,
  };
}