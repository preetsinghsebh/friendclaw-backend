// List of crisis keywords indicative of self-harm or severe emotional crisis
const CRISIS_KEYWORDS = [
    "suicide", "kill myself", "want to die", "overdose", "end it all",
    "worthless", "self harm", "cut myself", "no reason to live"
];

const EMERGENCY_RESPONSE = `Please reach out to a professional right now — you are not alone.
For immediate help, please contact:
🚨 Vandrevala Foundation: 9999666555
🚨 iCall: 9152987821`;

/**
 * Checks for crisis keywords in the user's message
 * @param {string} text - User's message
 * @returns {boolean} true if a crisis keyword is found
 */
export const detectCrisis = (text) => {
    const normalizedText = text.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => normalizedText.includes(keyword));
};

export const enforceSafetyLayer = (userMessage, aiResponse) => {
    // 1. Check User Message for Crisis (Immediate Override)
    if (detectCrisis(userMessage)) {
        console.warn("[SafetyLayer] Crisis detected in user message. Overriding response.");
        return EMERGENCY_RESPONSE;
    }

    // 2. Return clean response
    return aiResponse;
};
