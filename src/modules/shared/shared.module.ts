import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HlfService } from './services/hlf.service';
import { HlfAdminService } from '../hlf-admin/hlf-admin.service';

const services = [
  ConfigService,
  HlfService,
  HlfAdminService,
];

@Module({
  providers: [
    ...services,
  ],
  exports: [
    ...services,
  ],
})
export class SharedModule {
}
