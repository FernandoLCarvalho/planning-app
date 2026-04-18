import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth/auth.module';
import { UserPreferencesService } from './application/user-preferences.service';
import { UserPreferencesController } from './presentation/user-preferences.controller';

@Module({
  imports: [AuthModule],
  providers: [UserPreferencesService],
  controllers: [UserPreferencesController],
  exports: [UserPreferencesService],
})
export class UserPreferencesModule {}
