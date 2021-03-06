// About server.js
// This file contains a series of API and backend functions 
// used to serve data to the front end and process changes to the databases

const express = require('express'); //Line 1
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3
const mysql = require('mysql');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Enterprise search
const AppSearchClient = require('@elastic/app-search-node')
const apiKey = 'private-3gtefuokjhicde8at5oyz1re'
const baseUrlFn = () => 'http://192.168.44.132:3002/api/as/v1/'
const client = new AppSearchClient(undefined, apiKey, baseUrlFn)
const engineName = 'ims-search-engine'

const axios = require('axios');

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

// Used for returning JSON to the API caller (typically front end)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// DB connection configration
const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'ims_proto',
});



//Authentication handling, issue token upon successful password verification
app.use('/login', (req, res) => {

  const user = req.body.username
  const pass = req.body.password

  const AUTH_FAILURE = { error: "Auth failure" }


  let sql = `select su.*, r.content, r.role_name from sys_users su
  LEFT JOIN sys_user_roles r on su.role = r.id
  where email = ? and active = 1 limit 1`

  if (pass === '' || user === '') {
    res.status(401).json(AUTH_FAILURE)
  } else {

    db.query(sql, user,
      (error, results) => {
        if (error) {
          res.send({ err: error })
        }
        //If (results) and password match, sign token
        if (results.length > 0 && verifyPass(pass, results[0].password)) {
          console.log(results)
          const { id, role, email, name, content, role_name, company_id } = results[0];
          console.log(company_id)
          const token = jwt.sign({ id, role, content, email, name, role_name, company_id }, "jwtSecret", {
            expiresIn: 30000
          })

          // req.session.user = results;
          res.json({
            token: token,
            verificationStatus: "Success"
          })

        } else {
          res.status(401).json(AUTH_FAILURE)
        }
      });
  }
});


// Verify pwd - takes plain text and encryped, verifies and returns true or false
const verifyPass = (ptPwd, encPwd) => {
  return bcrypt.compareSync(ptPwd, encPwd)
}

// Enc password - for new accounts
const encrptyPassword = (origPwd) => {
  let encPwd = bcrypt.hashSync(origPwd, 10);
  return encPwd
}

// Middleware function used to verify token and if true resume next function at call site
const verifyJWT = (req, res, next) => {

  const token = req.headers["x-access-token"];

  if (!token) {
    res.send("No token received.")
  } else {
    jwt.verify(token, "jwtSecret", (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "Auth failure" })
      } else {
        req.userId = decoded.id;
        req.userName = decoded.name;
        req.email = decoded.email;
        req.role = decoded.role;
        req.userType = decoded.role_name;
        req.content = decoded.content;
        req.company = decoded.company_id;
        next();

      }
    })
  }
}

// A simple function used by the front end. Submits token which returns auth status.
app.get('/authVerify', verifyJWT, (req, res) => {
  res.send({
    auth: true,
    message: "Authenticated",
    id: req.userId,
    email: req.email,
    userName: req.userName,
    role: req.role,
    userType: req.userType,
    company: req.company,
    content: req.content.split(","),
  })
})

// Get orders from DB
app.get('/getOrderItems', verifyJWT, async (req, res) => {

  const { userType, company } = req;
  let filter = (userType === "supplier") ? ` where ci.id = ${company} ` : '';

  console.log(company)
  try {


    let productSql = `
        select
        oi.id as id,
        p.product_name,
        o.id as parent_order,
        DATE_FORMAT(o.date_created, '%Y-%d-%d %H:%i') as date_created,
        s.company_name,
        p.product_code,
        oi.requested_quantity,
        oi.supplier_approval_status,
        p.manufacturer,
        oi.im_approval,
        p.description,
        oi.supp_avail_qty,
        IF(oi.supp_avail_qty IS null, oi.requested_quantity, oi.supp_avail_qty) AS available
        FROM orders o

        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON p.id = oi.id_product
        JOIN suppliers s ON s.id = o.id_supplier
        JOIN company_info ci on s.company_id = ci.id

        ${filter}
        order by o.date_created asc
        `;


    //Get header data from db and create object tree
    let products = await runQuery(productSql);
    res.status(200).json(products);
  } catch (e) {
    res.sendStatus(500);
  }
});

