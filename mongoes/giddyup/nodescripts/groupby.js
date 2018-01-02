db = connect("localhost:27017/test");

//const col1 = db.data.find().pretty();

const col1 =db.data.aggregate(
    [
       {
         $group : {
            _id : { month: { $month: "$date" }, day: { $dayOfMonth: "$date" }, year: { $year: "$date" } },
            totalPrice: { $sum: { $multiply: [ "$price", "$quantity" ] } },
            averageQuantity: { $avg: "$quantity" },
            count: { $sum: 1 }
         }
       }
    ]
 )


while(col1.hasNext()) {
    const obj = col1.next();
    printjson(obj);
}