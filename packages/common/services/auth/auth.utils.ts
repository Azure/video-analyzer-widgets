import jwt_decode, { JwtPayload } from 'jwt-decode';

export function isJwtTokenExpired(token: string): boolean {
    const decoded = jwt_decode(token) as JwtPayload;
    if (decoded.exp === undefined) {
        return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    return new Date().valueOf() >= date?.valueOf() || false;
}
