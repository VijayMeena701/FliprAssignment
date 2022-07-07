const { getAllPurchaseOrders,
		getPurchaseOrdersByID,
		addNewPurchaseOrder } = require('./purchase-order-controller');

exports.purchaseOrderRoutes = (app) => {
	app.get('/purchase_order',getAllPurchaseOrders);
	app.get('/purchase_order/:id',getPurchaseOrdersByID);
	app.post('/purchase_order',addNewPurchaseOrder);
}