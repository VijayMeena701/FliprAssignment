const { getAllCustomers,
		getCustomerDetailsByID,
		addNewCustomer } = require('./customer-controller');

exports.customerRoutes = (app) => {
	app.get('/customers',getAllCustomers);
	app.get('/customers/:id',getCustomerDetailsByID);
	app.post('/customers',addNewCustomer);
}