const Shipment = require('../models/Shipment');
const Order = require('../models/Order');
const AuditLog = require('../models/AuditLog');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Get all shipments with carrier & status filters
 * @route   GET /api/logistics/shipments
 * @access  Private (All authenticated roles)
 */
exports.getShipments = async (req, res, next) => {
  try {
    const { status, carrier, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (carrier && carrier !== 'All') {
      query.carrier = carrier;
    }

    if (search) {
      query.$or = [
        { trackingNumber: { $regex: search, $options: 'i' } },
        { driverName: { $regex: search, $options: 'i' } },
        { vehicleNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Shipment.countDocuments(query);
    const shipments = await Shipment.find(query)
      .populate('order', 'orderNumber grandTotal status lineItems shippingAddress')
      .populate('customer', 'companyName contactPerson email phone')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));

    return res.status(200).json(
      ApiResponse.success(
        {
          shipments,
          pagination: {
            total,
            page: parseInt(page, 10),
            pages: Math.ceil(total / limit),
          },
        },
        'Shipments retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new shipment dispatch from Order
 * @route   POST /api/logistics/shipments
 * @access  Private (SuperAdmin, InventoryManager, BranchManager)
 */
exports.createShipment = async (req, res, next) => {
  try {
    const {
      orderId,
      carrier,
      serviceLevel,
      originBranch,
      destinationAddress,
      totalWeightKg,
      totalPackages,
      driverName,
      driverPhone,
      vehicleNumber,
      estimatedDeliveryDays,
      waybillNotes,
    } = req.body;

    const order = await Order.findById(orderId).populate('customer');
    if (!order) {
      return res.status(404).json(ApiResponse.error('Associated Order not found', 404));
    }

    const count = await Shipment.countDocuments();
    const trackingNumber = `TRK-${new Date().getFullYear()}-${String(count + 10001).padStart(6, '0')}`;
    const days = estimatedDeliveryDays || 3;
    const estimatedDelivery = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const shipment = await Shipment.create({
      trackingNumber,
      order: order._id,
      customer: order.customer._id,
      carrier: carrier || 'Nexus Fleet Transit',
      serviceLevel: serviceLevel || 'Standard Ground',
      originBranch: originBranch || 'Main Distribution Hub',
      destinationAddress: destinationAddress || order.shippingAddress,
      status: 'In Transit',
      estimatedDelivery,
      totalWeightKg: totalWeightKg || 45,
      totalPackages: totalPackages || 2,
      driverName: driverName || 'Marcus Vance',
      driverPhone: driverPhone || '+1 (555) 392-1084',
      vehicleNumber: vehicleNumber || 'NX-FREIGHT-802',
      waybillNotes,
      checkpoints: [
        {
          location: originBranch || 'Main Distribution Hub',
          statusDescription: 'Consignment packaged, sealed, and loaded onto carrier transit vehicle.',
          timestamp: new Date(),
        },
      ],
      createdBy: req.user._id,
    });

    // Advance order status to Shipped
    order.status = 'Shipped';
    await order.save();

    await AuditLog.create({
      action: 'DISPATCH_SHIPMENT',
      module: 'LOGISTICS',
      details: `Dispatched Shipment ${shipment.trackingNumber} for Order ${order.orderNumber} via ${shipment.carrier}`,
      performedBy: req.user._id,
      performedByName: req.user.fullName,
    });

    const populated = await Shipment.findById(shipment._id)
      .populate('order')
      .populate('customer');

    return res.status(201).json(ApiResponse.success(populated, 'Shipment dispatched successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update shipment tracking checkpoint & status
 * @route   PATCH /api/logistics/shipments/:id/status
 * @access  Private (SuperAdmin, InventoryManager, BranchManager)
 */
exports.updateShipmentStatus = async (req, res, next) => {
  try {
    const { status, checkpointLocation, checkpointNotes } = req.body;
    const shipment = await Shipment.findById(req.params.id).populate('order');

    if (!shipment) {
      return res.status(404).json(ApiResponse.error('Shipment record not found', 404));
    }

    shipment.status = status;

    if (checkpointLocation || checkpointNotes) {
      shipment.checkpoints.push({
        location: checkpointLocation || shipment.originBranch,
        statusDescription: checkpointNotes || `Status updated to ${status}`,
        timestamp: new Date(),
      });
    }

    if (status === 'Delivered') {
      shipment.actualDelivery = new Date();
      if (shipment.order) {
        const order = await Order.findById(shipment.order._id || shipment.order);
        if (order) {
          order.status = 'Delivered';
          await order.save();
        }
      }
    }

    await shipment.save();

    const updated = await Shipment.findById(shipment._id)
      .populate('order')
      .populate('customer');

    await AuditLog.create({
      action: 'UPDATE_SHIPMENT_STATUS',
      module: 'LOGISTICS',
      details: `Updated shipment ${shipment.trackingNumber} to ${status}`,
      performedBy: req.user._id,
      performedByName: req.user.fullName,
    });

    return res.status(200).json(ApiResponse.success(updated, `Shipment updated to ${status}`));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Carrier performance statistics
 * @route   GET /api/logistics/carriers
 * @access  Private
 */
exports.getCarriersOverview = async (req, res, next) => {
  try {
    const carriers = [
      {
        name: 'Nexus Fleet Transit',
        type: 'Internal Private Fleet',
        activeFleetUnits: 18,
        onTimeRate: '98.8%',
        avgDeliveryDays: 1.8,
        status: 'Operational',
      },
      {
        name: 'FedEx Enterprise',
        type: 'Express Air & Freight',
        activeFleetUnits: 42,
        onTimeRate: '97.2%',
        avgDeliveryDays: 1.2,
        status: 'Operational',
      },
      {
        name: 'DHL Global Express',
        type: 'Cross-Border Logistics',
        activeFleetUnits: 25,
        onTimeRate: '96.5%',
        avgDeliveryDays: 2.4,
        status: 'Operational',
      },
      {
        name: 'Union Freight Rail',
        type: 'Heavy Bulk Transit',
        activeFleetUnits: 8,
        onTimeRate: '94.0%',
        avgDeliveryDays: 4.5,
        status: 'Operational',
      },
    ];

    return res.status(200).json(ApiResponse.success(carriers, 'Carriers telemetry retrieved'));
  } catch (error) {
    next(error);
  }
};
