export type SocketAlertPayload = {
  alert: {
    _id: string;
    message: string;
    createdAt: string;
  };

  anomaly: {
    anomalyType: string;
    severity: "high" | "medium" | "low";
  };
};