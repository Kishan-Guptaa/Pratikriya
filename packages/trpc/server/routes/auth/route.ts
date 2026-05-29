
import { userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createUserWithEmailAndPasswordInput, createUserWithEmailAndPasswordOutput, getLoggedInUserInfoInputModel, getLoggedInUserInfoOutputModel, signInUserWithEmailAndPasswordInputModel, signInUserWithEmailAndPasswordOutputModel } from "./model";
import { setAuthenticationCookie, clearAuthenticationCookie } from "../../utils/cookie";
import { z } from "zod";


const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword : publicProcedure.meta({openapi: { 
    method: "POST", 
    path: getPath('/createUserWithEmailAndPassword'),
    tags: TAGS
  }}).input(createUserWithEmailAndPasswordInput).output(createUserWithEmailAndPasswordOutput).mutation(async ({input, ctx}) =>{
    const {fullName, email, password} = input;
    const {id, token} = await userService.createUserWithEmailAndPassword({fullName, email, password});
    
    setAuthenticationCookie(ctx, token);

    return {id};
  }),

  signInUserWithEmailAndPassword : publicProcedure.meta({openapi: {
    method: "POST",
    path: getPath('/signInUserWithEmailAndPassword'),
    tags: TAGS
  }}).input(signInUserWithEmailAndPasswordInputModel).output(signInUserWithEmailAndPasswordOutputModel).mutation(async ({input, ctx}) =>{
    const {email, password} = input;
    const {id, token} = await userService.signInUserWithEmailAndPassword({email, password});
    
    setAuthenticationCookie(ctx, token);

    return {id};
  }),

  getLoggedInUserInfo: authenticatedProcedure.meta({openapi: {
    method: "POST",
    path: getPath('/getLoggedInUserInfo'),
    tags: TAGS,
    protect: true
  }}).input(getLoggedInUserInfoInputModel).output(getLoggedInUserInfoOutputModel).query(async ({ctx}) =>{
    const {id, fullName, email, profileImageUrl} = await userService.getUserInfoById(ctx.user.id);
    return {id, fullName, email, profileImageUrl};
  }),

  signOutUser: publicProcedure.meta({openapi: {
    method: "POST",
    path: getPath('/signOutUser'),
    tags: TAGS
  }}).input(z.object({})).output(z.object({})).mutation(async ({ctx}) => {
    clearAuthenticationCookie(ctx);
    return {};
  }),

  forgotPassword: publicProcedure.meta({openapi: {
    method: "POST",
    path: getPath('/forgotPassword'),
    tags: TAGS
  }}).input(z.object({ email: z.string().email() })).output(z.object({ success: z.boolean() })).mutation(async ({input}) => {
    // Mock implementation for demo purposes
    console.log("Mock sending password reset email to:", input.email);
    return { success: true };
  })

});
