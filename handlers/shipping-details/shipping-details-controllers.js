const util = require('util');
let db = require('../../utils/db-config');
db = util.promisify(db.query).bind(db);
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(128, UIDGenerator.BASE58);
const { isEmpty,validateObject } = require('../../utils/validator');

exports.getAllShippingDetails = (req,res) => {
	const query = "SELECT * FROM shipping_details";
	db(query).then(result => {
		if(result.length === 0) return res.status(404).json({message:'Not Found',data: result});
		return res.status(200).json({message:'OK',data: result});
	}).catch(err => {
		return res.status(400).json({message: 'Query Failed',error: err});
	})
}

exports.getShippingDetailsByCustomerID = (req,res) => {
	const query = "SELECT * FROM shipping_details WHERE customer_id = ?";
	db(query,[req.params.id]).then(result => {
		if(result.length === 0) return res.status(404).json({message:'Not Found',data: result});
		return res.status(200).json({message:'OK',data: result});
	}).catch(err => {
		return res.status(400).json({message: 'Query Failed',error: err});
	})
}

exports.addNewShippingDetails = (req,res) => {
	if(Object.keys(req.body).length > 0){
		const query = "INSERT INTO shipping_details SET ?";
		const data = {
			address : req.body.address,
			city : req.body.city,
			pincode : req.body.pincode,
			purchase_order_id : req.body.purchase_order_id,
			customer_id : req.body.customer_id,
		}
		const {errors,valid} = validateObject(data);
		if(!valid)
			return res.status(422).json({message: "Validation Failed",error:errors});
		let error;
		db(query,data).catch(err => {
			if(err.code === "ER_DUP_ENTRY") error = {status:409,message:'Query Failed',error:{code: err.errno,message: err.sqlMessage}};
			else error = {status:400,message:'Query Failed',error:err};
			return Promise.reject();
		}).then(result => {
			return res.status(200).json({message: "Data Added Successfully",data:data});
		}).catch(err => {
			return res.status(error.status).json({message:error.message,error:error.error});
		})
	} else {
		return res.status(422).json({message:"Cannot Process request",error:"body received is null"})
	}
}