export type CognitiveDistortion =
  | "Catastrophizing"
  | "Mind Reading"
  | "Overgeneralization"
  | "All-or-Nothing Thinking"
  | "Emotional Reasoning"
  | "Fortune Telling";

export interface DistortionDetectionResult {
  distortions: CognitiveDistortion[];
  riskLevel: "low" | "medium" | "high";
  needsSafetyAlert: boolean;
}

const distortionPatterns = {
  "Catastrophizing": [
    /\b(worst|terrible|disaster|awful|horrible|catastrophe|ruined|destroyed)\b/i,
    /\b(can't handle|unbearable|end of the world)\b/i,
  ],
  "Mind Reading": [
    /\b(they think|she thinks|he thinks|everyone thinks|they're judging|they hate)\b/i,
    /\b(knows? what .* thinking|can tell .* thinking)\b/i,
  ],
  "Overgeneralization": [
    /\b(always|never|every time|everyone|nobody|no one|everything)\b/i,
    /\b(constantly|forever|all the time)\b/i,
  ],
  "All-or-Nothing Thinking": [
    /\b(completely|totally|absolutely|perfect|failure|ruined|worthless)\b/i,
    /\b(either .* or|all or nothing)\b/i,
  ],
  "Emotional Reasoning": [
    /\b(i feel .* so it must be|feels? like .* true|feels? .* therefore)\b/i,
    /\b(my feelings? (tell|say|mean))\b/i,
  ],
  "Fortune Telling": [
    /\b(will (never|always)|going to (fail|be|end)|won't work|doomed to)\b/i,
    /\b(i know .* will|certain .* will|predict)\b/i,
  ],
};

const highRiskKeywords = [
  /\b(want to die|kill myself|end it all|no point|suicide|self-harm|hurt myself)\b/i,
  /\b(better off dead|can't go on|no reason to live)\b/i,
];

export function detectCognitiveDistortions(text: string): DistortionDetectionResult {
  const detectedDistortions: CognitiveDistortion[] = [];

  // Check for each type of cognitive distortion
  for (const [distortion, patterns] of Object.entries(distortionPatterns)) {
    const hasDistortion = patterns.some(pattern => pattern.test(text));
    if (hasDistortion) {
      detectedDistortions.push(distortion as CognitiveDistortion);
    }
  }

  // Check for high-risk keywords
  const needsSafetyAlert = highRiskKeywords.some(pattern => pattern.test(text));

  // Determine risk level
  let riskLevel: "low" | "medium" | "high" = "low";
  if (needsSafetyAlert) {
    riskLevel = "high";
  } else if (detectedDistortions.length >= 3) {
    riskLevel = "medium";
  } else if (detectedDistortions.length >= 1) {
    riskLevel = "low";
  }

  return {
    distortions: detectedDistortions,
    riskLevel,
    needsSafetyAlert,
  };
}

export function generateTherapeuticResponse(
  userMessage: string,
  detection: DistortionDetectionResult
): string {
  if (detection.distortions.length === 0) {
    return "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about how you're feeling?";
  }

  const primaryDistortion = detection.distortions[0];
  
  const responses: Record<CognitiveDistortion, string> = {
    "Catastrophizing": "I notice you might be catastrophizing - imagining the worst possible outcome. Let's explore this together: What evidence do you have that this outcome will definitely occur? What are some other, more likely outcomes?",
    
    "Mind Reading": "It seems like you're making assumptions about what others are thinking. This is called mind reading. Remember, we can't truly know what others think unless they tell us. Have you considered asking them directly, or could there be other explanations for their behavior?",
    
    "Overgeneralization": "I hear some absolute terms like 'always' or 'never.' This might be overgeneralization. Let's challenge this: Can you think of even one exception to this pattern? Sometimes our brains overlook the times things went differently.",
    
    "All-or-Nothing Thinking": "This sounds like all-or-nothing thinking - seeing things in extremes. Life often exists in the middle ground. What might be some gray areas or partial successes in this situation?",
    
    "Emotional Reasoning": "Your feelings are valid, but I'm noticing emotional reasoning - assuming that because you feel something, it must be true. Our emotions are real, but they don't always reflect reality. What facts can we examine separate from the feeling?",
    
    "Fortune Telling": "It sounds like you're predicting the future - we call this fortune telling. While it's natural to worry, we can't know for certain what will happen. What has happened in similar situations before? What's the evidence for and against this prediction?",
  };

  return responses[primaryDistortion];
}
