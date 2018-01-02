// conn = new Mongo();
// db = conn.getDB("myDatabase");
db = connect("localhost:27017/TechBlog");

db.scratch.find({},{title})

