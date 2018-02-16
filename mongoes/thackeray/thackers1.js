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
    const collection = db.collection('thackersSales4');
    collection.find().skip(0)
    // .limit(20)
        .toArray(function (err, res) {
            if (err) {
                console.log('an error has occurred', err)
                // return;
            }

            var dt = res;
            var date = "";
            var description = "zz"
            var productMap = new Map();

            var addToMap = (map, key, obj) => {
                if (map.has(key) === false) {
                    map.set(key, [obj]);
                } else {
                    map.get(key).push(obj);
                }
                return map;
            }

            var resultsMap = dt.reduce((map, curr) => {
                var b = curr['date'];

            if(b === 'undefined'){
                throw new Exception(curr);
                return;
            }

            var regex = /^\d{1,2}\/\d{1,2}\/\d{4}/;
            var regexCafe = /^Cafe Food/
            var regexProduct = /^[0-9]{8}/

            if (regex.test(b)) {
                date = b;
                // console.log('SET',date);
            } else if (regexCafe.test(b)) {
                //   console.log('donnothing',b)
            } else if (b.substring(0, 3) === 'Tx-') {

                // Object.defineProperty(curr,'description', this.description1);
                curr.description= description;
                curr.date=date;
                addToMap(map, b, curr);
                //  console.log('Set transaction', curr.description, curr);

            } else if (regexProduct.test(b)) {
                description = b.slice(11);
                productMap.set(b.slice(11),1);
                // console.log(description);
            } else {
                //console.log('whate is left over',b); // products
            }

            return map
        }, new Map());

            console.log('size', resultsMap.lastChar);
            resultsMap.forEach((values, key,arr)=> {

                values.forEach( value =>{
                for(let cnt= 0; cnt > value.length; cnt++)
            console.log('insiede');
            const newby = {
                date: value['date'],
                qty: value.qty,
                total: value.total,
                net: value.net,
                vat: value.vat,
                discountedAmount: value.discountedAmount,
                'discount%': value['discount%'],
                description: value['description'],
                receiptId: key
            };
            const coll2 = db.collection('transactions');
            /**
             *  uncomment out insert statement
             */
            coll2.insert(newby, (err, doc) => {
                // console.log(doc)
            });


            });

            });


        })
})