const { getAllShippingDetails,
		getShippingDetailsByCustomerID,
		addNewShippingDetails } = require('./shipping-details-controllers');

exports.shippingDetailsRoutes = (app) => {
	app.get('/shipping',getAllShippingDetails);
	app.get('/shipping/:id',getShippingDetailsByCustomerID);
	app.post('/shipping',addNewShippingDetails);
}