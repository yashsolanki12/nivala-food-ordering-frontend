// Utility to decode JWT and get userId
export function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || null;
  } catch (e) {
    return null;
  }
}
