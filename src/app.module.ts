import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './databases/entity/user.enity';
import { AuthModule } from './module/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './comon/guard/authen.gaurd';
import { RolesGuard } from './comon/guard/role.guard';
import { LoggerMiddleware } from './comon/middleware/logger.middleware';
import { UserService } from './module/user/user.service';
import { ErrorsInterceptor } from './comon/intercepter/logging.intercepter';
import { MailModule } from './module/mail/mail.module';
import { SocketModule } from './module/socket/socket.module';
import { CacheModule } from './module/cache/cache.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { QueueModule } from './module/rabbitmq/rabbitmq.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: `tina`,
      synchronize: true,
      entities: [UserEntity],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          requireTLS: false,
          auth: {
            user: 'namnguyen105202@gmail.com',
            pass: 'qgwt sxsc gxng zlxa',
          },
          service: 'gmail',
          secure: false, // STARTTLS
        },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    AuthModule,
    MailModule,
    SocketModule,
    CacheModule,
    QueueModule

  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
    UserService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('user')
  }
}