// The SQL DB acts as main source of truth, any changes propagated to search index must be derived from MYSQL.
// supplies key product info required by the user
app.post('/getProductDetails', verifyJWT, (req, res) => {

  console.log(req.headers["x-access-token"])
  const { id } = req.body

  const sql = `SELECT 
  p.id,
  p.product_name,
  ci.name AS company_name,
  p.category,
  product_code,
  manufacturer,
  description,
  unit_price,
  alert_level,
  s.id as supplier_id
  FROM products p 
  LEFT JOIN suppliers s ON s.id = p.supplier_id
  LEFT JOIN company_info ci ON ci.id = s.company_id
  
  WHERE p.id = ?`

  db.query(sql, id, (err, results) => {
    if (err) {
      res.send(500)
    } else {
      if (results.length) {

        res.json(results[0])
      } else {
        res.json({ err: "nodata" })
      }


    }
  })


})


// Handles Approve, Reject and Partial approvals 
// if full Approve, updates current stock level
app.post('/processOrderItem', async (req, res) => {
  const status = { action: 'Process Order', process_status: null, stock_update: null };
  const data = req.body;


  try {
    const order = await updateOrder(data);
    const inventory = await updateInventoryByOrderId(data.item_order_id, data.app_qty);
    res.status(200).json([order, inventory]);
  } catch (e) {
    console.log("Error updating order");
    res.status(500).json(e)
  }

}
);


const updateOrder = (data) => new Promise((resolve, reject) => {

  const { app_status, app_qty, item_order_id } = data;
  let sql = `
    update order_items 
    set supplier_approval_status = ?,
    supp_avail_qty = ?
    where id = ?`

  db.query(sql, [app_status, app_qty, item_order_id], (err, results) => {
    if (err) {
      console.log(err);
      return reject(false)
    } else {
      console.log("Order_items updated");
      return resolve("Order Updated");
    }
  });


});

// Update inventory levels
const updateInventoryByOrderId = (order, qty) => new Promise((resolve, reject) => {

  let approvalFlag = "Approved";
  let sql = `
  update products set qty_avail = (qty_avail + ?) WHERE id IN 
  (SELECT id_product FROM order_items WHERE id = ? and  supplier_approval_status = ?);
  `

  console.log(order);

  db.query(sql, [qty, order, approvalFlag], (err, results) => {
    if (err) {
      console.log(err);

      return reject(false)
    } else {
      return resolve("Stock Updated");
    }
  });
});




// Get Supplier Details (Form)

app.post('/getSuppliersProductTypes', async (req, res) => {

  try {

    let productSql = `
    SELECT s.id, s.company_name, p.category, p.manufacturer, p.id as pid FROM suppliers s
    LEFT JOIN products p ON s.id = p.supplier_id
    GROUP BY company_name, category, manufacturer
    ORDER BY s.id
      `;

    //Get header data from db and create object tree
    let products = await runQuery(productSql);
    res.status(200).json(products);
  } catch (e) {
    res.sendStatus(500);
  }
});



// Create / update new product

app.post('/createNewProduct', async (req, res) => {

  const { productInfo } = req.body;
  try {
    const newProduct = await createNewProduct(productInfo);
    reIndexData(await getProductByInfo(newProduct.id));
    console.log("product created")
    res.status(200).json([newProduct]);
  } catch (e) {
    console.log("Error updating product");
    res.status(500).json(e)
  }

});



const createNewProduct = (data, qty) => new Promise((resolve, reject) => {

  let { product_name, category, product_code, manufacturer, description, supplier_id, alert_level, unit_price } = data;

  let newProductSql = `
    insert into products set
    category = ?, 
    product_code = ?, 
    description = ?,
    manufacturer = ?, 
    product_name = ?,
    supplier_id = (select id from suppliers where company_name = ?),
    alert_level = ?, 
    unit_price = ?
  `;

  db.query(newProductSql, [category, product_code, description, manufacturer, product_name, supplier_id, alert_level, unit_price], (err, results) => {
    if (err) {
      console.log(err)
      return reject(false)
    } else {
      return resolve({ id: results.insertId, msg: "New Product Created!" });
    }
  });
});


// Udate existing product (api followed by function)


app.post('/updateProduct', async (req, res) => {

  const { productInfo } = req.body;
  try {
    const newProduct = await updateProduct(productInfo);
    reIndexData(await getProductByInfo(productInfo.id));
    console.log("product updated")
    res.status(200).json([newProduct]);
  } catch (e) {
    console.log("Error updating product");
    res.status(500).json(e)
  }

});

