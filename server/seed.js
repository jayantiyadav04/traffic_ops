const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const ViolationType = require('./src/models/ViolationType');
const Area = require('./src/models/Area');
const Violation = require('./src/models/Violation');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await User.deleteMany();
        await ViolationType.deleteMany();
        await Area.deleteMany();
        await Violation.deleteMany();

        console.log('Data cleared...');

        // Create Users
        const admin = await User.create({
            username: 'admin',
            full_name: 'aaloo bhukara',
            email: 'admin@traffic.com',
            password: 'AdminPassword!23',
            role: 'admin',
        });

        const officer = await User.create({
            username: 'officer1',
            full_name: 'Officer John',
            email: 'officer@traffic.com',
            password: 'OfficerSecure#45',
            role: 'officer',
        });

        const citizen = await User.create({
            username: 'citizen1',
            full_name: 'Jane Doe',
            email: 'citizen@traffic.com',
            password: 'CitizenSafe$78',
            role: 'citizen',
        });

        console.log('Users created...');

        // Create Types
        // Create Types (According to Indian Motor Vehicles Act)
        const typeSpeeding = await ViolationType.create({ type_name: 'Over Speeding', base_fine: 2000 });
        const typeSignal = await ViolationType.create({ type_name: 'Red Light Jump', base_fine: 1000 });
        const typeHelmet = await ViolationType.create({ type_name: 'Driving Without Helmet', base_fine: 1000 });
        const typeSeatbelt = await ViolationType.create({ type_name: 'Driving Without Seatbelt', base_fine: 1000 });
        const typeDrunk = await ViolationType.create({ type_name: 'Drunk Driving', base_fine: 10000 });
        const typeLicense = await ViolationType.create({ type_name: 'Driving Without License', base_fine: 5000 });
        const typeInsurance = await ViolationType.create({ type_name: 'Driving Without Insurance', base_fine: 2000 });
        const typePUC = await ViolationType.create({ type_name: 'PUC Expired', base_fine: 2000 });
        const typePhone = await ViolationType.create({ type_name: 'Using Phone while Driving', base_fine: 5000 });
        const typeWrongSide = await ViolationType.create({ type_name: 'Wrong Side Driving', base_fine: 5000 });
        const typeRash = await ViolationType.create({ type_name: 'Rash Driving', base_fine: 5000 });

        console.log('Violation Types created...');

        // Create Areas (Indian Locations)
        const areaCP = await Area.create({ area_name: 'Connaught Place', city: 'New Delhi' });
        const areaMG = await Area.create({ area_name: 'MG Road', city: 'Bangalore' });
        const areaMarine = await Area.create({ area_name: 'Marine Drive', city: 'Mumbai' });
        const areaHitech = await Area.create({ area_name: 'Hitech City', city: 'Hyderabad' });
        const areaPark = await Area.create({ area_name: 'Park Street', city: 'Kolkata' });
        const areaSec17 = await Area.create({ area_name: 'Sector 17', city: 'Chandigarh' });
        const areaCivil = await Area.create({ area_name: 'Civil Lines', city: 'Jaipur' });
        const areaAnna = await Area.create({ area_name: 'Anna Salai', city: 'Chennai' });
        const areaCyber = await Area.create({ area_name: 'Cyber Hub', city: 'Gurgaon' });

        // Create Demo Violations
        await Violation.create({
            vehicle_number: 'XY-01-AB-1234',
            owner_name: 'John Smith',
            user: citizen._id, // Linked to our demo citizen
            violation_type: typeSpeeding._id,
            area: areaMG._id,
            officer: officer._id,
            fine_amount: 100,
            status: 'paid',
            notes: 'Overspeeding by 20kmph',
            violation_date: new Date('2025-12-01'),
        });

        await Violation.create({
            vehicle_number: 'XY-01-CD-5678',
            owner_name: 'Jane Doe',
            user: citizen._id,
            violation_type: typeSignal._id,
            area: areaCP._id,
            officer: officer._id,
            fine_amount: 50,
            status: 'unpaid',
            notes: 'Jumped red light',
            violation_date: new Date(), // Today
        });

        console.log('Violations seeded...');
        console.log('-----------------------------------');
        console.log('SEEDING COMPLETE');
        console.log('-----------------------------------');
        console.log(`Admin ID: ${admin._id}`);
        console.log(`Officer ID: ${officer._id}`);
        console.log(`Citizen ID: ${citizen._id}`);
        console.log(`Speeding Type ID: ${typeSpeeding._id}`);
        console.log(`CP Area ID: ${areaCP._id}`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
