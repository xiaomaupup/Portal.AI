import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AdminLoginDto } from "./auth.dto";

@Controller("admin/auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  async login(@Body() dto: AdminLoginDto) {
    return this.auth.login(dto.email, dto.password);
  }
}

