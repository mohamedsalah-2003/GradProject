export type AlertType = "Critical" | "Warning";

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  type: AlertType;
  time: string;
  unread?: boolean;
  deviceName?: string;
  location?: string;
  homeName?: string;
  anomalyType?: string;
  isResolved?: boolean;
}