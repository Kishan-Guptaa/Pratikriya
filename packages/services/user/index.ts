import { randomBytes, createHmac } from 'node:crypto';
import * as JWT from 'jsonwebtoken';
import {db,eq} from '@repo/database';
import {usersTable} from '@repo/database/models/user';
import { createUserWithEmailAndPasswordInput, generateUserTokenPayload, GenerateUserTokenPayloadType, SignInUserWithEmailAndPasswordInput, SignInUserWithEmailAndPasswordInputType, type CreateUserWithEmailAndPasswordInputType} from './model';
import { env } from '../env';



class UserService {

    public async getUserInfoById(id : string) : Promise<{id : string, fullName : string, email : string, profileImageUrl : string | null}> {
        const user = await db.select({
            id: usersTable.id,
            fullName: usersTable.fullName,
            email: usersTable.email,
            profileImageUrl: usersTable.profileImageUrl,
        }).from(usersTable).where(eq(usersTable.id, id));
        if(!user || user.length === 0){
            throw new Error(`No user found with the id ${id}`);
        }
        return user[0]!;
    }

    private async getUserByEmail(email : string){
        const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if(!result || result.length === 0){
            return null;
        }
        return result[0];
    }
 
    private async generateUserToken(payload : GenerateUserTokenPayloadType) {
        // Implementation for generating user token
        const {id} = await generateUserTokenPayload.parseAsync(payload);
        const token = JWT.sign({id}, env.JWT_SECRET);
        return {token};
    }

    private async verifyUserToken(token : string) : Promise<GenerateUserTokenPayloadType> {
        try{
            const verificationResult = JWT.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadType;
            return verificationResult;
        }
        catch(error){
            throw new Error('Invalid or expired token');
        }
    }

    private async generateHash(salt : string, password : string){
        return createHmac('sha256', salt).update(password).digest('hex');
    }

    public async createUserWithEmailAndPassword(Payload : CreateUserWithEmailAndPasswordInputType){
        const {fullName, email, password} = await createUserWithEmailAndPasswordInput.parseAsync(Payload);

        // check if user with the same email already exists or not
        const existingUserWithEmail = await this.getUserByEmail(email);
        if(existingUserWithEmail){
            throw new Error(`A user with the same ${email} already exists`);
        }

        // calculate salt and hash for the password
        const salt = randomBytes(16).toString('hex');
        const hash = await this.generateHash(salt, password);

        // create user in database
        const userInsertResult = await db.insert(usersTable).values({
            fullName,
            email,
            password: hash,
            salt
        }).returning({ id : usersTable.id});

        if(!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id){
            throw new Error('Failed to create user');
        }

        const userId = userInsertResult[0].id;
        const { token } = await this.generateUserToken({id : userId});
        return {
            id : userId,
            token
        };
    }

    public async signInUserWithEmailAndPassword(Payload : SignInUserWithEmailAndPasswordInputType){
        const {email, password} = await SignInUserWithEmailAndPasswordInput.parseAsync(Payload);

        // check if user with the email exists or not
        const existingUser= await this.getUserByEmail(email);
        if(!existingUser){
            throw new Error(`No user found with the email ${email}`);
        }

        if(!existingUser.password || !existingUser.salt){
            throw new Error('Invalid Authentication Method');
        }
        // calculate hash for the provided password
        const hash = await this.generateHash(existingUser.salt, password);

        if(hash !== existingUser .password){
            throw new Error('Invalid email address or password');
        }

        const { token } = await this.generateUserToken({id : existingUser.id});
        return {
            id : existingUser.id,
            token
        };
    }

    public async verifyAndDecodeUserToken(token : string){
        const {id} = await this.verifyUserToken(token);
        // const userinfo = await this.getUserInfoById(id);
        // if(!userinfo){
        //     throw new Error('Invalid user information');
        // }

        // if(!userinfo.id || !userinfo.fullName || !userinfo.email){
        //     throw new Error('Invalid user information');
        // }

        return {
            id
        };
    }
}

export default UserService;