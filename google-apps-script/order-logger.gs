// Paste this into Extensions > Apps Script on the Google Sheet you want orders logged to,
// then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
// Copy the resulting /exec URL into ORDER_LOG_ENDPOINT in GenZCart.jsx.
function doPost(e) {
  try {
    var order = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders')
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Orders');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Order ID', 'Date/Time', 'Customer Name', 'Phone Number', 'Items',
        'Total (EGP)', 'Delivery Address', 'Compound', 'Pickup Location', 'Pickup Time',
        'Payment Method', 'Notes', 'Language']);
    }

    var itemsText = (order.items || []).map(function (i) {
      var line = i.qty + 'x ' + i.name + ' (' + i.price + ' EGP each)';
      if (i.extras && i.extras.length) line += ' + ' + i.extras.join(', ');
      return line;
    }).join('; ');

    sheet.appendRow([
      order.orderId || '',
      order.dateTime || new Date().toISOString(),
      order.customerName || '',
      order.phone || '',
      itemsText,
      order.total != null ? order.total : '',
      order.fulfillment === 'delivery' ? (order.address || '') : '',
      order.fulfillment === 'delivery' ? (order.compound || '') : '',
      order.fulfillment === 'pickup' ? (order.pickupLocation || '') : '',
      order.fulfillment === 'pickup' ? (order.pickupTime || '') : '',
      order.paymentMethod || '',
      order.notes || '',
      order.lang || '',
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
