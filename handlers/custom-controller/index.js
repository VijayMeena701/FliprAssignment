const { getShipmentDetailsByCityFilter,
		getCustomersWithAllPurchaseOrders,
		getCustomersWithAllPurchaseOrdersAndShipmentDetails } = require('./custom-controller');

exports.customControllerRoutes = (app) => {
	app.get('/shipping/city/:id',getShipmentDetailsByCityFilter);
	app.get('/customer/purchase-orders',getCustomersWithAllPurchaseOrders);
	app.get('/customer/purchase-orders/shipping',getCustomersWithAllPurchaseOrdersAndShipmentDetails);
}