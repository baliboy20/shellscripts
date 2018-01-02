// conn = new Mongo();
// db = conn.getDB("myDatabase");
db = connect("localhost:27017/TechBlog");
print('Hello all');

// <-- Update Many -->
// db.scratch.updateMany({},{
//     $set:{'documentType':'BLOG',
//         'postedOn': Date.now() , links:["someUrl"], relatedTo:["someBlog"], subjects:["someSubject"]}
// })


// <-- Iterate Results -->
var coll = db.scratch.find({},
    {
        documentType: true,
        title: true,
        postedOn: true,
        subject: true,
        relatedTo: true,
        links: true,
        _id: false
    }, {multi: true});

while (coll.hasNext()) {
    var json = coll.next();
    json.postedOn = new Date(json.postedOn).toISOString();
    printjson(json)
}