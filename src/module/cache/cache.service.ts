import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Redis } from "ioredis";
import { InjectRedis } from "@nestjs-modules/ioredis";

@Injectable()
export class CacheService {
    // constructor(@InjectRedis() private readonly redis: Redis) { }

    // @Get('contacts/:contactId')
    // async getContact(@Res() res, @Param('contactId') contactId) {
    //     const cachedData = await this.cacheService.get(contactId.toString());
    //     if (cachedData) {
    //         console.log('Getting data from cache');
    //         return res.status(HttpStatus.OK).json(cachedData);
    //     }
    //     const contact = await this.redis.getContact(contactId);
    //     if (!contact) throw new NotFoundException('Contact does not exist');
    //     await this.redis.set(contactId.toString(), contact);
    //     const newCachedData = await this.redis.get(contactId.toString());
    //     console.log('data set to cache', newCachedData);
    //     return res.status(HttpStatus.OK).json(contact);
    // }
}
