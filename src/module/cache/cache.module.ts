import { Module } from "@nestjs/common";
import { RedisController } from "./cache.controller";
import { RedisModule } from "@nestjs-modules/ioredis";


@Module({
    imports: [RedisModule.forRoot({
        type: 'single',
        url: 'redis://localhost:6379',
    }),],
    controllers: [RedisController],
})
export class CacheModule { }