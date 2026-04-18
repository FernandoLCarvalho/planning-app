import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './application/auth.service';
import { JwtAuthGuard } from './infrastructure/jwt-auth.guard';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    PassportModule,
    // JwtModule registered without a default secret so each signAsync call
    // explicitly provides its own secret (access vs. refresh differ).
    JwtModule.register({}),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
