'use strict'

module.exports.sayHello = function(){
    console.log('sayHello');
}

const groupTotal = {
$group: {
    _id: "1",
        sum:{$sum:"$qty"},
        grandTotal:{$sum:"$total"}

}
}

module.exports.grandToltal = function(collection) {

   return collection.aggregate([groupTotal])

}

const groupAvgSpendPerSale = {
        $group: {_id: "receiptId",
        total: {$sum:"$total"},
        countOfItems: {$sum: "$qty"}
    }
}

module.exports.groupAvgSpendPerDay = {
    $group: {_id: "$date",
        total: {$sum:"$net"},
        countOfItems: {$sum: "$qty"}
    }
}


module.exports.AvgSpendPerSale = function(collection){

    return collection.aggregate([groupAvgSpendPerDay])
}


const projectDate = {
    $project: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$_id" }},
        total: 1,
        countOfItems: 1,
        _id: 1

        //timewithOffsetNY: { $dateToString: { format: "%H:%M:%S:%L%z", date: "$date", timezone: "America/New_York"} },
       // timewithOffset430: { $dateToString: { format: "%H:%M:%S:%L%z", date: "$date", timezone: "+04:30" } },
       // minutesOffsetNY: { $dateToString: { format: "%Z", date: "$date", timezone: "America/New_York" } },
       // minutesOffset430: { $dateToString: { format: "%Z", date: "$date", timezone: "+04:30" } }
    }
}


module.exports.genericAggregate = function(collection, groupCfg){

    return collection.aggregate([groupCfg, projectDate,{$sort:{_id:1}}])
}




module.exports.zzToDateFromString = function(collection){

    // return collection.aggregate([aggDateFromStr])
    return collection.aggregate( [

                { "$addFields": {
                                    "date": {
                                              $dateFromString:  { dateString: "$date"}
                                            }
                                }
                 },
                { "$out": "transactions1" }
    ] )
}


module.exports.listDescriptionsDistinct= function(collection, callback) {
    //.distinct(),

    const match = {
        $match: {qty:1, "discount%":"0%"}
    }

    const group = {
        $group: {"_id":{description:"$description", net:"$net",qty:'$qty', 'discount%':'$discount%'}}
    }

    const sort = {$sort:{"_id":-1}}

    const project = {$project:{description: true, _id: true}}

    const out = {$out:"products"}

    return collection.aggregate([match,group, project, sort, out])

        .toArray(console.log)


}


/**
 * Create a New collection, elevae subproperties to top level
 */
module.exports.transformIdSubProperties = function() {
    db.collection('products').aggregate([
        {$replaceRoot:{newRoot: "$_id"}},
        {$project:{description:1, net:1, 'discount%':1}},
        {$out:'products1'}
    ])
        .toArray(console.log)
}

/**
 *  Best Sellars
 */
module.exports.groupBestSellers= function(collection) {
    const group = {
        $group: {
            _id: {description: "$description"},
            sum:{$sum:"$net"},
            qty: {$sum:1},
            avg:{$avg:"$net"}
        }
    }

    const sort = {
        $sort:{qty:-1}
    }
    const replaceRoot = {
        $replaceRoot:{newRoot: "$_id"}
    };

    const project = {
        $project:{  "_id.description":1,
                    _id :{ sum:"$sum", qty:"$qty", avg: "$avg"}
    }}

     const out = {$out:'__bestSellars'}
  return  collection.aggregate([group, project, replaceRoot, sort, out])
}


/**
 *
 */
module.exports.groupSalesByMonth= function(collection) {
    var group = {
        $group : {
            _id:{ month: { $month:"$date" }, yr: {$year:"$date"} },
            monthTotal:{$sum:"$net"}}
    }
    collection.aggregate([ group]).toArray((err, doc) => {
        doc.forEach(d=>{
            const str = `${d._id.yr}\t${d._id.month}\t${d.monthTotal}`
        console.log(str)
    })
    });
}



/**
 * GRoup on ReceiptId / week
 */
