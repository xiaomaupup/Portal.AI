import { AuthGuard } from "@nestjs/passport";
import { JWT_STRATEGY } from "./auth.constants";

export class JwtAuthGuard extends AuthGuard(JWT_STRATEGY) {}

