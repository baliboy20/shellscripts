// conn = new Mongo();
// db = conn.getDB("myDatabase");
db = connect("localhost:27017/giddyup");
var dbs = db.adminCommand('listDatabases');
// printjson( db.adminCommand('listDatabases'));
for( var a in dbs.databases) {
    printjson(dbs.databases[a]['name']);
}

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
         printjson(a.CoffeeSales[b]);
        final.push(a.CoffeeSales[b]);
    }
   
}

printjson (final);
db.sales.insertMany(final);

var count = db.sales.count;
print(count);