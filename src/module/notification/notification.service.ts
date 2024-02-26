import { Borrowing } from "@/databases/entity/borrowings.entity";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import * as admin from 'firebase-admin';
import { LessThan, Repository } from "typeorm";
import { ProducerService } from "../rabbitmq/producer.service";
import { REDIRECT_METADATA } from "@nestjs/common/constants";
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: "tina-bcdcc",
        clientEmail: "firebase-adminsdk-ci268@tina-bcdcc.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDoNZcLfLX/80xr\n5+cgpvJ0uOvr/A0XCIaA9DDeUco3Bgw1CKXYH1Q4fieJEw9l3MOdkySoO9aagYf4\nrGMmVFZYxC7PJGkRB1feO2BMtCy39olpatTa3xlNwHui8slKt3Xr6uU0xm89fma5\nsvnEkceheizsDrVj7RIRX8EMBhIUExi4XjncLOcbe/7ZAK8owOqUB0+iJYT3KXC6\nwIZv344/P+bg+ecbDiEnFonYgsZKUtVFE0595tJcWmJ+8xvSGaqjI+te2bYx/ycA\nTybPMWcmqAOjF6CJpWAmz28ZK6xSnahEvtC6jVMd8M3ylbDJA6OBeUMvEXgFLa23\nTLRR5+HXAgMBAAECggEAc2ga+zMOkzgcva5iYQiIDLnRSxYYfV+X1aRHW17j9OfV\nDlCPeDPN3Evao1YtO292ayyztccTl/OTm+Q1XNniljhemUWb0EJJieIRsN2FMiLd\n1V4qjuL9hPaKnAg1QaSff1Jdexa6N6JINLe+SdM4F8mMZP/EZ/btmWPxImQr/Pw0\nWt1Myjw1FJTxS1tfZICSoFg96pisyLdXz6tqk/NoZ4IaFk2UaaYYQkNIEnzqx4UO\ne66XClsTsF1t/cwsHEiBQAROUMVbozfF7Iv09iXCAKmhgBPYCGCiwZ8yumpV7836\nOjWI+GPTUNhmCph5GiPQ6Jl6XzB0dC2BL2LlXAz7DQKBgQD19bC30BhpEUywWI0/\ne7RC0/rmQrrZK7DGlNNGUIqSpBC7uLajdr+AJE9h2a+z0wCFOGbNZWwKPbgfKXmn\nRXhKARHiirYq9+sbXpvlMmvg16+vwySbwTwyVQxBOyUcGpXX3x+9r9rkzWF2MtdB\nyfK27GO0Hk1wjCtw9d9c+zxGBQKBgQDxsDTXfzA09GjVD2uVHshSl3tmO+v/kkyk\ng0APwVi6paExAm/crMee7+EQGJioQWXcDR8LfQrtUNoeXkWiLcSEgxtjhjeTKRsr\nSKbKdaUFG8l8pB15vYQd59EglGZopwJa8/QNIsfPucJpX9AixtTCHxGdEOyef5dt\nDsv0F2rTKwKBgQCuV2baBAEpiH+piDsmwpK1w/hWevpisZtuR1OyxahT5UOPLJEZ\nMTTwqcwy+dCXUHtP8vi7oqaAY9s9C3MV5CItorCAuf4CWxUlo1wxjBn3mCsKFPLA\nDKqUqsAzBK97SkTobVncZOhtwj7RP5xhH7qReuH5bHlLy6+HNGENUXAZ2QKBgAyg\niCI6IuqhWljHVXeVBCJMh8Xvm4Tev+JYeSBZmakmviUxW2bMICHNppSQtGkWAZxd\nkyGmhsufTcYIZtrySTIjJ2srt/uYSjMYuJ4bR2Pc78nzSRbzL9PgKKzrE+6jyxu1\nYyrMhmPz8JRQzS8D9FmwBduO5s3hHKg1/bHjB1HBAoGAfUqsUVbfXlGwlzGpJGV+\nhtZzxDImm5GCLH8Q9KGLmF6wqoXQe0gP3CtogTTOO1U+oeQVNyymfNLu5d5Geh5B\nw1CecRdYAOS64hchQ6q5DMhFjKRuUcD7pIxQdrWp+u8IiKIEeqIwaSwSKnylF2fh\niRV/+a13xJ8kUSW/qrnxwIA=\n-----END PRIVATE KEY-----\n"
    }),
});
@Injectable()
export class NotificationService {
    constructor(
        private readonly producerService: ProducerService,
        @InjectRepository(Borrowing)
        private readonly borrowRepo: Repository<Borrowing>) {

    }
    // @Cron('10 * * * * *')
    async sendingNotificationOneUser() {
        const currentDate = new Date();
        const users = await this.borrowRepo
            .createQueryBuilder('borrow')
            .where('borrow.returnDate < :currentDate', { currentDate })
            .leftJoinAndSelect('borrow.user', 'user')
            .select(['borrow.borrowingID', 'borrow.borrowDate', 'borrow.returnDate', 'borrow.fineAmount', 'user.email', 'user.name'])
            .getMany();

        const test = users.map(async borrowing => {
            console.log()
            const data = {
                email: borrowing.user.email,
                subject: 'Overdue book return',
                text: `Hello ${borrowing.user.name},
                You are overdue for returning our books. Please renew or return books at the counter.
                Thank you for using our service`,
            };
            await this.producerService.addToEmailQueue(data);
        });
        return test
    }
}