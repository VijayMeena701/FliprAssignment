const util = require('util');
let db = require('../../utils/db-config');
db = util.promisify(db.query).bind(db);

exports.getShipmentDetailsByCityFilter = (req,res) => {
	const query = "SELECT customer_details.* FROM customer_details LEFT JOIN shipping_details ON shipping_details.customer_id = customer_details.customer_id WHERE shipping_details.city = ?";
	db(query,[req.params.id]).then(result => {
		if(result.length === 0) return res.status(404).json({message:'Not Found',data: result});
		return res.status(200).json({message:'OK',data: result});
	}).catch(err => {
		return res.status(400).json({message: 'Query Failed',error: err});
	})
};

exports.getCustomersWithAllPurchaseOrders = (req,res) => {
	const getCustomers = "select * from purchase_order left join customer_details on purchase_order.customer_id=customer_details.customer_id where exists (select * from customer_details where customer_details.customer_id = purchase_order.customer_id)";
	const response = [];
	db(getCustomers).then(result => {
		result.forEach(item => {
			const index = response.findIndex(x => x.customer_id === item.customer_id);
			if(index !== -1){
				const data = {
					purchase_order_id: item.purchase_order_id,
					product_name: item.product_name,
					quantity: item.quantity,
					mrp: item.mrp
				}
				response[index].purchase_order.push(data)
			}
			else {
				const data = {
					customer_id: item.customer_id,
					customer_name: item.customer_name,
					email: item.email,
					mobile_number: item.mobile_number,
					city: item.city,
					purchase_order:[
						{
							purchase_order_id: item.purchase_order_id,
							product_name: item.product_name,
							quantity: item.quantity,
							pricing: item.pricing,
							mrp: item.mrp
						}
					]
				}
				response.push(data);
			}
		});
		if(result.length === 0) return res.status(404).json({message:'Not Found',data: result});
		return res.status(200).json({message:'OK',data: response});
	}).catch(err => {
		return res.status(400).json({message: 'Query Failed',error: err});
	})
};

exports.getCustomersWithAllPurchaseOrdersAndShipmentDetails = (req,res) => {
	const query = "select C.*,P.*,S.address as shipping_address,S.city as shipping_city,S.pincode as shipping_pincode from purchase_order P left join customer_details C on P.customer_id=C.customer_id left join shipping_details S on S.purchase_order_id = P.purchase_order_id where exists(select * from customer_details where customer_details.customer_id=P.customer_id) and exists (select * from shipping_details where shipping_details.purchase_order_id = P.purchase_order_id)"
	const response = [];
	db(query).then(result => {
		result.forEach(item => {
			const customerIndex = response.findIndex(x => x.customer_id === item.customer_id);
			if(customerIndex !== -1){
				const purchaseOrderIndex = response[customerIndex].purchase_order.findIndex(x => x.purchase_order_id === item.purchase_order_id);
				if(purchaseOrderIndex !== -1){
					const shippingData = {
						address: item.shipping_address,
						city: item.shipping_city,
						pincode: item.shipping_pincode,
					}
					response[customerIndex].purchase_order[purchaseOrderIndex].push(shippingData)
				}
				else{
					const purchase_order = {
						purchase_order_id: item.purchase_order_id,
						product_name: item.product_name,
						quantity: item.quantity,
						pricing: item.pricing,
						mrp: item.mrp,
						shipping_details: [
							{
								address: item.shipping_address,
								city: item.shipping_city,
								pincode: item.shipping_pincode,
							}
						]
					}
					response[customerIndex].purchase_order.push(purchase_order);
				}
			}
			else {
				const newCustomer = {
					customer_id: item.customer_id,
					customer_name: item.customer_name,
					email: item.email,
					mobile_number: item.mobile_number,
					city:item.city,
					purchase_order: [
						{
							purchase_order_id: item.purchase_order_id,
							product_name: item.product_name,
							quantity: item.quantity,
							pricing: item.pricing,
							mrp: item.mrp,
							shipping_details: [
								{
									address: item.shipping_address,
									city: item.shipping_city,
									pincode: item.shipping_pincode,
								}
							]
						}
					]
				}
				response.push(newCustomer)
			}
		})
		return res.status(200).json({message:'OK',data: response});
	}).catch(err => {
		return res.status(400).json({message: 'Query Failed',error: err});
	})
}