const updateProduct = (data, qty) => new Promise((resolve, reject) => {

  let { product_name, category, product_code, manufacturer, description, alert_level, unit_price, id } = data;


  let newProductSql = `
    update products set
    category = ?, 
    product_code = ?, 
    description = ?,
    manufacturer = ?, 
    product_name = ?, 
    alert_level = ?, 
    unit_price = ? 
    where id = ? 
  `;

  db.query(newProductSql, [category, product_code, description, manufacturer, product_name, alert_level, unit_price, id], (err, results) => {
    if (err) {
      console.log(err)
      return reject(false)
    } else {
      return resolve("New Product Created!");
    }
  });
});


// Get order updates - dashboard feed

app.get('/getOrderUpdates', verifyJWT, async (req, res) => {

  try {

    let productSql = `
      SELECT 
      oi.id,
      o.id order_id, 
      o.status, 
      p.category, 
      p.product_code, 
      p.description, 
      oi.requested_quantity, 
      oi.im_approval,
      p.manufacturer,
      oi.supplier_approval_status, 
      oi.supp_avail_qty, 
      s.company_name,
      o.date_created,
      p.qty_avail,
      p.alert_level,
      oi.last_updated FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN suppliers s ON s.id = o.id_supplier
      JOIN products p ON oi.id_product = p.id        
      `;


    //Get header data from db and create object tree
    let products = await runQuery(productSql);
    res.status(200).json(products);
  } catch (e) {
    res.sendStatus(500);
  }
});
app.get('/getDashData', verifyJWT, async (req, res) => {

  try {

    let productSql = `
    SELECT supplier_approval_status AS name, count(supplier_approval_status) AS value, SUM(requested_quantity) as req FROM  order_items
    GROUP BY supplier_approval_status
      `;
    //Get header data from db and create object tree
    let products = await runQuery(productSql);
    res.status(200).json(products);
  } catch (e) {
    res.sendStatus(500);
  }
});



// Generic query getter
const runQuery = (sql) => new Promise((resolve, reject) => {
  db.query(sql,
    (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
});





// Submit inventory order


// Create new orders

app.post('/submitOrder', async (req, res) => {

  const orderData = req.body;
  let uniqueSuppliers = [...new Set(orderData.map(item => item.supplier_id))]
  let ordersCreated = [];

  console.log(uniqueSuppliers)

  // Create orders and append items
  try {
    for (const supplier of uniqueSuppliers) {
      //Create the order
      let status = { orderId: await createNewOrder(supplier) };

      // Filter, then create items
      let orderItems = orderData.filter(item => item.supplier_id === supplier)
        .map(item => [item.prod_id, item.requested_quantity, status.orderId]);
      status.itemOrderStatus = await createOrderItems(orderItems);

      // Update status to send back to client
      ordersCreated.push(status);
    }

    res.status(200).json(ordersCreated);
  } catch (e) {
    console.log(e)
    console.log("Error placing order");
    res.status(500).json(e)
  }

});

const createNewOrder = (supplier) => new Promise((resolve, reject) => {

  let createOrderSQl = `
    insert into orders (id_supplier) values (?)
  `;

  console.log(supplier)

  db.query(createOrderSQl, [supplier], (err, results) => {
    if (err) {
      console.log(err);
      return reject(false)
    } else {
      notifySupplierByEmail(results.insertId);
      return resolve(results.insertId);
    }
  });
});

const createOrderItems = (orderItems) => new Promise((resolve, reject) => {

  let createOrderSQl = `
    insert into order_items (id_product, requested_quantity, order_id) values ?
  `;

  db.query(createOrderSQl, [orderItems], (err, results) => {
    if (err) {
      console.log(err);
      return reject(false)
    } else {
      return resolve("success");
    }
  });
});








async function notifySupplierByEmail(order) {
  var nodemailer = require('nodemailer');
  let getSuppContact = `SELECT
      contact_email, s.id, company_name FROM orders o
      LEFT JOIN suppliers s ON s.id = o.id_supplier
      WHERE o.id = ${order}`;

  var supp = await runQuery(getSuppContact)


  // Create the transporter with the required configuration for Outlook
  // change the user and pass !
  var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
      ciphers: 'SSLv3'
    },
    auth: {
      user: "imsdemosystem@outlook.com",
      pass: "ImsDemo!!!"
    }
  });

  console.log(supp[0].contact_email);
  // setup e-mail data, even with unicode symbols
  var mailOptions = {
    from: '"Admin Team " <imsdemosystem@outlook.com>', // sender address (who sends)
    to: supp[0].contact_email, // list of receivers (who receives)
    subject: 'New Order Request Received!', // Subject line
    text: 'New Order ', // plaintext body
    html: '<p>Dear ' + supp[0].company_name + '</p><b>You Have a New Order #' + order + ' </b><br><a href="http://localhost:3000/supplierorders?s=' + supp[0].id + '">Please review and submit your response.</a>' // html body
  };


  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return "Error sending mail"
      return console.log(error);
    }

  });
  return "success"

};



