import { AlertItem } from "../app/Types/alert";
import { SocketAlertPayload } from "../app/Types/SocketAlertPayload";


export const mapSocketAlertToItem = (
  data: SocketAlertPayload
): AlertItem | null => {
  if (!data?.alert || !data?.anomaly) return null;

  return {
    id: data.alert._id,
    title: data.anomaly.anomalyType,
    description: data.alert.message,
    type:
      data.anomaly.severity === "high"
        ? "Critical"
        : data.anomaly.severity === "medium"
        ? "Warning"
        : "Info",
    time: data.alert.createdAt,
    unread: true,
  };
};