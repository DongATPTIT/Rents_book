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
    // type: 'mysql',
    // host: 'localhost',
    // port: 3306,
    // username: process.env.user_name,
    // password: process.env.db_password,
    // database: process.env.db_name,
    // synchronize: true,
    // entities: [UserEntity],
    // autoLoadEntities: true,
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    AuthModule,
    MailModule,
    SocketModule,
    CacheModule,

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
