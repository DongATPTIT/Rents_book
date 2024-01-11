import { Module } from "@nestjs/common";
import { RedisController } from "./cache.controller";
import { RedisModule } from "@nestjs-modules/ioredis";
import { CacheService } from "./cache.service";


@Module({
    imports: [RedisModule.forRoot({
        type: 'single',
        url: 'redis://localhost:6379',
    }),],
    controllers: [RedisController],
    providers: [CacheService]
})
export class CacheModule { }