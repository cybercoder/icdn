import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !!ENV ? `.env.${ENV}` : '.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class CDNModule {}
