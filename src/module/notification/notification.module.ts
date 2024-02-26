import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Borrowing } from "@/databases/entity/borrowings.entity";
import { ProducerService } from "../rabbitmq/producer.service";

@Module({
    imports: [TypeOrmModule.forFeature([Borrowing]),
    ],
    providers: [NotificationService, ProducerService],
    controllers: [NotificationController]
})
export class NotificationModule { }