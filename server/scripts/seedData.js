/**
 * Enterprise Database Seeder
 * Populates realistic wholesale inventory SKUs, B2B clients, employee records,
 * suppliers, purchase orders, shipments, invoices, transactions, and notifications.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const EmployeeRecord = require('../models/EmployeeRecord');
const StockMovement = require('../models/StockMovement');
const Supplier = require('../models/Supplier');
const PurchaseOrder = require('../models/PurchaseOrder');
const Shipment = require('../models/Shipment');
const Invoice = require('../models/Invoice');
const PaymentTransaction = require('../models/PaymentTransaction');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
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
    currentStock: 5,
    reorderPoint: 8,
    unitOfMeasure: 'PCS',
    warehouseBin: 'Zone B - Bin 14',
    branch: 'Main Distribution Hub',
    description: '350 Bar continuous pressure heavy industrial fluid pump.',
  },
  {
    sku: 'LOG-PAL-WOOD',
    name: 'Heat-Treated Euro Spec Export Pallets (Bundle 50)',
    category: 'Packaging Materials',
    barcode: '8901234567895',
    costPrice: 600,
    sellingPrice: 950,
    currentStock: 250,
    reorderPoint: 50,
    unitOfMeasure: 'PALLET',
    warehouseBin: 'Zone C - Yard 01',
    branch: 'Main Distribution Hub',
    description: 'ISPM-15 certified stamped standard euro distribution pallets.',
  },
  {
    sku: 'LOG-STR-WRAP',
    name: 'Cast Stretch Wrap Film 80 Gauge (Bulk Pallet 48 Rolls)',
    category: 'Packaging Materials',
    barcode: '8901234567896',
    costPrice: 580,
    sellingPrice: 980,
    currentStock: 80,
    reorderPoint: 25,
    unitOfMeasure: 'PALLET',
    warehouseBin: 'Zone C - Bin 09',
    branch: 'East Coast Hub',
    description: 'Industrial strength puncture-resistant automated stretch film.',
  },
  {
    sku: 'AUT-ROB-ARM',
    name: '6-Axis High-Precision Articulated Robotic Arm',
    category: 'Industrial Hardware',
    barcode: '8901234567897',
    costPrice: 18500,
    sellingPrice: 26500,
    currentStock: 4,
    reorderPoint: 5,
    unitOfMeasure: 'PCS',
    warehouseBin: 'Zone D - High Bay 02',
    branch: 'Main Distribution Hub',
    description: 'Payload capacity 20kg with IP67 washdown rating controller.',
  },
];

const seedCustomers = [
  {
    companyName: 'Apex Robotics International Inc.',
    contactPerson: 'Sarah Jenkins',
    email: 'sjenkins@apexrobotics.io',
    phone: '+1 (415) 890-2341',
    taxId: 'US-TAX-8921849',
    tier: 'Platinum',
    creditLimit: 250000,
    outstandingBalance: 32000,
    paymentTerms: 'Net 30',
    billingAddress: {
      street: '450 Innovation Parkway, Suite 800',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
    },
    shippingAddress: {
      street: '120 Logistics Boulevard, Dock 4',
      city: 'Oakland',
      state: 'CA',
      postalCode: '94607',
      country: 'United States',
    },
  },
  {
    companyName: 'Titan Industrial Systems LLC',
    contactPerson: 'Marcus Vance',
    email: 'mvance@titanindustrial.com',
    phone: '+1 (312) 459-0021',
    taxId: 'US-TAX-3391820',
    tier: 'Platinum',
    creditLimit: 500000,
    outstandingBalance: 67500,
    paymentTerms: 'Net 60',
    billingAddress: {
      street: '8800 Heavy Machinery Way',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60609',
      country: 'United States',
    },
    shippingAddress: {
      street: '8800 Heavy Machinery Way, Gate 2',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60609',
      country: 'United States',
    },
  },
  {
    companyName: 'CloudGrid Datacenters Global',
    contactPerson: 'David Chen',
    email: 'dchen@cloudgridservers.com',
    phone: '+1 (206) 778-9102',
    taxId: 'US-TAX-7781923',
    tier: 'Gold',
    creditLimit: 350000,
    outstandingBalance: 118400,
    paymentTerms: 'Net 30',
    billingAddress: {
      street: '1001 Enterprise Blvd',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'United States',
    },
    shippingAddress: {
      street: '400 Data Way',
      city: 'Tukwila',
      state: 'WA',
      postalCode: '98188',
      country: 'United States',
    },
  },
];

const seedEmployees = [
  {
    employeeId: 'EMP-1001',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@bizcorenexus.com',
    department: 'Supply Chain & Logistics',
    designation: 'VP of Global Logistics',
    branch: 'Main Distribution Hub',
    shiftSchedule: 'General Day',
    salary: 145000,
    leaveAllocations: { casual: 12, sick: 10, annual: 20 },
  },
  {
    employeeId: 'EMP-1002',
    firstName: 'Darius',
    lastName: 'Vance',
    email: 'darius.vance@bizcorenexus.com',
    department: 'Warehouse Operations',
    designation: 'Senior Warehouse Lead',
    branch: 'Midwest Facility',
    shiftSchedule: 'Morning Shift',
    salary: 82000,
    leaveAllocations: { casual: 10, sick: 8, annual: 15 },
  },
  {
    employeeId: 'EMP-1003',
    firstName: 'Aaliyah',
    lastName: 'Patel',
    email: 'aaliyah.patel@bizcorenexus.com',
    department: 'Wholesale Sales & CRM',
    designation: 'Enterprise Account Executive',
    branch: 'Main Distribution Hub',
    shiftSchedule: 'General Day',
    salary: 110000,
    leaveAllocations: { casual: 12, sick: 10, annual: 18 },
  },
  {
    employeeId: 'EMP-1004',
    firstName: 'Liam',
    lastName: 'Gallagher',
    email: 'liam.gallagher@bizcorenexus.com',
    department: 'Human Resources',
    designation: 'Talent & People Ops Manager',
    branch: 'East Coast Hub',
    shiftSchedule: 'General Day',
    salary: 95000,
    leaveAllocations: { casual: 12, sick: 10, annual: 20 },
  },
];

const seedSuppliers = [
  {
    code: 'SUP-0101',
    name: 'Silicon Fabricators Global Ltd.',
    category: 'Electronics & Hardware',
    contactPerson: 'Kenji Takahashi',
    email: 'kenji@siliconfabricators.com',
    phone: '+1 (408) 555-0192',
    leadTimeDays: 5,
    rating: 4.9,
    paymentTerms: 'Net 30',
    address: { street: '100 Semi Conductor Blvd', city: 'San Jose', state: 'CA', country: 'United States' },
    notes: 'Primary supplier for enterprise GPU dies and microcontroller components.',
  },
  {
    code: 'SUP-0102',
    name: 'Apex Industrial Steel & Hydraulics',
    category: 'Industrial Machinery',
    contactPerson: 'Robert Sterling',
    email: 'rsterling@apexvalves.com',
    phone: '+1 (313) 555-8921',
    leadTimeDays: 7,
    rating: 4.7,
    paymentTerms: 'Net 60',
    address: { street: '77 Industrial Parkway', city: 'Detroit', state: 'MI', country: 'United States' },
    notes: 'High-pressure pneumatic cylinders and precision fluid actuators.',
  },
  {
    code: 'SUP-0103',
    name: 'EcoPack Cargo Logistics Materials',
    category: 'Packaging & Cargo',
    contactPerson: 'Maria Santos',
    email: 'maria@ecopackcargo.com',
    phone: '+1 (713) 555-4432',
    leadTimeDays: 3,
    rating: 4.8,
    paymentTerms: 'Net 15',
    address: { street: '420 Port Freight Ave', city: 'Houston', state: 'TX', country: 'United States' },
    notes: 'Heat-treated wooden export pallets and 80-gauge stretch wrap film.',
  },
];

const runSeed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in server/.env');
    }

    console.log('Connecting to MongoDB Atlas Cluster...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas.');

    // Clear existing operational collections
    await Promise.all([
      Product.deleteMany({}),
      Customer.deleteMany({}),
      Order.deleteMany({}),
      EmployeeRecord.deleteMany({}),
      StockMovement.deleteMany({}),
      Supplier.deleteMany({}),
      PurchaseOrder.deleteMany({}),
      Shipment.deleteMany({}),
      Invoice.deleteMany({}),
      PaymentTransaction.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);
    console.log('🧹 Cleaned existing operational data.');

    // 1. Seed Products
    const createdProducts = await Product.insertMany(
      seedProducts.map((p) => ({
        sku: p.sku,
        name: p.name,
        category: p.category,
        barcode: p.barcode,
        costPrice: p.costPrice,
        sellingPrice: p.sellingPrice,
        currentStock: p.currentStock,
        reorderPoint: p.reorderPoint,
        unitOfMeasure: p.unitOfMeasure,
        warehouseBin: p.warehouseBin,
        branch: p.branch,
        description: p.description,
        status: p.currentStock <= p.reorderPoint ? 'Low Stock' : 'In Stock',
      }))
    );
    console.log(`📦 Seeded ${createdProducts.length} Enterprise Inventory Products.`);

    // 2. Seed Customers
    const createdCustomers = await Customer.insertMany(seedCustomers);
    console.log(`🏢 Seeded ${createdCustomers.length} B2B Wholesale Customers.`);

    // 3. Seed Employees
    const createdEmployees = await EmployeeRecord.insertMany(
      seedEmployees.map((e) => ({
        employeeId: e.employeeId,
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        department: e.department,
        designation: e.designation,
        branch: e.branch,
        shiftSchedule: e.shiftSchedule,
        salary: e.salary,
        dateOfJoining: new Date(2023, 1, 15),
        leaveAllocations: e.leaveAllocations,
        emergencyContact: {
          name: 'Primary Contact',
          relationship: 'Spouse',
          phone: '+1 (555) 998-1029',
        },
      }))
    );
    console.log(`👥 Seeded ${createdEmployees.length} Staff Personnel Records.`);

    // 4. Seed Suppliers
    const createdSuppliers = await Supplier.insertMany(seedSuppliers);
    console.log(`🏭 Seeded ${createdSuppliers.length} Enterprise Suppliers.`);

    // 5. Seed Orders
    const sampleOrders = [
      {
        orderNumber: 'ORD-2026-90812',
        customer: createdCustomers[0]._id,
        customerName: createdCustomers[0].companyName,
        branch: 'Main Distribution Hub',
        items: [
          {
            product: createdProducts[0]._id,
            sku: createdProducts[0].sku,
            name: createdProducts[0].name,
            quantity: 3,
            unitPrice: 14800,
            discountPercentage: 0,
            total: 44400,
          },
          {
            product: createdProducts[2]._id,
            sku: createdProducts[2].sku,
            name: createdProducts[2].name,
            quantity: 5,
            unitPrice: 2200,
            discountPercentage: 0,
            total: 11000,
          },
        ],
        subtotal: 55400,
        taxAmount: 2216,
        shippingFee: 1200,
        totalAmount: 58816,
        status: 'Delivered',
        paymentStatus: 'Paid',
      },
      {
        orderNumber: 'ORD-2026-91402',
        customer: createdCustomers[1]._id,
        customerName: createdCustomers[1].companyName,
        branch: 'Midwest Facility',
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
        ],
        subtotal: 67500,
        taxAmount: 2700,
        shippingFee: 860,
        totalAmount: 71060,
        status: 'Shipped',
        paymentStatus: 'Unpaid',
      },
      {
        orderNumber: 'ORD-2026-92185',
        customer: createdCustomers[2]._id,
        customerName: createdCustomers[2].companyName,
        branch: 'Main Distribution Hub',
        items: [
          {
            product: createdProducts[1]._id,
            sku: createdProducts[1].sku,
            name: createdProducts[1].name,
            quantity: 20,
            unitPrice: 4850,
            discountPercentage: 0,
            total: 97000,
          },
        ],
        subtotal: 97000,
        taxAmount: 3880,
        shippingFee: 2400,
        totalAmount: 103280,
        status: 'Approved',
        paymentStatus: 'Unpaid',
      },
    ];

    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`📑 Seeded ${createdOrders.length} Wholesale Orders.`);

    // 6. Seed Purchase Orders
    const samplePOs = [
      {
        poNumber: 'PO-2026-01001',
        supplier: createdSuppliers[0]._id,
        destinationBranch: 'Main Distribution Hub',
        items: [
          {
            product: createdProducts[2]._id,
            sku: createdProducts[2].sku,
            name: createdProducts[2].name,
            unitCost: 1450,
            quantity: 20,
            total: 29000,
          },
        ],
        totalAmount: 29000,
        status: 'Issued',
        orderDate: new Date(),
        expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        notes: 'Replenish low-stock core fiber switches.',
      },
      {
        poNumber: 'PO-2026-01002',
        supplier: createdSuppliers[1]._id,
        destinationBranch: 'Midwest Facility',
        items: [
          {
            product: createdProducts[4]._id,
            sku: createdProducts[4].sku,
            name: createdProducts[4].name,
            unitCost: 2200,
            quantity: 15,
            total: 33000,
          },
        ],
        totalAmount: 33000,
        status: 'In Transit',
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        notes: 'Hydraulic pumps restock consignment.',
      },
    ];
    await PurchaseOrder.insertMany(samplePOs);
    console.log(`📋 Seeded ${samplePOs.length} Purchase Orders.`);

    // 7. Seed Shipments
    const sampleShipments = [
      {
        trackingNumber: 'TRK-2026-001001',
        order: createdOrders[0]._id,
        customer: createdCustomers[0]._id,
        carrier: 'Nexus Fleet Transit',
        serviceLevel: 'Next-Day Air',
        originBranch: 'Main Distribution Hub',
        destinationAddress: createdCustomers[0].shippingAddress,
        status: 'Delivered',
        dispatchDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        actualDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        totalWeightKg: 85,
        totalPackages: 4,
        driverName: 'Robert Vance',
        driverPhone: '+1 (415) 381-9920',
        vehicleNumber: 'NX-TRANSIT-01',
        checkpoints: [
          { location: 'Main Distribution Hub', statusDescription: 'Consignment packaged & loaded.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          { location: 'Oakland Logistics Gate 4', statusDescription: 'Delivered and signature captured.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        ],
      },
      {
        trackingNumber: 'TRK-2026-001002',
        order: createdOrders[1]._id,
        customer: createdCustomers[1]._id,
        carrier: 'FedEx Enterprise',
        serviceLevel: 'Standard Ground',
        originBranch: 'Midwest Facility',
        destinationAddress: createdCustomers[1].shippingAddress,
        status: 'In Transit',
        dispatchDate: new Date(),
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        totalWeightKg: 120,
        totalPackages: 8,
        driverName: 'Marcus Vance',
        driverPhone: '+1 (312) 890-1122',
        vehicleNumber: 'FDX-FREIGHT-882',
        checkpoints: [
          { location: 'Midwest Facility Yard', statusDescription: 'Departed sorting facility in transit.', timestamp: new Date() },
        ],
      },
    ];
    await Shipment.insertMany(sampleShipments);
    console.log(`🚚 Seeded ${sampleShipments.length} Logistics Freight Shipments.`);

    // 8. Seed Invoices & Transactions
    const sampleInvoices = [
      {
        invoiceNumber: 'INV-2026-001001',
        order: createdOrders[0]._id,
        customer: createdCustomers[0]._id,
        issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        items: createdOrders[0].items,
        subtotal: createdOrders[0].subtotal,
        taxAmount: createdOrders[0].taxAmount,
        shippingFee: createdOrders[0].shippingFee,
        grandTotal: createdOrders[0].totalAmount,
        amountPaid: createdOrders[0].totalAmount,
        balanceDue: 0,
        status: 'Paid',
        paymentTerms: 'Net 30',
      },
      {
        invoiceNumber: 'INV-2026-001002',
        order: createdOrders[1]._id,
        customer: createdCustomers[1]._id,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: createdOrders[1].items,
        subtotal: createdOrders[1].subtotal,
        taxAmount: createdOrders[1].taxAmount,
        shippingFee: createdOrders[1].shippingFee,
        grandTotal: createdOrders[1].totalAmount,
        amountPaid: 0,
        balanceDue: createdOrders[1].totalAmount,
        status: 'Unpaid',
        paymentTerms: 'Net 60',
      },
    ];
    const createdInvoices = await Invoice.insertMany(sampleInvoices);
    console.log(`💰 Seeded ${createdInvoices.length} Financial Invoices.`);

    // Seed Payment Transaction for paid invoice
    await PaymentTransaction.create({
      transactionId: 'TXN-2026-001001',
      invoice: createdInvoices[0]._id,
      customer: createdCustomers[0]._id,
      amount: createdInvoices[0].grandTotal,
      paymentMethod: 'Bank Wire',
      referenceNumber: 'WIRE-US-9812401',
      status: 'Success',
      notes: 'Payment settled via Chase Commercial Wire.',
    });
    console.log('💳 Seeded Payment Transactions.');

    // 9. Seed Notifications
    const sampleNotifications = [
      {
        title: 'Safety Stock Low Alert',
        message: '48-Port Managed Switch (ELEC-SW-48P) is below reorder point (8 remaining).',
        type: 'WARNING',
        category: 'INVENTORY',
        link: '/procurement',
      },
      {
        title: 'Wholesale Consignment Dispatched',
        message: 'Shipment TRK-2026-001002 dispatched via FedEx Enterprise to Titan Industrial.',
        type: 'INFO',
        category: 'LOGISTICS',
        link: '/logistics',
      },
      {
        title: 'Invoice Payment Settled',
        message: 'Received wire payment of $58,816.00 for Invoice INV-2026-001001 from Apex Robotics.',
        type: 'SUCCESS',
        category: 'FINANCE',
        link: '/finance',
      },
    ];
    await Notification.insertMany(sampleNotifications);
    console.log(`🔔 Seeded ${sampleNotifications.length} Notifications.`);

    console.log(`
======================================================
🎉 Phase 3 Full-Suite Database Seeding Complete!
======================================================
SKUs:          ${createdProducts.length}
Customers:     ${createdCustomers.length}
Employees:     ${createdEmployees.length}
Suppliers:     ${createdSuppliers.length}
Orders:        ${createdOrders.length}
POs:           ${samplePOs.length}
Shipments:     ${sampleShipments.length}
Invoices:      ${createdInvoices.length}
Notifications: ${sampleNotifications.length}
======================================================
    `);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
