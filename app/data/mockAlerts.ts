import { AlertItem } from "./../Types/alert";

export const mockAlerts: AlertItem[] = [
  {
    id: "1",
    title: "Gas Leak Detected",
    description: "High gas concentration detected in Kitchen",
    type: "Critical",
    time: "7 minutes ago",
    unread: true,
  },
  {
    id: "2",
    title: "Temperature Rising",
    description: "Unusual temperature increase detected",
    type: "Warning",
    time: "17 minutes ago",
    unread: true,
  },
  {
    id: "3",
    title: "Motion Detected",
    description: "Unexpected motion in restricted area",
    type: "Warning",
    time: "32 minutes ago",
  },
  {
    id: "4",
    title: "Device Battery Low",
    description: "Smoke detector battery below 20%",
    type: "Info",
    time: "about 1 hour ago",
  },
];