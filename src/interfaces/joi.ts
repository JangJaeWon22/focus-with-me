export interface singUpUser {
    email : string
    nickname: string
    password: string
    confirmPassword: string
}

export interface updateUserProfile{
    nicknameNew: string
}

export interface updateUserPw{
    passwordOld: string
    passwordNew: string
    confirmPasswordNew: string
}

export interface existNickname{
    nickname :string
}

export interface existEmail{
    email: string
}