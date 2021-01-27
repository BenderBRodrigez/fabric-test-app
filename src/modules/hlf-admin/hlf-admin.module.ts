import { Module } from '@nestjs/common';
import { HlfAdminController } from './hlf-admin.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [HlfAdminController],
})
export class HlfAdminModule {
}
