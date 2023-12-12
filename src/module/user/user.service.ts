import { ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/databases/entity/user.enity";
import { Like, Repository } from "typeorm";
import * as bcript from "bcrypt";
import { error } from "console";
import { UserRoles } from "src/databases/utils/constants";
import { UserDto } from "src/dto/user.dto";

@Injectable()
export class UserService {
    constructorData(context: ExecutionContext) {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
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
                    message: "Update successful",
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
}
