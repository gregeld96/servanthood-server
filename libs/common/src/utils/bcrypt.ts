import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const hashPassword = (inputPassword: string) => {
    var salt = genSaltSync(Number(process.env.SALT_KEY));
    return hashSync(inputPassword, salt);
}

export const checkPassword = (inputPassword: string, hashingPassword: string) => {
    return compareSync(inputPassword, hashingPassword)    
}