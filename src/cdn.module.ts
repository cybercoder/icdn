import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KongGetMiddlewareV1Alpha1 } from './presentation/kong-get-middleware';
import { KongController } from './presentation/controllers/v1alpha1/kong.controller';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !!ENV ? `.env.${ENV}` : '.env',
    }),
  ],
  controllers: [KongController],
  providers: [],
})
export class CDNModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(KongGetMiddlewareV1Alpha1).forRoutes({
      path: '/v1alpha1/*',
      method: RequestMethod.GET,
    });
  }
}
