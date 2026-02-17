import aj from "../utils/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "Rate limit exceeded. Please try again later.", success: false });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied", success: false });
      } else {
        return res.status(403).json({ message: "Access denied by security policy", success: false });
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected",
        success: false
      });
    }

    next();

  } catch (error) {
    console.error("Arcjet protection error: ", error);
    next();
  }
}