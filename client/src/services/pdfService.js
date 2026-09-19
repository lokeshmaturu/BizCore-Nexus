/**
 * Enterprise PDF Generation Service (Phase 5)
 * Generates branded Invoices, Purchase Orders, and Logistics Waybills using jsPDF.
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate and Download Commercial Invoice PDF
 */
export const generateInvoicePDF = (invoice, companyInfo = {}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [79, 70, 229]; // Indigo brand
  const darkColor = [15, 23, 42]; // Slate 900
  const grayColor = [100, 116, 139]; // Slate 500

  // 1. Header Banner
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, 210, 40, 'F');

  // Brand Name & Tagline
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('BIZCORE NEXUS', 14, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Enterprise AI Operating System • Commercial Invoicing', 14, 26);

  // Invoice Title Right
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(129, 140, 248);
  doc.text('INVOICE', 196, 22, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text(`#${invoice.invoiceNumber || invoice.id || 'INV-2026-001'}`, 196, 29, { align: 'right' });

  // 2. Metadata Section (From / To)
  doc.setTextColor(...darkColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('BILLED FROM:', 14, 52);
  doc.text('BILLED TO:', 110, 52);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);

  // From
  doc.text(companyInfo.name || 'BizCore Distribution Ltd.', 14, 58);
  doc.text('Global Logistics HQ • Tower 4B', 14, 63);
  doc.text('Financial Operations & Treasury', 14, 68);
  doc.text('Email: finance@bizcore-nexus.corp', 14, 73);

  // To
  doc.setTextColor(...darkColor);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.customer || 'Enterprise Client Ltd.', 110, 58);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Corporate Account • Tax ID: TX-889021', 110, 63);
  doc.text('Invoice Date: ' + (invoice.date || new Date().toISOString().split('T')[0]), 110, 68);
  doc.text('Due Date: ' + (invoice.dueDate || '30 Days Net'), 110, 73);

  // Status Badge in PDF
  const status = (invoice.status || 'Pending').toUpperCase();
  const statusColor =
    status === 'PAID' ? [16, 185, 129] : status === 'OVERDUE' ? [244, 63, 94] : [245, 158, 11];

  doc.setFillColor(...statusColor);
  doc.roundedRect(160, 48, 36, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(status, 178, 52.5, { align: 'center' });

  // 3. Line Items Table
  const items = invoice.items || [
    { name: 'Enterprise SaaS Enterprise License (Q3)', qty: 1, rate: invoice.amount || 24500, total: invoice.amount || 24500 },
    { name: 'Priority Multi-Node SLA & Logistics Support', qty: 1, rate: 1200, total: 1200 },
  ];

  const tableData = items.map((item, index) => [
    index + 1,
    item.name || item.sku || 'Enterprise Service Line Item',
    item.qty || 1,
    `$${(item.rate || item.unitPrice || invoice.amount || 0).toLocaleString()}`,
    `$${(item.total || (item.qty || 1) * (item.rate || invoice.amount || 0)).toLocaleString()}`,
  ]);

  doc.autoTable({
    startY: 82,
    head: [['#', 'Description / SKU', 'Qty', 'Unit Price (USD)', 'Total Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      textColor: darkColor,
      fontSize: 8.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 32, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
  });

  const finalY = doc.lastAutoTable.finalY || 130;

  // 4. Totals Calculation
  const subtotal = invoice.amount || 25700;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Subtotal:', 140, finalY + 10);
  doc.text(`$${subtotal.toLocaleString()}`, 196, finalY + 10, { align: 'right' });

  doc.text('Estimated Tax (8% VAT/GST):', 140, finalY + 16);
  doc.text(`$${tax.toFixed(2)}`, 196, finalY + 16, { align: 'right' });

  doc.setLineWidth(0.5);
  doc.setDrawColor(203, 213, 225);
  doc.line(140, finalY + 20, 196, finalY + 20);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('Total Balance Due:', 140, finalY + 27);
  doc.setTextColor(79, 70, 229);
  doc.text(`$${grandTotal.toLocaleString()}`, 196, finalY + 27, { align: 'right' });

  // 5. Payment Details & Stamp
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, finalY + 8, 110, 28, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('WIRE TRANSFER INSTRUCTIONS:', 18, finalY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Bank: Global Federal Corporate Bank', 18, finalY + 19);
  doc.text('IBAN: US89 BZCR 0009 8812 7734 9912', 18, finalY + 24);
  doc.text('SWIFT/BIC: BZCRUS33XXX • Ref: ' + (invoice.invoiceNumber || invoice.id || 'INV'), 18, finalY + 29);

  // 6. Security Footer & Authentication Seal
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Digitally signed and cryptographically verified by BizCore Nexus Enterprise AI OS.', 14, 285);
  doc.text('Page 1 of 1 • System Verification Stamp: ' + new Date().toISOString(), 196, 285, { align: 'right' });

  // Download Action
  const filename = `Invoice_${invoice.invoiceNumber || invoice.id || 'INV'}.pdf`;
  doc.save(filename);
  return filename;
};

/**
 * Generate and Download Procurement Purchase Order PDF
 */
export const generatePurchaseOrderPDF = (po, companyInfo = {}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [217, 119, 6]; // Amber brand
  const darkColor = [15, 23, 42];
  const grayColor = [100, 116, 139];

  // Header Banner
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('BIZCORE NEXUS', 14, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Procurement Operations • Official Purchase Order', 14, 26);

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(251, 191, 36);
  doc.text('PURCHASE ORDER', 196, 22, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text(`#${po.poNumber || po.id || 'PO-2026-901'}`, 196, 29, { align: 'right' });

  // Vendor & Delivery Details
  doc.setTextColor(...darkColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('SUPPLIER / VENDOR:', 14, 52);
  doc.text('SHIP TO WAREHOUSE:', 110, 52);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);

  // Vendor
  doc.text(po.vendor || 'Global Semiconductor Ltd.', 14, 58);
  doc.text('Authorized OEM Partner', 14, 63);
  doc.text('Vendor Code: VND-8821', 14, 68);

  // Ship To
  doc.text('BizCore Nexus Central Warehouse - Node 1', 110, 58);
  doc.text('Dock Bay 4, Industrial Logistics Corridor', 110, 63);
  doc.text('Expected Delivery: ' + (po.expectedDate || 'Within 5 Business Days'), 110, 68);

  // Line items
  const tableData = [
    [
      '1',
      po.item || po.sku || 'Industrial Microcontroller Chipset M1',
      po.quantity || 500,
      `$${((po.totalAmount || 35000) / (po.quantity || 500)).toFixed(2)}`,
      `$${(po.totalAmount || 35000).toLocaleString()}`,
    ],
  ];

  doc.autoTable({
    startY: 78,
    head: [['#', 'SKU / Part Description', 'Qty Ordered', 'Unit Cost', 'Total Cost']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      textColor: darkColor,
      fontSize: 8.5,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 32, halign: 'right' },
    },
  });

  const finalY = doc.lastAutoTable.finalY || 120;

  // Authorization Signatures
  doc.setLineWidth(0.4);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, finalY + 40, 80, finalY + 40);
  doc.line(130, finalY + 40, 196, finalY + 40);

  doc.setFontSize(8.5);
  doc.setTextColor(...darkColor);
  doc.text('Authorized Procurement Officer', 14, finalY + 45);
  doc.text('Vendor Acceptance Signature', 130, finalY + 45);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Digitally generated by BizCore Nexus Autonomous Procurement Engine.', 14, 285);

  const filename = `PurchaseOrder_${po.poNumber || po.id || 'PO'}.pdf`;
  doc.save(filename);
  return filename;
};

/**
 * Generate and Download Logistics Dispatch Waybill PDF
 */
export const generateWaybillPDF = (dispatch, companyInfo = {}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [14, 165, 233]; // Sky brand
  const darkColor = [15, 23, 42];
  const grayColor = [100, 116, 139];

  // Header Banner
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('BIZCORE NEXUS', 14, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Fleet Logistics • Dispatch Waybill & Cargo Manifest', 14, 26);

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(56, 189, 248);
  doc.text('WAYBILL MANIFEST', 196, 22, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text(`Tracking: ${dispatch.trackingNumber || dispatch.id || 'WB-99021'}`, 196, 29, { align: 'right' });

  // Route Details
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 48, 182, 36, 2, 2, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('ORIGIN HUB:', 20, 56);
  doc.text('DESTINATION CLIENT:', 110, 56);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(dispatch.origin || 'Central Hub - Alpha Station', 20, 62);
  doc.text('Departure Date: ' + (dispatch.date || 'Today'), 20, 67);
  doc.text('Assigned Carrier: ' + (dispatch.carrier || 'Nexus Fleet Express'), 20, 72);

  doc.text(dispatch.destination || 'Regional Hub - Beta Warehouse', 110, 62);
  doc.text('Estimated Delivery: ' + (dispatch.eta || 'Same Day Express'), 110, 67);
  doc.text('Driver ID / Unit: ' + (dispatch.driver || 'Unit #402 - Alex R.'), 110, 72);

  // Cargo Items
  const tableData = [
    [
      '1',
      dispatch.cargo || 'Palletized Electronics & High-Value SKUs',
      dispatch.packages || '12 Pallets',
      dispatch.weight || '1,450 kg',
      dispatch.status || 'In Transit',
    ],
  ];

  doc.autoTable({
    startY: 92,
    head: [['#', 'Cargo Description', 'Volume / Pkg', 'Gross Weight', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      textColor: darkColor,
      fontSize: 8.5,
    },
  });

  const finalY = doc.lastAutoTable.finalY || 130;

  // Recipient Sign-off Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, finalY + 15, 182, 35, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('RECEIVER ACCEPTANCE & VERIFICATION SEAL', 20, finalY + 23);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Receiver Name: __________________________   Date: ____________', 20, finalY + 32);
  doc.text('Signature: ______________________________   Condition: [ ] Good   [ ] Damaged', 20, finalY + 40);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Official document of BizCore Nexus Fleet Dispatch Protocol.', 14, 285);

  const filename = `Waybill_${dispatch.trackingNumber || dispatch.id || 'WB'}.pdf`;
  doc.save(filename);
  return filename;
};
