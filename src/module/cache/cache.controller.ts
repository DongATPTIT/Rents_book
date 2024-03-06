import Redis from 'ioredis';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Public } from 'src/comon/decorator/public-auth-guard';


@Controller('cache')
export class RedisController {
    constructor(
        @InjectRedis() private readonly redis: Redis,
    ) { }

    @Public()
    @Post()
    async setData(@Body() body: any) {
        const data = await this.redis.set(body.key, body.value);
        return { data };
    }

    @Public()
    @Delete('/:key')
    async deleteData(@Param('key') key: any) {
        const cache = await this.redis.del(key);
        return cache
    }

    @Public()
    @Get()
    async getData() {
        const key = await this.redis.keys('*');
        return { key };
    }


    @Public()
    @Get('/:key')
    async getDataByKey(@Param('key') key: string) {
        const value = await this.redis.get(key);

        if (value) {
            return { key, value };
        } else {
            return { error: 'Key not found' };
        }
    }

}