import healthTipsData from "@/constants/health-tips.json";

export interface HealthTip {
  id: number;
  title: string;
  message: string;
  category: string;
}

/**
 * Gets a different health tip each day based on the current date
 * Uses the current date to determine which tip to show
 */
export function getDailyHealthTip(): HealthTip {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Use modulo to cycle through tips daily
  const tipIndex = dayOfYear % healthTipsData.tips.length;

  return healthTipsData.tips[tipIndex];
}
