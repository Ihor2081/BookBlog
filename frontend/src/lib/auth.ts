export interface JwtPayload {
  sub: string;
  is_admin: boolean;
  exp: number;
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}