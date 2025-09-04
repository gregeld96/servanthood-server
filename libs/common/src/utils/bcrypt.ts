import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const hashPassword = (inputPassword: string, saltRound: string) => {
    var salt = genSaltSync(Number(saltRound));
    return hashSync(inputPassword, salt);
}

export const checkPassword = (inputPassword: string, hashingPassword: string) => {
    return compareSync(inputPassword, hashingPassword)    
}