const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs= require('fs');



const app = express();
app.use(bodyParser.json());

app.use(cors());

app.listen(3000, () => {
    console.log("LISTEN")
})

app.post('/', (req, res) => {

    var lines = fs.readFileSync(req.body.input, 'utf-8')
        .split('\r\n')
        .filter(Boolean);
    var count = 0;
    var swvl = [];
    for (var i = 0; i < lines[0]; i++) {
        swvl[i] = [];
    }
    var user = [];
    var i = 1;
    suggested= [];
    fs.unlink(req.body.output, function(err) {
        if(err && err.code == 'ENOENT') {
            // file doens't exist
            console.info("File doesn't exist, won't remove it.");
        } else if (err) {
            // other errors, e.g. maybe we don't have enough permission
            console.error("Error occurred while trying to remove file");
        } else {
            console.info(`removed`);
        }
    });
   
    try {
        while (i < lines.length) {

            for (var j = i + 1; j < i + 1 + parseInt(lines[i]); j++) {

                swvl[count].push({"name":lines[j][0], "x":parseInt(lines[j][2]),"y":parseInt(lines[j][4])})
            }
            i = i + parseInt(lines[i]) + 1;
            count++;


            if (count == parseInt(lines[0])) {
                for (var j = i + 1; j < i + 1 + parseInt(lines[i]); j++) {
                    user.push({"name":lines[j][0], "x":parseInt(lines[j][2]),"y":parseInt(lines[j][4])})
                }
                i = lines.length;
            }
        }
        for (var k  = 0;k<user.length;k++){
            let min=1000;
            let name="";
            for(var s= 0; s<swvl.length;s++){
               for(var t = 0; t< swvl[s].length;t++){
                var a = swvl[s][t].x-user[k].x
                var b= swvl[s][t].y-user[k].y
                if(Math.sqrt( a*a + b*b )<min){
                    min = Math.sqrt( a*a + b*b )
                    name= swvl[s][t].name;
                }
               }
               
            }        

            suggested.push(user[k].name +" "+ name)
        }
        for (var o=0;o<suggested.length;o++){
            fs.appendFileSync(req.body.output, suggested[o] + "\n");
            
        }
    } catch (err) {
       res.send("something went wrong")
    }

    res.send(suggested)

});
app.use((err, req, res, next) => {
    res.send(err);
});

