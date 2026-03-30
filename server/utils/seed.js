const Role = require('../models/Role');
const User = require('../models/User');
const Hall = require('../models/Hall');

const seedData = async () => {
  try {
    // Check if already seeded
    const existingAdmin = await Role.findOne({ name: 'Admin', isSystem: true });
    if (existingAdmin) {
      console.log('⚠️  Database already seeded. Skipping...');
      return;
    }

    // Create Admin Role with full access
    const modules = ['dashboard', 'bookings', 'events', 'accounts', 'expenses', 'hr', 'kitchen', 'settings'];
    const adminRole = await Role.create({
      name: 'Admin',
      description: 'Full system administrator with unrestricted access',
      permissions: modules.map(m => ({ module: m, access: 'full' })),
      isSystem: true,
      isActive: true
    });

    // Create Manager Role
    await Role.create({
      name: 'Manager',
      description: 'Can manage bookings, events, and view reports',
      permissions: [
        { module: 'dashboard', access: 'read' },
        { module: 'bookings', access: 'full' },
        { module: 'events', access: 'full' },
        { module: 'accounts', access: 'read' },
        { module: 'expenses', access: 'read' },
        { module: 'hr', access: 'read' },
        { module: 'kitchen', access: 'read' },
        { module: 'settings', access: 'none' }
      ],
      isActive: true
    });

    // Create Receptionist Role
    await Role.create({
      name: 'Receptionist',
      description: 'Can create and manage bookings',
      permissions: [
        { module: 'dashboard', access: 'read' },
        { module: 'bookings', access: 'full' },
        { module: 'events', access: 'read' },
        { module: 'accounts', access: 'none' },
        { module: 'expenses', access: 'none' },
        { module: 'hr', access: 'none' },
        { module: 'kitchen', access: 'none' },
        { module: 'settings', access: 'none' }
      ],
      isActive: true
    });

    // Create default Admin User
    await User.create({
      username: 'admin',
      email: 'admin@whms.com',
      password: 'admin123',
      fullName: 'System Administrator',
      role: adminRole._id,
      isActive: true
    });

    // Create sample halls
    await Hall.create([
      {
        name: 'Grand Hall',
        capacity: 500,
        description: 'Our largest and most luxurious hall, perfect for grand weddings',
        amenities: ['AC', 'Stage', 'Sound System', 'Parking', 'Bridal Room'],
        basePrice: 250000
      },
      {
        name: 'Royal Hall',
        capacity: 300,
        description: 'Elegant hall with premium décor and modern amenities',
        amenities: ['AC', 'Stage', 'Sound System', 'Parking'],
        basePrice: 180000
      },
      {
        name: 'Pearl Hall',
        capacity: 150,
        description: 'Intimate setting for smaller functions and gatherings',
        amenities: ['AC', 'Sound System', 'Parking'],
        basePrice: 100000
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('📋 Default Admin Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
  } catch (error) {
    console.error('❌ Seed Error:', error.message);
  }
};

module.exports = seedData;
