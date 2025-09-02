const {
    PrismaClient
} = require('@prisma/client');
const {
    v7
} = require('uuid');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    await prisma.event.deleteMany({});
    await prisma.speaker.deleteMany({});
    await prisma.location.deleteMany({});

    await prisma.speaker.createMany({
        data: [
            {
                id: 1,
                name: "Gery Hartono",
            },
            {
                id: 2,
                name: "Ferdie Soethiono",
            },
            {
                id: 3,
                name: "Christian Mulyadi",
            },
            {
                id: 4,
                name: "Vincentius Tjahjono Santoso",
            },
            {
                id: 5,
                name: "Michael Santoso",
            },
            {
                id: 6,
                name: "Elaine Magdalena"
            },
            {
                id: 7,
                name: 'Ancelo Ganda',
            },
            {
                id: 8,
                name: 'Jeffry Dalla',
            }
        ]
    });

    await prisma.location.createMany({
        data: [
            {
                id: 1,
                name: "Hotel Neo Puri Indah - Jakarta",
                latitude: '-6.1745722',
                longitude: '106.7028935',
                linkMap: '',
                address: 'Jl. Kembangan Raya No.8, Kembangan Utara, Kec. Kembangan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11610'
            },
        ]
    });

    const publicE1Id = v7();
    const publicE2Id = v7();
    const publicE3Id = v7();
    const publicE4Id = v7();
    const publicE5Id = v7();
    const publicE6Id = v7();

    await prisma.event.createMany({
        data: [
            {
                id: 1,
                publicId: publicE1Id,
                name: "How To Deal With Life Crisis",
                slug: "how-to-deal-with-life-crisis",
                category: 'Project Day',
                startDate: "2025-09-12",
                endDate: "2025-09-12",
                startTime: "18:00",
                endTime: "21:30",
                locationId: 1,
                locationName: 'Neo Hotel Puri Indah - Jakarta',
                locationAddress: 'Jl. Kembangan Raya No.8, Kembangan Utara, Kec. Kembangan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11610',
                description: `💭 'Ketika hidup terasa hampa, justru di sanalah Tuhan ingin menyapa'

                Quarter life crisis...Mid life crisis...
                Kebingungan, rasa kosong, pertanyaan tanpa jawaban.
                Semua bisa menimpa—bahkan orang beriman.
                
                PROJECT DAY bulan ini mengajak kita mengenali, memahami, dan menemukan jalan pulang ke hati Tuhan di tengah badai hidup.
                Mari datang dan kita belajar menanganinya supaya kita berani berjalan melewati krisis, bukan lari darinya.
                `,
            },
            {
                id: 2,
                publicId: publicE2Id,
                name: "A Wealthy Saint",
                slug: "a-wealthy-saint",
                category: 'Project Day',
                startDate: "2025-08-08",
                endDate: "2025-08-08",
                startTime: "18:00",
                endTime: "21:30",
                locationId: 1,
                locationName: 'Neo Hotel Puri Indah - Jakarta',
                locationAddress: 'Jl. Kembangan Raya No.8, Kembangan Utara, Kec. Kembangan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11610',
                description: `Is money your servant… or your master?
                Can wealth lead you closer to God—or straight to destruction?
                
                Let's learn together with Michael Santoso from HSM Surabaya as we uncover what Scripture really says about money, wealth, and holiness—and how to break free from the grip of greed.
                `,
            },
            {
                id: 3,
                publicId: publicE3Id,
                name: "Discipline",
                slug: "discipline",
                category: 'Project Day',
                startDate: "2025-07-11",
                endDate: "2025-07-11",
                startTime: "18:00",
                endTime: "21:30",
                locationId: 1,
                locationName: 'Neo Hotel Puri Indah - Jakarta',
                locationAddress: 'Jl. Kembangan Raya No.8, Kembangan Utara, Kec. Kembangan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11610',
                description: `Tanpa disiplin, hidup kita mudah jatuh dalam kekacauan—karena ketidakteraturan bukan berasal dari Allah, tapi dari dunia.

                Disiplin rohani bukan beban, tapi bentuk kasih dan ketaatan kita sebagai anak-anak-Nya. Di dalam disiplin, ada identitas, keteguhan, dan buah rohani yang kekal.
                `,
            },
            {
                id: 4,
                publicId: publicE4Id,
                name: "Hobby or Addiction?",
                slug: "hobby-or-addication",
                category: 'Project Day',
                startDate: "2025-06-13",
                endDate: "2025-06-13",
                startTime: "18:00",
                endTime: "21:30",
                locationId: 1,
                locationName: 'Neo Hotel Puri Indah - Jakarta',
                locationAddress: 'Jl. Kembangan Raya No.8, Kembangan Utara, Kec. Kembangan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11610',
                description: `"Saat kesenangan kecil mulai mengambil alih hidup kita..."
                Ini HOBI atau ADIKSI?
                
                Punya hobi itu berkat, apalagi kalau hobinya sehat.
                Tapi... kapan hobi mulai berubah jadi belenggu?
                Apakah kita masih menikmati hobi, atau sudah dikuasai olehnya?
                Apa batasnya? Dan bagaimana caranya supaya tetap merdeka — jiwa tetap ringan, Tuhan tetap jadi yang utama?
                `,
            },
            {
                id: 5,
                publicId: publicE5Id,
                name: "As a Dear pants for water",
                slug: "as-a-dear-pants-for-water",
                category: 'Project Day',
                startDate: "2025-05-09",
                endDate: "2025-05-09",
                startTime: "18:00",
                endTime: "21:30",
                locationId: 1,
                locationName: 'Neo Hotel Puri Indah - Jakarta',
                locationAddress: 'Jl. Kembangan Raya No.8, Kembangan Utara, Kec. Kembangan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11610',
                description: ``,
            },
            {
                id: 6,
                publicId: publicE6Id,
                name: "How Jesus Dealt with Difficult People",
                slug: "how-jesus-dealt-with-difficult-people",
                category: 'Project Day',
                startDate: "2025-04-13",
                endDate: "2025-04-13",
                startTime: "18:00",
                endTime: "21:30",
                locationId: 1,
                locationName: 'Neo Hotel Puri Indah - Jakarta',
                locationAddress: 'Jl. Kembangan Raya No.8, Kembangan Utara, Kec. Kembangan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, 11610',
                description: ``,
            },
        ]
    });

    await prisma.eventSpeaker.createMany({
        data: [
            {
                name: "Vincentius Tjahjono Santoso",
                eventId: 1,
                speakerId: 4,
            },
            {
                name: "Michael Santoso",
                eventId: 2,
                speakerId: 5,
            },
            {
                name: "Elaine Magdalena",
                eventId: 3,
                speakerId: 6,
            },
            {
                name: "Ancelo Ganda",
                eventId: 4,
                speakerId: 7,
            },
            {
                name: "Jeffry Dalla",
                eventId: 5,
                speakerId: 8,
            },
            {
                name: "Gery Hartono",
                eventId: 6,
                speakerId: 1,
            }
        ],
    });

    await prisma.masterSetting.create({
        data: {
            name: 'Event Redirection',
            group: 'redirect',
            category: 'event',
            firstValue: 'how-to-deal-with-life-crisis',
        }
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