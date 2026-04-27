const bcrypt = require('bcryptjs');
const User   = require('../models/User');
const Hunter = require('../models/Hunter');
const Guild  = require('../models/Guild');

const seedAll = async () => {
    try {
        const guildCount = await Guild.countDocuments();
        if (guildCount === 0) {
            const guildsData = [
                { name: 'Kamura Hunters Guild',  rank: 'S', leader: 'Fugen',   member_count: 15, specialty: 'All-Rounder',     description: 'The main guild protecting Kamura Village.', status: 'Active' },
                { name: 'Elgado Outpost Guild',   rank: 'A', leader: 'Rondine', member_count: 12, specialty: 'Sunbreak Quests', description: 'Guild stationed at the Elgado Outpost.',    status: 'Active' },
                { name: 'Sunbreak Vanguard',      rank: 'S', leader: 'Utsushi', member_count: 8,  specialty: 'Boss Hunting',    description: 'Elite squad for anomaly investigations.',   status: 'Active' },
                { name: 'Azure Dragon Order',     rank: 'A', leader: 'Bahari',  member_count: 20, specialty: 'Ranged Combat',   description: 'Masters of long-range weaponry.',           status: 'Active' },
                { name: 'Red Lotus Blade',        rank: 'S', leader: 'Hinoa',   member_count: 6,  specialty: 'Element Hunting', description: 'Specialists in elemental weaknesses.',      status: 'Active' },
                { name: 'Iron Claw Coalition',    rank: 'B', leader: 'Iori',    member_count: 18, specialty: 'Item Gathering',  description: 'Focused on resource collection.',           status: 'Active' },
                { name: 'Silver Wing Alliance',   rank: 'A', leader: 'Minoto',  member_count: 10, specialty: 'Support',         description: 'Provides support for other hunters.',       status: 'Active' },
                { name: 'Crimson Howl Pack',      rank: 'A', leader: 'Kagero',  member_count: 14, specialty: 'Ambush Tactics',  description: 'Experts in stealth and ambush.',            status: 'Active' },
                { name: 'Fated Four Hunters',     rank: 'S', leader: 'Yomogi',  member_count: 4,  specialty: 'Elite Squad',     description: 'A small but legendary elite team.',         status: 'Active' },
                { name: 'Narwa Apex Squad',       rank: 'B', leader: 'Senri',   member_count: 9,  specialty: 'Apex Hunting',    description: 'Specialists in Apex monster hunting.',      status: 'Inactive' },
            ];
            await Guild.insertMany(guildsData);
            console.log('Guilds seeded (10 guilds)');
        } else {
            console.log('Guilds already exist, skipping seed.');
        }

        const hunterCount = await Hunter.countDocuments();
        if (hunterCount === 0) {
            const huntersData = [
                { name: 'Fugen',    weapon: 'Long Sword',    rank: 100, element: 'None',    status: 'Active'   },
                { name: 'Hinoa',    weapon: 'Dual Blades',   rank: 5,   element: 'Thunder', status: 'Active'   },
                { name: 'Minoto',   weapon: 'Long Sword',    rank: 5,   element: 'Ice',     status: 'Active'   },
                { name: 'Kagero',   weapon: 'Hunting Horn',  rank: 10,  element: 'None',    status: 'Active'   },
                { name: 'Utsushi',  weapon: 'Switch Axe',    rank: 15,  element: 'Fire',    status: 'Active'   },
                { name: 'Rondine',  weapon: 'Gunlance',      rank: 20,  element: 'Dragon',  status: 'Active'   },
                { name: 'Bahari',   weapon: 'Heavy Bowgun',  rank: 3,   element: 'Water',   status: 'Training' },
                { name: 'Iori',     weapon: 'Insect Glaive', rank: 7,   element: 'None',    status: 'Active'   },
                { name: 'Yomogi',   weapon: 'Long Sword',    rank: 8,   element: 'Fire',    status: 'Active'   },
                { name: 'Senri',    weapon: 'Light Bowgun',  rank: 12,  element: 'Ice',     status: 'Active'   },
            ];
            await Hunter.insertMany(huntersData);
            console.log('Hunters seeded (10 hunters)');
        } else {
            console.log('Hunters already exist, skipping seed.');
        }

        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const passwordHash = await bcrypt.hash('password123', 10);
            const usersData = [
                { username: 'fugen',   name: 'Fugen',   email: 'fugen@kamura.com',   password: passwordHash, rank: 100, weapon: 'Long Sword'    },
                { username: 'hinoa',   name: 'Hinoa',   email: 'hinoa@kamura.com',   password: passwordHash, rank: 5,   weapon: 'Dual Blades'   },
                { username: 'minoto',  name: 'Minoto',  email: 'minoto@kamura.com',  password: passwordHash, rank: 5,   weapon: 'Long Sword'    },
                { username: 'kagero',  name: 'Kagero',  email: 'kagero@kamura.com',  password: passwordHash, rank: 10,  weapon: 'Hunting Horn'  },
                { username: 'utsushi', name: 'Utsushi', email: 'utsushi@kamura.com', password: passwordHash, rank: 15,  weapon: 'Switch Axe'    },
                { username: 'rondine', name: 'Rondine', email: 'rondine@kamura.com', password: passwordHash, rank: 20,  weapon: 'Gunlance'      },
                { username: 'bahari',  name: 'Bahari',  email: 'bahari@kamura.com',  password: passwordHash, rank: 3,   weapon: 'Heavy Bowgun'  },
                { username: 'iori',    name: 'Iori',    email: 'iori@kamura.com',    password: passwordHash, rank: 7,   weapon: 'Insect Glaive' },
                { username: 'yomogi',  name: 'Yomogi',  email: 'yomogi@kamura.com',  password: passwordHash, rank: 8,   weapon: 'Long Sword'    },
                { username: 'senri',   name: 'Senri',   email: 'senri@kamura.com',   password: passwordHash, rank: 12,  weapon: 'Light Bowgun'  },
            ];
            await User.insertMany(usersData);
            console.log('Users seeded (10 hunter accounts)');
        } else {
            console.log('Users already exist, skipping seed.');
        }

    } catch (error) {
        console.error('Seeding error:', error.message);
    }
};

module.exports = { seedAll };
