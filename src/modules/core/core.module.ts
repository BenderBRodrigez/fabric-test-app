import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HlfService } from '../shared/services/hlf.service';
import { SharedModule } from '../shared/shared.module';
import { HlfAdminModule } from '../hlf-admin/hlf-admin.module';
import { HlfAdminService } from '../hlf-admin/hlf-admin.service';

@Module({
  imports: [
    SharedModule,
    HlfAdminModule,
  ],
})
export class CoreModule implements OnModuleInit {
  constructor(
    private readonly config: ConfigService,
    private readonly hlfService: HlfService,
    private readonly hlfAdminService: HlfAdminService,
  ) {
  }

  async onModuleInit() {
    await this.hlfService.init();
    await this.hlfAdminService.enrollAdmin(this.config.get('ORG1_MSP'));
  }
}
