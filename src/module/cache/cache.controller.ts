import Redis from 'ioredis';
import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Public } from 'src/comon/decorator/public-auth-guard';
import { error } from 'console';


@Controller('cache')
export class RedisController {
    constructor(
        @InjectRedis() private readonly redis: Redis,
    ) { }

    @Public()
    @Post()
    async setData() {
        const data = await this.redis.set('zzz', 's');
        return { data };
    }

    @Public()
    @Delete()
    async deleteData(@Param() data: any) {
        const cache = await this.redis.del(`${data}`);
        return { cache }
    }

    @Public()
    @Get()
    async getData() {
        const data = await this.redis.keys('*');
        return { data };
    }
}