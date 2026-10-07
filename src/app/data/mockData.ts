import { CognitiveDistortion } from "../utils/distortionDetector";

export interface Session {
  id: string;
  date: string;
  duration: number; // in minutes
  distortionsDetected: CognitiveDistortion[];
  riskLevel: "low" | "medium" | "high";
  messageCount: number;
}

export interface EmotionalInsight {
  date: string;
  distortionCounts: Record<CognitiveDistortion, number>;
  totalMessages: number;
  riskLevel: "low" | "medium" | "high";
}

export const recentSessions: Session[] = [
  {
    id: "1",
    date: "2026-02-21",
    duration: 25,
    distortionsDetected: ["Catastrophizing", "Overgeneralization"],
    riskLevel: "low",
    messageCount: 12,
  },
  {
    id: "2",
    date: "2026-02-19",
    duration: 18,
    distortionsDetected: ["Mind Reading", "Fortune Telling"],
    riskLevel: "low",
    messageCount: 8,
  },
  {
    id: "3",
    date: "2026-02-17",
    duration: 32,
    distortionsDetected: ["All-or-Nothing Thinking", "Emotional Reasoning", "Catastrophizing"],
    riskLevel: "medium",
    messageCount: 15,
  },
  {
    id: "4",
    date: "2026-02-15",
    duration: 20,
    distortionsDetected: ["Overgeneralization"],
    riskLevel: "low",
    messageCount: 9,
  },
];

export const emotionalInsightsData: EmotionalInsight[] = [
  {
    date: "2026-02-15",
    distortionCounts: {
      "Catastrophizing": 1,
      "Mind Reading": 0,
      "Overgeneralization": 3,
      "All-or-Nothing Thinking": 0,
      "Emotional Reasoning": 0,
      "Fortune Telling": 0,
    },
    totalMessages: 9,
    riskLevel: "low",
  },
  {
    date: "2026-02-17",
    distortionCounts: {
      "Catastrophizing": 4,
      "Mind Reading": 1,
      "Overgeneralization": 2,
      "All-or-Nothing Thinking": 3,
      "Emotional Reasoning": 2,
      "Fortune Telling": 1,
    },
    totalMessages: 15,
    riskLevel: "medium",
  },
  {
    date: "2026-02-19",
    distortionCounts: {
      "Catastrophizing": 0,
      "Mind Reading": 2,
      "Overgeneralization": 1,
      "All-or-Nothing Thinking": 0,
      "Emotional Reasoning": 0,
      "Fortune Telling": 2,
    },
    totalMessages: 8,
    riskLevel: "low",
  },
  {
    date: "2026-02-21",
    distortionCounts: {
      "Catastrophizing": 3,
      "Mind Reading": 0,
      "Overgeneralization": 4,
      "All-or-Nothing Thinking": 1,
      "Emotional Reasoning": 1,
      "Fortune Telling": 0,
    },
    totalMessages: 12,
    riskLevel: "low",
  },
];

export const testimonials = [
  {
    name: "Sarah M.",
    text: "This app has helped me recognize patterns in my thinking that I never noticed before. The gentle guidance makes a real difference.",
    rating: 5,
  },
  {
    name: "James T.",
    text: "As someone who struggles with anxiety, having 24/7 access to CBT support has been life-changing. The AI feels genuinely supportive.",
    rating: 5,
  },
  {
    name: "Emily R.",
    text: "I was skeptical at first, but the distortion detection is surprisingly accurate. It's like having a therapist in my pocket.",
    rating: 5,
  },
];
