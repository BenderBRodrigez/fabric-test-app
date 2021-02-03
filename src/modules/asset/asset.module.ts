import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { AssetController } from './asset.controller';

@Module({
  imports: [SharedModule],
  controllers: [AssetController],
})
export class AssetModule {
}
