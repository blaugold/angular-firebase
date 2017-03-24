# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.2.1"></a>
## [2.2.1](https://github.com/blaugold/angular-firebase/compare/v2.2.0...v2.2.1) (2017-03-24)


### Bug Fixes

* make services injectable again ([94b4da1](https://github.com/blaugold/angular-firebase/commit/94b4da1))



<a name="2.2.0"></a>
# [2.2.0](https://github.com/blaugold/angular-firebase/compare/v2.1.0...v2.2.0) (2017-03-24)


### Bug Fixes

* **rxjs:** import operators individually ([8b71f55](https://github.com/blaugold/angular-firebase/commit/8b71f55))
* don't import zone.js ([36681a3](https://github.com/blaugold/angular-firebase/commit/36681a3))
* **rxjs:** import operators without poluting global objects ([05751b0](https://github.com/blaugold/angular-firebase/commit/05751b0))


### Features

* **deps:** upgrade to angular[@4](https://github.com/4).0.0 ([9137e3a](https://github.com/blaugold/angular-firebase/commit/9137e3a))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/blaugold/angular-firebase/compare/v2.0.0...v2.1.0) (2017-03-22)


### Bug Fixes

* remove accidentally generated files from src ([8da8370](https://github.com/blaugold/angular-firebase/commit/8da8370))
* **FirebaseAuth:** remove UserAuthEvent and with it "pending" ([02b3516](https://github.com/blaugold/angular-firebase/commit/02b3516))


### Features

* **FirebaseDatabase:** allow parameterization with database schema ([be60e2e](https://github.com/blaugold/angular-firebase/commit/be60e2e))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/blaugold/angular-firebase/compare/v1.0.6...v2.0.0) (2017-03-18)


### Bug Fixes

* **FirebaseModule:** change module to make aot work ([45e2b00](https://github.com/blaugold/angular-firebase/commit/45e2b00))


### BREAKING CHANGES

* FirebaseModule: Apps now use `FirebaseModule#primaryApp` and `FirebaseModule#secondaryApp` to setup firebase apps.

The library now requires angular@>=4.0.0-rc.5.



<a name="1.0.6"></a>
## [1.0.6](https://github.com/blaugold/angular-firebase/compare/v1.0.5...v1.0.6) (2017-03-11)


### Bug Fixes

* **Auth:** fix error code type for SendPasswordResetEmailError ([41d21dd](https://github.com/blaugold/angular-firebase/commit/41d21dd))
* **ExtendedDataSnapshot:** make prevKey optional ([75aeca4](https://github.com/blaugold/angular-firebase/commit/75aeca4))



<a name="1.0.5"></a>
## [1.0.5](https://github.com/blaugold/angular-firebase/compare/v1.0.3...v1.0.5) (2017-01-30)


### Bug Fixes

* wrap firebase promises correctly ([229d315](https://github.com/blaugold/angular-firebase/commit/229d315))



<a name="1.0.4"></a>
## [1.0.4](https://github.com/blaugold/angular-firebase/compare/v1.0.3...v1.0.4) (2017-01-30)


### Bug Fixes

* wrap firebase promises correctly ([229d315](https://github.com/blaugold/angular-firebase/commit/229d315))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/blaugold/angular-firebase/compare/v1.0.2...v1.0.3) (2017-01-30)


### Bug Fixes

* remove typos from AuthErrorCodeType ([f594b9d](https://github.com/blaugold/angular-firebase/commit/f594b9d))
* **User:** add AuthErrorCodeType to code types of errors ([b8d17e4](https://github.com/blaugold/angular-firebase/commit/b8d17e4))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/blaugold/angular-firebase/compare/v1.0.0...v1.0.2) (2017-01-24)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/blaugold/angular-firebase/compare/v1.0.0...v1.0.1) (2017-01-24)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/blaugold/angular-firebase/compare/v0.2.0...v1.0.0) (2016-11-30)


### Features

* **FirebaseUser:** wrap User class to make it Zone aware ([e27ddb6](https://github.com/blaugold/angular-firebase/commit/e27ddb6))


### BREAKING CHANGES

* FirebaseUser: User is now FirebaseUser and UserCredential is now FirebaseUserCredential



<a name="0.2.0"></a>
# [0.2.0](https://github.com/blaugold/angular-firebase/compare/0.1.0...v0.2.0) (2016-11-14)


### Bug Fixes

* add generic varaible to statisfy compiler ([cd735be](https://github.com/blaugold/angular-firebase/commit/cd735be))
* **module:** make helpers private ([cebe0ee](https://github.com/blaugold/angular-firebase/commit/cebe0ee))


### Features

* **multiple projects:** add support for using multiple projects in one angular app ([b189301](https://github.com/blaugold/angular-firebase/commit/b189301))
