import { AdminRole } from "@prisma/client";

export type AdminJwtPayload = {
  sub: string;
  email: string;
  role: AdminRole;
};

