const {
    PrismaClient
} = require('@prisma/client');
const {
    v7
} = require('uuid');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const hashPassword = (inputPassword) => {
    var salt = bcrypt.genSaltSync(Number(process.env.SALT_KEY));
    return bcrypt.hashSync(inputPassword, salt);
}

const prisma = new PrismaClient();

async function main() {
    await prisma.account.deleteMany({});
    await prisma.role.deleteMany({});

    await prisma.role.createMany({
        data: [
            {
                id: 1,
                name: "superadmin",
                permissions: JSON.stringify([
                    'announcement:view',
                    'announcement:create',
                    'announcement:update',
                    'announcement:delete',

                    'speaker:view',
                    'speaker:create',
                    'speaker:update',
                    'speaker:delete',

                    'location:view',
                    'location:create',
                    'location:update',
                    'location:delete',

                    'event:view',
                    'event:create',
                    'event:update',
                    'event:delete',

                    'account:view',
                    'account:create',
                    'account:update',
                    'account:delete',

                    'servanthood:view',
                    'servanthood:create',
                    'servanthood:update',
                    'servanthood:delete',

                    'blog:view',
                    'blog:create',
                    'blog:update',
                    'blog:delete',
                ])
            },
            {
                id: 2,
                name: "follower",
                permissions: ''
            }

        ]
    })

    await prisma.account.create({
        data: {
            publicId: v7(),
            name: 'Gregorius Eldwin Pradipta',
            email: 'gregeld96@gmail.com',
            password: hashPassword("admin"),
            dob: '1996-09-08',
            department: 'Digital Ministry',
            gender: "male",
            isInternal: true,
            roleName: "superadmin",
            roleId: 1,
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })