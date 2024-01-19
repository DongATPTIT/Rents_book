import { ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/databases/entity/user.entity";
import { Like, Repository } from "typeorm";
import { error } from "console";
import { UserRoles } from "src/databases/utils/constants";
import { ProducerService } from "../rabbitmq/producer.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly producerService: ProducerService,
    ) { }


    async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email: email } });
    }
    async findByName(name: string) {
        const results = await this.userRepository.find({
            where: {
                name: Like(`${name}%`),
            },
        });
        return results;
    }

    async findAllUserRole() {
        const data = await this.userRepository.find({ where: { role: UserRoles.USER } });
        return data;
    }

    async findById(id: string) {
        const results = await this.userRepository.findOne({ where: { id: id } });
        return results;
    }

    async findAllUser() {
        return await this.userRepository.find({});
    }

    async updateUser(id: string, dto) {
        try {
            const user = await this.userRepository.findOne({ where: { id: id } });
            // console.log(user);
            if (user) {
                const update = await this.userRepository.update(id, dto);
                const user = await this.userRepository.findOne({ where: { id: id } });
                // const update = await this.userRepository
                //     .createQueryBuilder()
                //     .update(UserEntity)
                //     .set(dto)
                //     .where("id = :id", { id })
                //     .returning("*")
                //     .execute();
                return {
                    message: "Update successfuly",
                    user: user
                };
            } else {
                throw new error("User not found");
            }
        }
        catch (error) {
            throw new error;
        }
    }

    async deleteUser(id: string) {
        const user = await this.userRepository.findOne({ where: { id: id } });
        if (user) {
            const deleted = await this.userRepository.delete(id);

            return {
                message: "User deleted",
            };
        };
    }
    async sendMail(createUserDto: any) {
        const emailData = {
            email: `${createUserDto.gmail}`,
            subject: 'Welcome to Our Community',
            text: `Hello ${createUserDto.gmail},
            Welcome to our community! Your account is now active.
            Enjoy your time with us!`,
        };
        await this.producerService.addToEmailQueue(emailData);
        return emailData;
    }
}
