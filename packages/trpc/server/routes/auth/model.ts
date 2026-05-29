import {z} from 'zod';

export const createUserWithEmailAndPasswordInput = z.object({
    fullName : z.string().describe('The full name of the user'),
    email : z.email().describe('The email address of the user'),
    password : z.string().describe('The password for the user account'),
});

export const createUserWithEmailAndPasswordOutput = z.object({
    id : z.string().describe('The unique identifier of the user'),
});

export const signInUserWithEmailAndPasswordInputModel = z.object({
    email : z.email().describe('The email address of the user'),
    password : z.string().describe('The password for the user account'),
});

export const signInUserWithEmailAndPasswordOutputModel = z.object({
    id : z.string().describe('The unique identifier of the user'),
});

export const getLoggedInUserInfoInputModel = z.undefined();

export const getLoggedInUserInfoOutputModel = z.object({
    id : z.string().describe('The unique identifier of the user'),
    fullName : z.string().describe('The full name of the user'),
    email : z.email().describe('The email address of the user'),
    profileImageUrl : z.string().describe('The URL of the profile image of the user').optional().nullable(),
}); 