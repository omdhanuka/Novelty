import React, { useRef } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Invoice = ({ order, settings, onClose }) => {
  const invoiceRef = useRef();

  // Generate invoice number
  const generateInvoiceNumber = () => {
    if (!settings?.invoiceSettings) {
      return 'INV-000123';
    }
    const { prefix = 'INV', startingNumber = 1000 } = settings.invoiceSettings;
    // Extract number from order number and add to starting number
    const orderNum = parseInt(order.orderNumber.replace(/\D/g, '').slice(-4)) || 0;
    const invoiceNum = startingNumber + orderNum;
    return `${prefix}-${invoiceNum.toString().padStart(6, '0')}`;
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  // Print invoice
  const handlePrint = () => {
    const printContent = invoiceRef.current;
    const printWindow = window.open('', '', 'height=800,width=600');
    
    printWindow.document.write('<html><head><title>Invoice</title>');
    printWindow.document.write(`
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #1a1a1a;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .invoice-container {
          width: 148mm;
          min-height: 210mm;
          margin: 0 auto;
          padding: 20px;
          background: white;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        .company-name {
          font-size: 32px;
          font-weight: 700;
          font-family: 'Playfair Display', serif;
          color: #1a1a1a;
        }
        .company-details {
          text-align: right;
          font-size: 11px;
          color: #6b7280;
          line-height: 1.6;
        }
        .company-details-item {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
          margin-bottom: 2px;
        }
        .invoice-title-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }
        .invoice-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .invoice-details {
          background: #f9fafb;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 11px;
          min-width: 200px;
        }
        .invoice-detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .invoice-detail-row:last-child {
          margin-bottom: 0;
        }
        .invoice-detail-label {
          color: #6b7280;
        }
        .invoice-detail-value {
          font-weight: 600;
          color: #1a1a1a;
        }
        .billing-section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
        .billing-name {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        .billing-details {
          font-size: 11px;
          color: #6b7280;
          line-height: 1.6;
        }
        .contact-info {
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .products-table thead {
          background: #f9fafb;
        }
        .products-table th {
          padding: 10px 8px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .products-table th:last-child,
        .products-table td:last-child {
          text-align: right;
        }
        .products-table td {
          padding: 12px 8px;
          font-size: 11px;
          color: #1a1a1a;
          border-bottom: 1px solid #f3f4f6;
        }
        .product-row {
          vertical-align: top;
        }
        .product-info {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .product-image {
          width: 40px;
          height: 40px;
          background: #000;
          border-radius: 4px;
          flex-shrink: 0;
          object-fit: cover;
        }
        .product-details {
          flex: 1;
        }
        .product-name {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 2px;
        }
        .product-meta {
          font-size: 10px;
          color: #9ca3af;
        }
        .totals-section {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
        }
        .totals-table {
          width: 280px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 12px;
        }
        .total-row.subtotal,
        .total-row.shipping,
        .total-row.tax {
          color: #6b7280;
          border-bottom: 1px solid #f3f4f6;
        }
        .total-row.final {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          padding-top: 12px;
          border-top: 2px solid #1a1a1a;
          margin-top: 8px;
        }
        .payment-section {
          margin: 25px 0;
          padding: 15px;
          background: #f9fafb;
          border-radius: 6px;
        }
        .payment-title {
          font-size: 12px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        .payment-method {
          font-size: 11px;
          color: #6b7280;
        }
        .footer-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }
        .thank-you {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
        .support-text {
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        .contact-details {
          font-size: 11px;
          color: #6b7280;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .invoice-container {
            margin: 0;
          }
        }
      </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Get store details
  const storeName = settings?.storeName || 'Bagvo';
  const storeAddress = settings?.storeAddress || {
    line1: '123 Fashion Ave',
    city: 'Bag City',
    state: 'BC',
    pincode: '12345'
  };
  const storePhone = settings?.storePhone || '+91 12345 67890';
  const storeEmail = settings?.storeEmail || 'support@bagvo.com';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Invoice</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div ref={invoiceRef} className="invoice-container" style={{ width: '148mm', minHeight: '210mm', margin: '0 auto', padding: '20px', background: 'white' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', fontFamily: 'Playfair Display, serif', color: '#1a1a1a' }}>
                {storeName}
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#6b7280', lineHeight: '1.6' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginBottom: '2px' }}>
                  <MapPin size={12} />
                  <span>{storeAddress.line1},</span>
                </div>
                <div style={{ paddingLeft: '16px' }}>{storeAddress.city}, {storeAddress.state} {storeAddress.pincode}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
                  <Phone size={12} />
                  <span>{storePhone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                  <Mail size={12} />
                  <span>{storeEmail}</span>
                </div>
              </div>
            </div>

            {/* Invoice Title and Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>
                Invoice
              </div>
              <div style={{ background: '#f9fafb', padding: '12px 16px', borderRadius: '6px', fontSize: '11px', minWidth: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#6b7280' }}>Invoice No:</span>
                  <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{generateInvoiceNumber()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#6b7280' }}>Invoice Date:</span>
                  <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{formatDate(order.createdAt)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Order ID:</span>
                  <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{order.orderNumber}</span>
                </div>
              </div>
            </div>

            {/* Billing To */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                Billing To
              </div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                {order.shippingAddress.fullName}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                Phone Email
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.6' }}>
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                <br />
                Phone: {order.shippingAddress.phone}
                {order.user?.email && (
                  <>
                    <br />
                    {order.user.email}
                  </>
                )}
              </div>
            </div>

            {/* Products Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '10px 8px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Product</th>
                  <th style={{ padding: '10px 8px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Qty</th>
                  <th style={{ padding: '10px 8px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Price</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} style={{ verticalAlign: 'top' }}>
                    <td style={{ padding: '12px 8px', fontSize: '11px', color: '#1a1a1a', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{ width: '40px', height: '40px', background: '#000', borderRadius: '4px', flexShrink: '0', overflow: 'hidden' }}>
                          <img 
                            src={item.normalizedImage || item.image} 
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                        <div style={{ flex: '1' }}>
                          <div style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '2px' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                            {item.selectedColor && `Color: ${item.selectedColor}`}
                            {item.selectedSize && ` • Size: ${item.selectedSize}`}
                            {item.quantity > 1 && ` • Qty: ${item.quantity}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '11px', color: '#1a1a1a', borderBottom: '1px solid #f3f4f6' }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '11px', color: '#1a1a1a', borderBottom: '1px solid #f3f4f6' }}>
                      {formatCurrency(item.price)}
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '11px', color: '#1a1a1a', borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '280px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '12px', color: '#6b7280', borderBottom: '1px solid #f3f4f6' }}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.itemsPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '12px', color: '#6b7280', borderBottom: '1px solid #f3f4f6' }}>
                  <span>Shipping</span>
                  <span>{formatCurrency(order.shippingPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '12px', color: '#6b7280', borderBottom: '1px solid #f3f4f6' }}>
                  <span>Tax (GST)</span>
                  <span>{formatCurrency(order.taxPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '16px', fontWeight: '700', color: '#1a1a1a', borderTop: '2px solid #1a1a1a', marginTop: '8px' }}>
                  <span>Total Amount</span>
                  <span>{formatCurrency(order.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ margin: '25px 0', padding: '15px', background: '#f9fafb', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                Payment Method
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                Thank you for your purchase!
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>
                Have questions? Please contact our support team.
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                Email: {storeEmail} | Phone: {storePhone}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
