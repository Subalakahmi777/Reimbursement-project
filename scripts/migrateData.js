require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Reimbursement = require('../models/Reimbursement');

const migrateData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if data already exists
        const existingUsers = await User.countDocuments();
        const existingReimbursements = await Reimbursement.countDocuments();

        if (existingUsers > 0 || existingReimbursements > 0) {
            console.log('\n⚠️  WARNING: Database already contains data!');
            console.log(`   Users: ${existingUsers}`);
            console.log(`   Reimbursements: ${existingReimbursements}`);
            console.log('\n   Skipping migration to avoid duplicates.');
            console.log('   If you want to re-migrate, please clear the database first.\n');
            process.exit(0);
        }

        // Migrate users
        const usersPath = path.join(__dirname, '../data/users.json');
        if (fs.existsSync(usersPath)) {
            const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
            if (usersData.length > 0) {
                await User.insertMany(usersData);
                console.log(`✅ Migrated ${usersData.length} users successfully`);
            } else {
                console.log('ℹ️  No users to migrate');
            }
        } else {
            console.log('⚠️  users.json not found, skipping user migration');
        }

        // Migrate reimbursements
        const reimbursementsPath = path.join(__dirname, '../data/reimbursements.json');
        if (fs.existsSync(reimbursementsPath)) {
            const reimbursementsData = JSON.parse(fs.readFileSync(reimbursementsPath, 'utf8'));
            if (reimbursementsData.length > 0) {
                // Transform data to match schema (remove old 'id' field, MongoDB will create '_id')
                const transformedData = reimbursementsData.map(item => {
                    const { id, submissionDate, ...rest } = item;
                    return {
                        ...rest,
                        // Convert amount to number if it's a string
                        amount: typeof rest.amount === 'string' ? parseFloat(rest.amount) : rest.amount,
                        // Ensure paid field exists
                        paid: item.paid !== undefined ? item.paid : (item.paymentStatus === 'Paid')
                    };
                });

                await Reimbursement.insertMany(transformedData);
                console.log(`✅ Migrated ${transformedData.length} reimbursements successfully`);
            } else {
                console.log('ℹ️  No reimbursements to migrate');
            }
        } else {
            console.log('⚠️  reimbursements.json not found, skipping reimbursement migration');
        }

        console.log('\n🎉 Migration completed successfully!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration error:', error);
        process.exit(1);
    }
};

migrateData();
