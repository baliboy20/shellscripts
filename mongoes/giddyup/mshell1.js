// conn = new Mongo();
// db = conn.getDB("myDatabase");
db = connect("localhost:27017/giddyup");
dbTarget = connect("localhost:27017/university");
// var dbs = db.adminCommand('listDatabases');
// printjson( db.adminCommand('listDatabases'));
// for( var a in dbs.databases) {
    // printjson(dbs.databases[a]['name']);
// }

var coll = db.imported.find({"CoffeeSales":{$ne:null}});
print('Imported sales branch');
printjson(coll)
const final = [];
while(coll.hasNext()){
    print("<=== ===>")
    var a = coll.next();
    // for(var c in a) {
    //     print(c)
    //    for(var d in c) {
    //     print("       <=== inner ===>")
    //        print(d, c[d]);
    //    }
    // }
    //  printjson(Object.values(a.CoffeeSales)[0]);
    // printjson(b);
    
    for(var b in a.CoffeeSales) {
        // printjson(a.CoffeeSales[b]);
         const ex = a.CoffeeSales[b];

         if(ex['Description'].includes("Description")){
             print('DEscription found');
             continue
         } else {
        const hrs = ex['Time'].split(":");
         const dt = new Date(new Date(ex["Date"]).setHours(hrs[0],hrs[1],hrs[2])).toISOString();
         const dsn = ex["Description"].startsWith("\"") ?  ex["Description"].slice(1) : ex["Description"]; 

         const nw = {
             description: dsn,
             cardType: ex['Card_Type'],
             date: dt,
             deviceName: ex["Device_Name"],
            lastDigits: ex["Last_Digits"],
            netAmount: ex["Net_amount"],
            paymentMethod: ex["Payment_method"],
            receipt: ex["Receipt"],
            staff: ex["Staff"],
            total: ex["Total"],
            vat: ex["VAT"],
            fee: ex["_Fee"],
         }
        //  printjson(nw["description"])
        final.push(nw);
        }

         
    }
   
} //endwhile
// 
// printjson (final);
dbTarget.sales2.insertMany(final);

var count = db.sales.count;
print(count);