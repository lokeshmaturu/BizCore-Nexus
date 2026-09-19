/**
 * Enterprise Database Seeder
 * Populates realistic wholesale inventory SKUs, B2B clients, employee records, and orders.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const EmployeeRecord = require('../models/EmployeeRecord');
const StockMovement = require('../models/StockMovement');
const User = require('../models/User');

const seedProducts = [
  {
    sku: 'ELEC-GPU-4090',
    name: 'Apex RTX 4090 24GB Wholesale Pallet (8x Units)',
    category: 'Wholesale Electronics',
    barcode: '8901234567890',
    costPrice: 11200,
    sellingPrice: 14800,
    currentStock: 45,
    reorderPoint: 15,
    unitOfMeasure: 'PALLET',
    warehouseBin: 'Zone A - Bin 12',
    branch: 'Main Distribution Hub',
    description: 'Tier-1 enterprise compute GPUs with bulk manufacturer warranty.',
  },
  {
    sku: 'ELEC-SRV-SYS8',
    name: 'Dual Xeon 2U Rackmount Server Chassis',
    category: 'Wholesale Electronics',
    barcode: '8901234567891',
    costPrice: 3400,
    sellingPrice: 4850,
    currentStock: 18,
    reorderPoint: 10,
    unitOfMeasure: 'PCS',
    warehouseBin: 'Zone A - Bin 04',
    branch: 'East Coast Hub',
    description: 'Hot-swap redundant PSU enterprise storage server chassis.',
  },
  {
    sku: 'ELEC-SW-48P',
    name: '48-Port Managed 10GbE SFP+ Fiber Core Switch',
    category: 'Wholesale Electronics',
    barcode: '8901234567892',
    costPrice: 1450,
    sellingPrice: 2200,
    currentStock: 8,
    reorderPoint: 12,
    unitOfMeasure: 'PCS',
    warehouseBin: 'Zone A - Bin 08',
    branch: 'Main Distribution Hub',
    description: 'L3 routing enterprise rackmount core distribution switch.',
  },
  {
    sku: 'IND-PNU-VALV',
    name: 'Heavy-Duty Pneumatic Actuator Valves (Box of 20)',
    category: 'Industrial Hardware',
    barcode: '8901234567893',
    costPrice: 850,
    sellingPrice: 1350,
    currentStock: 120,
    reorderPoint: 30,
    unitOfMeasure: 'BOX',
    warehouseBin: 'Zone B - Bin 22',
    branch: 'Midwest Facility',
    description: 'Industrial high-pressure stainless steel automated valve assembly.',
  },
  {
    sku: 'IND-HYD-PUMP',
    name: 'Variable Displacement Hydraulic Piston Pump',
    category: 'Industrial Hardware',
    barcode: '8901234567894',
    costPrice: 2200,
    sellingPrice: 3400,
    currentStock: 6,
    reorderPoint: 8,
    unitOfMeasure: 'PCS',
    warehouseBin: 'Zone B - Bin 05',
    branch: 'Main Distribution Hub',
    description: 'High-torque hydraulic pressure system for manufacturing plants.',
  },
  {
    sku: 'AUTO-PLC-CORE',
    name: 'Industrial Modular PLC Controller Master Node',
    category: 'Automation Components',
    barcode: '8901234567895',
    costPrice: 1800,
    sellingPrice: 2650,
    currentStock: 34,
    reorderPoint: 15,
    unitOfMeasure: 'PCS',
    warehouseBin: 'Zone C - Bin 02',
    branch: 'West Coast Node',
    description: 'Deterministic real-time Ethernet industrial automation bus controller.',
  },
  {
    sku: 'PKG-PLT-WRAP',
    name: 'Industrial Stretch Film Wrap 500mm x 1500m (Pallet of 40)',
    category: 'Packaging Materials',
    barcode: '8901234567896',
    costPrice: 650,
    sellingPrice: 980,
    currentStock: 85,
    reorderPoint: 25,
    unitOfMeasure: 'PALLET',
    warehouseBin: 'Zone D - Bin 01',
    branch: 'Main Distribution Hub',
    description: 'Puncture-resistant high-tensile automated wrapping film.',
  },
  {
    sku: 'BLK-OIL-SYN',
    name: 'Full Synthetic Industrial Lubricant ISO 68 (208L Drum)',
    category: 'Bulk Consumer Goods',
    barcode: '8901234567897',
    costPrice: 420,
    sellingPrice: 690,
    currentStock: 65,
    reorderPoint: 20,
    unitOfMeasure: 'CARTON',
    warehouseBin: 'Zone D - Bin 14',
    branch: 'East Coast Hub',
    description: 'Heavy machinery lubricating oil for continuous distribution lines.',
  },
];

const seedCustomers = [
  {
    companyName: 'Metropolis Logistics Inc.',
    contactPerson: 'David Sterling',
    email: 'd.sterling@metropolislogistics.com',
    phone: '+1 (555) 234-8901',
    tier: 'Platinum',
    creditLimit: 250000,
    outstandingBalance: 148500,
    paymentTerms: 'Net 60',
    discountPercentage: 8,
    branch: 'East Coast Hub',
    status: 'Active',
  },
  {
    companyName: 'Pacific Retail Wholesale',
    contactPerson: 'Elena Rostova',
    email: 'elena@pacificretailgroup.com',
    phone: '+1 (555) 345-9012',
    tier: 'Gold',
    creditLimit: 150000,
    outstandingBalance: 76200,
    paymentTerms: 'Net 30',
    discountPercentage: 5,
    branch: 'Midwest Facility',
    status: 'Active',
  },
  {
    companyName: 'Summit Distribution Group',
    contactPerson: 'Arthur Pendelton',
    email: 'purchasing@summitdistribution.com',
    phone: '+1 (555) 456-0123',
    tier: 'Platinum',
    creditLimit: 300000,
    outstandingBalance: 230000,
    paymentTerms: 'Net 45',
    discountPercentage: 10,
    branch: 'Main Distribution Hub',
    status: 'Active',
  },
  {
    companyName: 'Apex Global Supply',
    contactPerson: 'Samantha Wei',
    email: 's.wei@apexsupply.com',
    phone: '+1 (555) 567-1234',
    tier: 'Gold',
    creditLimit: 120000,
    outstandingBalance: 94800,
    paymentTerms: 'Net 30',
    discountPercentage: 4,
    branch: 'West Coast Node',
    status: 'Active',
  },
  {
    companyName: 'Vanguard Industrial Parts',
    contactPerson: 'Marcus Thorne',
    email: 'mthorne@vanguardindustrial.com',
    phone: '+1 (555) 678-2345',
    tier: 'Silver',
    creditLimit: 80000,
    outstandingBalance: 32000,
    paymentTerms: 'Net 15',
    discountPercentage: 2,
    branch: 'Main Distribution Hub',
    status: 'Active',
  },
];

const seedEmployees = [
  {
    employeeId: 'EMP-1001',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@apexwholesale.com',
    department: 'Supply Chain & Logistics',
    designation: 'Senior Logistics Director',
    branch: 'Main Distribution Hub',
    employmentType: 'Full-Time',
    shift: 'Morning Shift (08:00 - 16:30)',
    monthlySalary: 9500,
    status: 'Active',
  },
  {
    employeeId: 'EMP-1002',
    firstName: 'Julian',
    lastName: 'Mercer',
    email: 'julian.mercer@apexwholesale.com',
    department: 'Warehouse Operations',
    designation: 'Warehouse Master Inventory Auditor',
    branch: 'Main Distribution Hub',
    employmentType: 'Full-Time',
    shift: 'Morning Shift (08:00 - 16:30)',
    monthlySalary: 7200,
    status: 'Active',
  },
  {
    employeeId: 'EMP-1003',
    firstName: 'Amara',
    lastName: 'Okafor',
    email: 'amara.okafor@apexwholesale.com',
    department: 'Wholesale Sales & CRM',
    designation: 'VP of Enterprise Accounts',
    branch: 'East Coast Hub',
    employmentType: 'Full-Time',
    shift: 'Flexible',
    monthlySalary: 11000,
    status: 'Active',
  },
  {
    employeeId: 'EMP-1004',
    firstName: 'Derek',
    lastName: 'Kowalski',
    email: 'derek.k@apexwholesale.com',
    department: 'Human Resources',
    designation: 'HR & Personnel Compliance Lead',
    branch: 'Main Distribution Hub',
    employmentType: 'Full-Time',
    shift: 'Morning Shift (08:00 - 16:30)',
    monthlySalary: 6800,
    status: 'Active',
  },
];

const runSeed = async () => {
  try {
    console.log('🌱 Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database.');

    // Clear existing operational collections
    try {
      await mongoose.connection.collection('employeerecords').dropIndexes();
    } catch {}

    await Promise.all([
      Product.deleteMany({}),
      Customer.deleteMany({}),
      Order.deleteMany({}),
      EmployeeRecord.deleteMany({}),
      StockMovement.deleteMany({}),
    ]);
    console.log('🧹 Cleaned existing operational collections.');

    // 1. Insert Products
    const createdProducts = await Product.insertMany(seedProducts);
    console.log(`📦 Seeded ${createdProducts.length} Inventory SKUs.`);

    // 2. Insert Customers
    const createdCustomers = await Customer.insertMany(seedCustomers);
    console.log(`🏢 Seeded ${createdCustomers.length} B2B Wholesale Customers.`);

    // 3. Insert Employees
    const employeesWithUser = seedEmployees.map((emp) => ({
      ...emp,
      user: new mongoose.Types.ObjectId(),
    }));
    const createdEmployees = await EmployeeRecord.insertMany(employeesWithUser);
    console.log(`👥 Seeded ${createdEmployees.length} Employee Records.`);

    // 4. Create Initial Wholesale Orders
    const sampleOrders = [
      {
        orderNumber: 'ORD-2026-89421',
        customer: createdCustomers[0]._id,
        customerName: createdCustomers[0].companyName,
        items: [
          {
            product: createdProducts[0]._id,
            sku: createdProducts[0].sku,
            name: createdProducts[0].name,
            quantity: 10,
            unitPrice: 14800,
            discountPercentage: 0,
            total: 148000,
          },
        ],
        subtotal: 148000,
        shippingFee: 500,
        totalAmount: 148500,
        status: 'Shipped',
        paymentStatus: 'Unpaid',
        branch: 'East Coast Hub',
        shippingMethod: 'Dedicated Freight Express',
        trackingNumber: 'TRK-9908234-US',
      },
      {
        orderNumber: 'ORD-2026-89420',
        customer: createdCustomers[1]._id,
        customerName: createdCustomers[1].companyName,
        items: [
          {
            product: createdProducts[3]._id,
            sku: createdProducts[3].sku,
            name: createdProducts[3].name,
            quantity: 50,
            unitPrice: 1350,
            discountPercentage: 0,
            total: 67500,
          },
          {
            product: createdProducts[6]._id,
            sku: createdProducts[6].sku,
            name: createdProducts[6].name,
            quantity: 8,
            unitPrice: 980,
            discountPercentage: 0,
            total: 7840,
          },
        ],
        subtotal: 75340,
        shippingFee: 860,
        totalAmount: 76200,
        status: 'Processing',
        paymentStatus: 'Unpaid',
        branch: 'Midwest Facility',
      },
      {
        orderNumber: 'ORD-2026-89419',
        customer: createdCustomers[2]._id,
        customerName: createdCustomers[2].companyName,
        items: [
          {
            product: createdProducts[1]._id,
            sku: createdProducts[1].sku,
            name: createdProducts[1].name,
            quantity: 45,
            unitPrice: 4850,
            discountPercentage: 0,
            total: 218250,
          },
        ],
        subtotal: 218250,
        shippingFee: 11750,
        totalAmount: 230000,
        status: 'Approved',
        paymentStatus: 'Unpaid',
        branch: 'Main Distribution Hub',
      },
    ];

    await Order.insertMany(sampleOrders);
    console.log(`📑 Seeded ${sampleOrders.length} Wholesale Orders with Live Invoicing.`);

    console.log(`
🎉 Phase 2 Enterprise Database Seeding Complete!
======================================================
SKUs:        ${createdProducts.length}
Accounts:    ${createdCustomers.length}
Personnel:   ${createdEmployees.length}
Orders:      ${sampleOrders.length}
======================================================
    `);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
