import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const normalizeAddressTypes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users with addresses
    const users = await User.find({ 'addresses.0': { $exists: true } });
    console.log(`📦 Found ${users.length} users with addresses`);

    let updatedCount = 0;

    for (const user of users) {
      let hasChanges = false;

      // Normalize each address type to lowercase
      user.addresses.forEach((addr) => {
        if (addr.type && addr.type !== addr.type.toLowerCase()) {
          console.log(`  🔧 Normalizing address type: "${addr.type}" -> "${addr.type.toLowerCase()}" for user ${user.email}`);
          addr.type = addr.type.toLowerCase();
          hasChanges = true;
        }
      });

      // Save if any changes were made
      if (hasChanges) {
        await user.save();
        updatedCount++;
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Updated ${updatedCount} user(s)`);
    console.log(`   Total addresses checked: ${users.reduce((acc, u) => acc + u.addresses.length, 0)}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run the migration
normalizeAddressTypes();
