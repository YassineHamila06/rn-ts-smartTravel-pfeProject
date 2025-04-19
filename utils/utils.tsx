export const blurHashCode =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

/**
 * Decodes a JWT token and returns the payload.
 *
 * @param token - The JWT token to decode
 * @returns The decoded payload as an object, or null if decoding fails
 */
export const decodeJWT = (token: string): any | null => {
  try {
    // JWT token is split into three parts: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // The payload is the second part
    const payload = parts[1];

    // Base64Url decode the payload
    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));

    // Parse the decoded payload as JSON
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
};
