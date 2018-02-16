const MongoClient = require('mongodb').MongoClient;
const ehlo = require('./script-one');


console.log('\x1Bc');
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'thackers';
// 'use strict';

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {

    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection('transactions');

    // ehlo.grandToltal(collection).toArray(console.log)
    // ehlo.AvgSpendPerSale(collection).toArray(console.log)

    // ehlo.genericAggregate(collection, ehlo.groupAvgSpendPerDay).toArray(function(err, res) {
    //     //${a._id}\t
    //     res.forEach(a=>{
    //         const line = `${a.date} \t ${a.total} \t ${a.countOfItems}`;
    //         console.log(line);
    //     })
    // });


    // ehlo.listDescriptionsDistinct(collection,callback)
//ehlo.groupBestSellers(collection).toArray(console.log)

    // db.collection('bestSellarsList').find({})

    // ehlo.groupSalesByMonth(collection);

    ehlo.avgSpendByReceiptId(collection);



    // ehlo.topSellingProducts(collection);
   // ehlo.ratioOfSalesByDiscount(collection);



});

