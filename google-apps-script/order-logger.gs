// Paste this into Extensions > Apps Script on the "Margreeta Orders" Google Sheet,
// then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
// Copy the resulting /exec URL into ORDER_LOG_ENDPOINT in GenZCart.jsx.
//
// Matches the existing "Orders" tab schema exactly:
// Date | Time | Order ID | Customer Name | Phone | Items Ordered | Total (EGP) |
// Pickup Location | Pickup Time | Payment Method | Notes |
// Margherita | Diavola | Funghi | Cheese Lovers | Hot Honey Pepperoni | Pastrami | Marinara | Veggi | Other | Total Pizzas

var PIZZA_COLUMNS = ['Margherita', 'Diavola', 'Funghi', 'Cheese Lovers', 'Hot Honey Pepperoni', 'Pastrami', 'Marinara', 'Veggi'];

function titleCase(str) {
  return String(str || '').replace(/\w\S*/g, function (t) {
    return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
  });
}

function buildItemsText(items) {
  return (items || []).map(function (i) {
    var line = i.qty + 'x ' + titleCase(i.name) + ' — ' + (i.qty * i.price) + ' EGP';
    if (i.extras && i.extras.length) line += ' (+ ' + i.extras.join(', ') + ')';
    return line;
  }).join('; ');
}

// Finds the last row that actually holds an order (column C starts with "MG-"),
// so new rows are inserted above any trailing notes at the bottom of the sheet.
function findLastOrderRow(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 1;
  var ids = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
  for (var i = ids.length - 1; i >= 0; i--) {
    if (typeof ids[i][0] === 'string' && ids[i][0].indexOf('MG-') === 0) return 2 + i;
  }
  return 1;
}

function doPost(e) {
  try {
    var order = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Orders') || ss.insertSheet('Orders');
    var tz = ss.getSpreadsheetTimeZone();

    var when = order.dateTime ? new Date(order.dateTime) : new Date();
    var localDateStr = Utilities.formatDate(when, tz, 'yyyy-MM-dd');
    var localTimeStr = Utilities.formatDate(when, tz, 'HH:mm:ss');
    var dateOnly = Utilities.parseDate(localDateStr + ' 00:00:00', tz, 'yyyy-MM-dd HH:mm:ss');
    var timeOnly = Utilities.parseDate('1899-12-30 ' + localTimeStr, tz, 'yyyy-MM-dd HH:mm:ss');

    var pizzaCounts = {};
    PIZZA_COLUMNS.forEach(function (name) { pizzaCounts[name.toLowerCase()] = 0; });
    var otherCount = 0;
    (order.items || []).forEach(function (i) {
      var key = String(i.name || '').trim().toLowerCase();
      if (pizzaCounts.hasOwnProperty(key)) pizzaCounts[key] += i.qty;
      else otherCount += i.qty;
    });

    var isPickup = order.fulfillment === 'pickup';
    var pickupLocationCell = isPickup
      ? (order.pickupLocation || '')
      : [order.address, order.compound].filter(Boolean).join(', ');
    var pickupTimeCell = isPickup ? (order.pickupTime || '') : '';
    var notesCell = isPickup
      ? (order.notes || '')
      : 'DELIVERY order (not pickup)' + (order.notes ? ' — ' + order.notes : '');

    var lastOrderRow = findLastOrderRow(sheet);
    sheet.insertRowAfter(lastOrderRow);
    var newRow = lastOrderRow + 1;

    sheet.getRange(newRow, 1, 1, 11).setValues([[
      dateOnly,
      timeOnly,
      order.orderId || '',
      order.customerName || '',
      order.phone || '',
      buildItemsText(order.items),
      order.total != null ? order.total : '',
      pickupLocationCell,
      pickupTimeCell,
      order.paymentMethod || '',
      notesCell,
    ]]);
    sheet.getRange(newRow, 1).setNumberFormat('yyyy-mm-dd');
    sheet.getRange(newRow, 2).setNumberFormat('hh:mm');

    var pizzaValues = PIZZA_COLUMNS.map(function (name) { return pizzaCounts[name.toLowerCase()]; });
    sheet.getRange(newRow, 12, 1, PIZZA_COLUMNS.length).setValues([pizzaValues]);
    sheet.getRange(newRow, 20).setValue(otherCount);
    sheet.getRange(newRow, 21).setFormula('=SUM(L' + newRow + ':T' + newRow + ')');

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
