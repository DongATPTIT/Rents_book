import { Module } from "@nestjs/common";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { SearchController } from "./elastic-search.controller";
import { SearchService } from "./elastic-search.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Book } from "src/databases/entity/book.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        ElasticsearchModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                node: configService.get('ELASTIC_URL') || 'http://localhost:9200',
                maxRetries: 10,
                requestTimeout: 60000,
                auth: {
                    username: configService.get('ELASTIC_USERNAME'),
                    password: configService.get('ELASTIC_PASSWORD')
                },
            }),
        }),
        TypeOrmModule.forFeature([Book]),
    ],
    controllers: [SearchController],
    providers: [SearchService],
    exports: [SearchService],
})
export class SearchModule {
}