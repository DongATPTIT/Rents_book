import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './databases/entity/user.entity';
import { AuthModule } from './module/auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './comon/guard/authen.guard';
import { RolesGuard } from './comon/guard/role.guard';
import { UserService } from './module/user/user.service';
import { MailModule } from './module/mail/mail.module';
import { SocketModule } from './module/socket/socket.module';
import { CacheModule } from './module/cache/cache.module';
import { QueueModule } from './module/rabbitmq/rabbitmq.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Book } from './databases/entity/book.entity';
import { BookModule } from './module/book/book.module';
import { SearchModule } from './module/elastic-search/elastic-search.module';
import { Authors } from './databases/entity/authors.entity';
import { Genres } from './databases/entity/genres.entity';
import { AuthorModule } from './module/authors/authors.module';
import { GenresModule } from './module/genres/genres.module';
import { UploadModule } from './module/uploads/upload.module';
import { GentalTicketsModule } from './module/rental-tickets/rental-tickets.module';
import { Borrowing } from './databases/entity/borrowings.entity';
import { NotificationService } from './module/notification/notification.service';
import { NotificationModule } from './module/notification/notification.module';
import { AllExceptionsFilter } from './exception/all-exception.filter';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('USER_NAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: ["src/databases/entity/*.js"],
        autoLoadEntities: true,
        synchronize: true
      })
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
    UserModule,
    AuthModule,
    MailModule,
    SocketModule,
    CacheModule,
    QueueModule,
    BookModule,
    SearchModule,
    AuthorModule,
    GenresModule,
    UploadModule,
    GentalTicketsModule,
    NotificationModule,
    TypeOrmModule.forFeature([User, Book, Authors, Genres, Borrowing],),
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
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    UserService,
    NotificationService
  ],
})
export class AppModule {
}
