import { Module, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HlfService } from '../shared/services/hlf.service';
import { SharedModule } from '../shared/shared.module';
import { HlfAdminModule } from '../hlf-admin/hlf-admin.module';
import { HlfAdminService } from '../hlf-admin/hlf-admin.service';
import { AssetModule } from '../asset/asset.module';

@Module({
  imports: [
    SharedModule,
    HlfAdminModule,
    AssetModule,
  ],
})
export class CoreModule implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private readonly config: ConfigService,
    private readonly hlfService: HlfService,
    private readonly hlfAdminService: HlfAdminService,
  ) {
  }

  async onModuleInit() {
    await this.hlfService.init();
    await this.hlfAdminService.enrollAdmin();
    await this.hlfAdminService.registerAndEnrollUser();
    await this.hlfService.openGatewayAndSetContract();
  }

  onApplicationShutdown() {
    this.hlfService.gateway.disconnect();
  }
}
