import { Module } from '@nestjs/common';
import { CoreModule } from './modules/core/core.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CoreModule,
  ],
})
export class AppModule {
}