module.exports.groupReceiptId= function(collection) {
    var group = {
        $group : {
            _id:{ date:"$date", receiptId: "$receiptId" },
            trades:{$sum:1}}
    }

    var project = {
        $project:{ _id:{trades:"$trades"}, "_id.date":true, "_id.receiptId": true }
    }

    var projectWeekno = {
        $project:{ _id:{trades:"$trades"}, "_id.year":true, "_id.weekno": true }
    }

    const replaceRoot = {
        $replaceRoot:{newRoot: "$_id"}
    };

    const groupOnDate ={
        $group : {
            _id:{
                    year:{"$year":"$date"},
                    weekno:{"$week":"$date"}
                },
            trades:{$sum:1}}
    }

    var projectOnDate = {
        $project:{ _id:{trades:"$trades"}, _id: true}
    }

    var sort = {
        $sort:{year:-1, weekno:-1}
    }

    collection.aggregate([
        group,
        project,
        replaceRoot,
        groupOnDate,
        projectWeekno,
        replaceRoot,
        sort
    ])
        .toArray((err, doc) => {
        doc.forEach(d=>{
        const str = `${d.year}\t${d.weekno}\t${d.trades}`;
        console.log(str)
})
});
}





module.exports.topSellingProducts = function(collection) {

    const groupOnProduct = {
        $group: {_id:"$description",
            total:{$sum:"$net"},
            qty:{$sum:1},
            average:{$avg:{$divide:["$net","$qty"]}}
        }
    }

    const replaceRoot = {
        $replaceRoot:{newRoot: "$_id"}
    };

    const project = {
        $project:{
            description:"$_id",
            totalNetSales:"$total",
            totalItemsSold:"$qty",
            avgSellPrice:"$average"
        }
    }

    const sort ={ $sort:{totalNetSales:-1}};
    const limit={ $limit:20}

    collection.aggregate(
        [groupOnProduct, project, sort,limit
    ]).toArray(function(err, doc){

        doc.forEach(d=>{
            const str = `${d.description}\t${d.totalNetSales}\t${d.totalItemsSold}\t${d.avgSellPrice}`;
        console.log(str)
        })

        }
    )

}

module.exports.ratioOfSalesByDiscount=function(col) {
    const group={
        $group : {
            _id:"$discount%", totalQty:{$sum:1}, totalNetSales:{$sum:"$net"}
        }
    }

    const project = {
        $project: {
            discountRate:"$_id",
            noOfItems:"$totalQty",
            netSales:"$totalNetSales",
            _id:false

        }
    }
    const sort = {
        $sort: {noOfItems: -1}
    };

    col.aggregate([group,project, sort])
        .toArray(function(err, doc) {
            // console.log(doc)
            doc.forEach(d => {
                const str = `${d.discountRate}\t${d.noOfItems}\t${d.netSales}`;
                console.log(str)
        })
        })

}


/**
 *
 */

/**
 * GRoup on ReceiptId / average
 */
module.exports.avgSpendByReceiptId= function(collection) {
    var group = {
        $group : {
            _id:{receiptId: "$receiptId", month: {$month:"$date"} },
            count:{$sum:1},
        recsum:{$sum:"$net"}}
}


var groupSum = {
        $group: {
            _id: "$_id.month",
            avg: {$avg:"$recsum"} }
}

var project = {
    $project:{ _id:{trades:"$trades"}, "_id.date":true, "_id.receiptId": true }
}

var projectWeekno = {
    $project:{ _id:{trades:"$trades"}, "_id.year":true, "_id.weekno": true }
}

const replaceRoot = {
    $replaceRoot:{newRoot: "$_id"}
};

const groupOnDate ={
    $group : {
        _id:{
            year:{"$year":"$date"},
            weekno:{"$week":"$date"}
        },
        trades:{$sum:1}}
}

var projectOnDate = {
    $project:{ _id:{trades:"$trades"}, _id: true}
}

var sort = {
    $sort:{year:-1, weekno:-1}
}

collection.aggregate([
    group, groupSum,
    //project,
    // replaceRoot,
    // groupOnDate,
    // projectWeekno,
    // replaceRoot,
    sort
])
    .toArray((err, doc) => {
    console.log(doc)
doc.forEach(d=>{
    const str = `${d.year}\t${d.weekno}\t${d.trades}`;
//console.log(str)
})
});
}