app.get('/getAlerting', verifyJWT, async (req, res) => {

  try {

    let productSql = `
      SELECT 
        * from products where qty_avail < alert_level       
      `;


    //Get header data from db and create object tree
    let products = await runQuery(productSql);
    res.status(200).json(products);
  } catch (e) {
    res.sendStatus(500);
  }
});





app.post('/processOrderApproveCancel', async (req, res) => {
  const { item, appStatus } = req.body;
  console.log(appStatus);

  try {
    const orderUpdateStatus = await updateOrderLineItem(item, appStatus);
    res.status(200).json([orderUpdateStatus]);
  } catch (e) {
    console.log("Error updating line item");
    res.orderUpdateStatus(500).json(e)
  }

}
);



const updateOrderLineItem = (item, status) => new Promise((resolve, reject) => {

  let sql = `update order_items set im_approval = ? where id = ?`

  db.query(sql, [status, item], (err, results) => {
    if (err) {
      console.log(err);

      return reject(false)
    } else {
      return resolve("Order Item Updated");
    }
  });
});


// Sync search engine, get data from db - used from admin front end, syncs all records
app.post('/searchSync', async (req, res) => {
  let productData = await getProductByInfo();
  if (productData.length > 0) {
    let syncStatus = await reIndexData(productData)
    res.send(productData)
  } else {
    res.send({ msg: "Nothing to update" })
  }
}
);

const getProductByInfo = (id = 0) => new Promise((resolve, reject) => {

  let sql = `SELECT 
    p.id,
    p.product_name,
    ci.name AS company_name,
    p.category,
    p.qty_avail,
    p.image,
    product_code,
    manufacturer,
    description,
    unit_price,
    alert_level,
    s.company_name as supplier,
    s.id AS supplier_id
    FROM products p 
    LEFT JOIN suppliers s ON s.id = p.supplier_id
    LEFT JOIN company_info ci ON ci.id = s.company_id `;

  (id > 0) ? sql += `where p.id = ?` : '';


  db.query(sql, id,
    (error, results) => {
      if (error) {
        console.log(error)
        return reject(error);
      }
      return resolve(results);
    });

})


// Post data to engine
const reIndexData = (docs) => new Promise((resolve, reject) => {
  client
    .indexDocuments(engineName, docs)
    .then(response => { return resolve(response) })
    .catch(error => { console.log(error); return reject(error) })
})



// Delete document from search engine index - expects array in req.body.docId only
app.get('/deleteDocument', verifyJWT, async (req, res) => {

  let { docId } = req.body;

  client
    // .getDocuments(engineName, [97])
    .destroyDocuments(engineName, docId)
    .then((response) => {
      res.send(response)

    })
    .catch(error => console.log(error.errorMessages))

})
app.get('/deleteAllDocuments', async (req, res) => {
  let { docId } = req.body;
  client
    .listDocuments(engineName)
    .then((docs) => {
      const docIds = docs.results.map(item => item.id)
      client
        .destroyDocuments(engineName, docIds)
        .then((response) => {
          res.send(response)
        })
        .catch(error => console.log(error.errorMessages))
    })
    .catch(error => console.log(error.errorMessages))

})
app.get('/listdocs', async (req, res) => {

  let { docId } = req.body;

  client
    // .getDocuments(engineName, [97])
    .listDocuments(engineName)
    .then((response) => {
      res.send(response.results.map(item => item.id))

    })
    .catch(error => console.log(error.errorMessages))

})


//  test query suggestion

app.post('/querySuggestor', verifyJWT, async (req, res) => {

  const { searchKey } = req.body;

  const options = {
    size: 5,
    types: {
      documents: {
        fields: ['company_name']
      }
    }
  }

  client
    .querySuggestion(engineName, searchKey, options)
    .then(response => res.json(response))
    .catch(error => { console.log(error.errorMessages); res.send(500) })

}
);



module.exports = app