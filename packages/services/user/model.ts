import {z} from 'zod';

export const createUserWithEmailAndPasswordInput = z.object({
    fullName : z.string().describe('The full name of the user'),
    email : z.email().describe('The email address of the user'),
    password : z.string().describe('The password for the user account'),
    
});

export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>;


export const generateUserTokenPayload = z.object({
    id : z.string().describe('The unique identifier of the user'),
})

export type GenerateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>;

export const SignInUserWithEmailAndPasswordInput = z.object({
    email : z.email().describe('The email address of the user'),
    password : z.string().describe('The password for the user account'),
});

export type SignInUserWithEmailAndPasswordInputType = z.infer<typeof SignInUserWithEmailAndPasswordInput>;