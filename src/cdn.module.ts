import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  KongGetMiddlewareV1Alpha1,
  KongOtherMethodsMiddlewareV1Alpha1,
} from './presentation/kong-get-middleware';
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
export class CDNModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(KongGetMiddlewareV1Alpha1).forRoutes({
      path: '/v1alpha1/*',
      method: RequestMethod.GET,
    });
    consumer.apply(KongOtherMethodsMiddlewareV1Alpha1).forRoutes({
      path: '/v1alpha1/*',
      method: RequestMethod.POST,
    });
  }
}
