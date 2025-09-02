import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      authentication?: any | JwtPayload; // atau tipe sesuai kebutuhanmu
      user: {
        userId: number;
        publicId: string;
        role: string;
        name: string;
        dob: string | null;
        phoneNumber: string | null;
        gender: string | null;
        parishOrigin: string | null;
      }
    }
  }
}

export { }