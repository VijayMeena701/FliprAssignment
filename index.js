require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const db = require('./utils/db-config');
const { customerRoutes} = require('./handlers/customers');
const { purchaseOrderRoutes } = require('./handlers/purchase-order');
const { shippingDetailsRoutes } = require('./handlers/shipping-details');
const { customControllerRoutes } = require('./handlers/custom-controller');
const PORT = process.env.PORT

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));
app.use(cors());

app.get('/',(req,res) => res.status(200).json({message:"Success"}))
customerRoutes(app);
purchaseOrderRoutes(app);
shippingDetailsRoutes(app);
customControllerRoutes(app);

app.listen(PORT, () => console.log(`server started on port ${PORT}`))