import { ForbiddenException, Injectable } from "@nestjs/common";
import { error } from "console";
import { UserService } from "src/module/user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from 'argon2';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/databases/entity/user.entity";
import { Repository } from "typeorm";
import { UserRoles } from "src/databases/utils/constants";



@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    async createUser(dto) {
        try {
            const check = await this.userRepository.findOne({ where: { email: dto.email } });
            if (check) {
                throw new Error("Email already exists");
            }
            dto.password = await bcrypt.hash(dto.password, 10);
            const newUser = await this.userRepository.save(dto);
            const { password, refreshToken, ...rest } = newUser;
            const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role);
            await this.updateRefreshToken(newUser.id, tokens.refreshToken);
            return {
                message: "User created successfully",
                data: rest,
                tokens: tokens
            };
        }
        catch (error) {
            throw new Error(error);
        }

    }
    async signIn(email: string, pass: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new Error("Email not found");
        }
        const check = await bcrypt.compare(pass, user.password);
        if (!check) {
            throw new error
        }
        const tokens = await this.getTokens(user.id, user.email, user.role)

        // const payload = { sub: user.id, username: user.name, email: user.email, role: user.role };
        // const access_token = await this.jwtService.signAsync(payload);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return {
            tokens: tokens,
        };
    }

    async logOut(id: string) {
        const data = await this.userService.updateUser(id, { refreshToken: null });
        return {
            message: "logout successfully",
        }
    }

    async logOutAllUsers() {
        const data = await this.userRepository.update(
            { role: UserRoles.USER },
            { refreshToken: null }
        );
        return {
            message: "logout all users successfully",
        }
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        console.log(refreshToken);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userService.updateUser(userId, { refreshToken: hashedRefreshToken });
    }

    async getTokens(userId: string, email: string, role: string) {
        process.env.SECRET_KEY_ACCESS_TOKEN
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: email,
                    role: role,
                },
                {
                    secret: process.env.SECRET_KEY_ACCESS_TOKEN,
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: email,
                    role: role
                },
                {
                    secret: process.env.SECRET_KEY_REFRESH_TOKEN,
                    expiresIn: '7d',
                },
            ),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshTokens(id: string, refreshToken: string) {
        const user = await this.userService.findById(id);
        if (!user || !user.refreshToken) {
            throw new ForbiddenException('Access Denied');
        }
        const refreshTokenMatches = await bcrypt.compare(
            refreshToken,
            user.refreshToken,
        );
        if (!refreshTokenMatches) {
            throw new ForbiddenException('Access Denied');
        }
        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
}