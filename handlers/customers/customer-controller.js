const util = require('util');
let db = require('../../utils/db-config');
db = util.promisify(db.query).bind(db);
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(128, UIDGenerator.BASE58);
const { isEmpty,validateObject } = require('../../utils/validator');

exports.getAllCustomers = (req,res) => {
	const query = "SELECT * FROM customer_details";
	db(query).then(result => {
		return res.status(200).json({message:'OK',data: result});
	}).catch(err => {
		return res.status(400).json({message: 'Query Failed',error: err});
	})
}

exports.getCustomerDetailsByID = (req,res) => {
	const query = "SELECT * FROM customer_details WHERE customer_id = ?";
	db(query,[req.params.id]).then(result => {
		return res.status(200).json({message:'OK',data: result});
	}).catch(err => {
		return res.status(400).json({message: 'Query Failed',error: err});
	})
}

exports.addNewCustomer = (req,res) => {
	if(Object.keys(req.body).length > 0){
		const query = "INSERT INTO customer_details SET ?";
		const data = {
			customer_name : req.body.customer_name,
			email : req.body.email,
			mobile_number : req.body.mobile_number,
			city : req.body.city
		}
		const {errors,valid} = validateObject(data);
		if(!valid)
			return res.status(422).json({message: "Validation Failed",error:errors});
		let error;
		uidgen.generate().catch(err => {
			error = {status:503,message:'UID generation failed',error:err}
			return Promise.reject();
		}).then(uid => {
			data.customer_id = uid
			return db(query,data)
		}).catch(err => {
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