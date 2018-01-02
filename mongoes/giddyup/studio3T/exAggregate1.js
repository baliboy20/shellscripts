//
//db.anly.find(
//{
//  Staff:'Fortune Pos', 
//  Date:new Date('2017-12-02'), 
//  Name: {$in:['Flat White','Savoury Muffin']}
//  })

db.anly.find().limit(1)
db.anly.aggregate([
{$match: {Date:new Date('2017-12-02')}},
{$group: {
  _id : "$Receipt number", Count: {$sum:1}, 
 

    itemsSold: { $push:  { item: "$Name", quantity: "$Quantity", Date: "$Date", Time:"$Time" } }
  }},
 
 


])