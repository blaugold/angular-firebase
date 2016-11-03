import { database, auth, User as FbUser } from 'firebase'

export type DataSnapshot = database.DataSnapshot
export type User = FbUser

export type AuthProvider = auth.AuthProvider
export type UserCredential = auth.UserCredential
export type AuthCredential = auth.AuthCredential

export class GoogleAuthProvider extends auth.GoogleAuthProvider {}
export class FacebookAuthProvider extends auth.FacebookAuthProvider {}
export class GithubAuthProvider extends auth.GithubAuthProvider {}
export class EmailAuthProvider extends auth.EmailAuthProvider {}
export class TwitterAuthProvider extends auth.TwitterAuthProvider {}
