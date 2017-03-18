"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("firebase");
class GoogleAuthProvider extends firebase_1.auth.GoogleAuthProvider {
}
exports.GoogleAuthProvider = GoogleAuthProvider;
class FacebookAuthProvider extends firebase_1.auth.FacebookAuthProvider {
}
exports.FacebookAuthProvider = FacebookAuthProvider;
class GithubAuthProvider extends firebase_1.auth.GithubAuthProvider {
}
exports.GithubAuthProvider = GithubAuthProvider;
class EmailAuthProvider extends firebase_1.auth.EmailAuthProvider {
}
exports.EmailAuthProvider = EmailAuthProvider;
class TwitterAuthProvider extends firebase_1.auth.TwitterAuthProvider {
}
exports.TwitterAuthProvider = TwitterAuthProvider;
