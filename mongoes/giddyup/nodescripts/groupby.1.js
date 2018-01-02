db = connect("localhost:27017/giddyup");

let col1 = db.sales.find().pretty();

// const col1 =db.data.aggregate(
//     [
//        {
//          $group : {
//             _id : { month: { $month: "$date" }, day: { $dayOfMonth: "$date" }, year: { $year: "$date" } },
//             totalPrice: { $sum: {
     //$multiply: [ "$price", "$quantity" ] } },
//             averageQuantity: { $avg: "$quantity" },
//             count: { $sum: 1 }
//          }
//        }
//     ]
//  )

col1 = db.sales.aggregate(
 [{$match: {Payment_method:"Chip"}},
    {
        $group :  {
            _id: "$Payment_method",
            "Total Sales": {$sum : 1}
        }
      }
 ]
)


while(col1.hasNext()) {
    const obj = col1.next();
    printjson(obj);
}