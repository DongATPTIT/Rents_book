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


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'uongthuoc',
      synchronize: true,
      entities: [UserEntity]
    }),
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    AuthModule
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
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ErrorsInterceptor,
    // },
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
