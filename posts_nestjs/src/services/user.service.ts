import { Inject, Injectable } from "@nestjs/common";
import { User, expandRoles } from "../entities/user.entity";
import { Repository } from "typeorm";
import md5 from 'md5';
import { UnauthorizedException } from "../exception/unauthorized.exception";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {

    private key = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`;

    constructor(
        @Inject('USER_REPOSITORY') private userRepo: Repository<User>,
    ) {}

    async login(username: string, password: string): Promise<string> {
        const encodedPass = md5(password) as string;
        const user = await this.userRepo.findOne({
            where: {
                email: username,
                password: encodedPass,
            }
        });
        if (!user) {
            throw new UnauthorizedException('incorrect username or password');
        }
        expandRoles(user);
        const jwtService = new JwtService({
            privateKey: this.key,
            verifyOptions: {
                algorithms: [ "RS256" ],
            },
        });
        const iat = new Date().getTime();
        const claims = {
            sub: user.email,
            iat: iat,
            exp: iat + 3600000,
            roles: user.rolesList,
        };
        const token = jwtService.sign(JSON.stringify(claims), {
            privateKey: this.key,
        })
        return token;
    }
}