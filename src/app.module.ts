import { Module, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from './modules/shared/shared.module';
import { HlfAdminModule } from './modules/hlf-admin/hlf-admin.module';
import { AssetModule } from './modules/asset/asset.module';
import { HlfService } from './modules/shared/services/hlf.service';
import { HlfAdminService } from './modules/hlf-admin/hlf-admin.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    HlfAdminModule,
    AssetModule,
  ],
})
export class AppModule implements OnModuleInit, OnApplicationShutdown {
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
