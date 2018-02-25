const request = require('request'),
    cheerio = require('cheerio'),
    mkdirp = require('mkdirp'),
    json2csv = require('json2csv'),
    fs = require('fs'),
    directory = './data',  
    mainUrl = 'http://shirts4mike.com/',
    fields = ['Title', 'Price', 'ImageURL', 'URL', 'Time'],
    dt = new Date(),
    date = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate(),
    milliDay = 10000;
let urls = [],
    shirts = [];

const writeToFile = () => {
        fs.writeFile('data/' + date + '.csv', json2csv({ data: shirts, fields: fields }), function(err) {
            if (err) throw err;
            console.log('file saved');
        });        
};

const makeDir = () => {   
    mkdirp(directory, function (err) {
        if (err) console.error(err)
        else console.log('pow!')
    });
};

    request(mainUrl + 'shirts.php', function(err, resp, body){
        if(!err && resp.statusCode == 200){
            const $ = cheerio.load(body);
            $('.products a').each(function(){
                var url = $(this).attr('href');
                urls.push(url);
            });
            console.log(resp.statusCode + ' : ' + err)    
            console.log(urls);

            $(urls).each(function(x){
                console.log(mainUrl + urls[x]);
                request(mainUrl + urls[x], function(err, resp, body){
                    if(!err && resp.statusCode == 200){
                        var $ = cheerio.load(body),
                            shirtDetails = {
                                'Title' : $('.shirt-details h1').clone()
                                                                .children()
                                                                .remove()
                                                                .end()
                                                                .text(),
                                'Price' : $('.price').text(),
                                'URL' : mainUrl + urls[x],
                                'ImageURL' : mainUrl + $('.shirt-picture img').attr('src')
                            };
                        console.log(shirtDetails);
                        shirts.push(shirtDetails);
                    }
                })
            });
            setTimeout(function(){
                writeToFile();     
            },5000);  
               
        

            
    
        }else{
            if(resp === undefined){
                console.log(`There’s been a connection error. Cannot connect to ${mainUrl}.`);    
            }else{
                console.log(`There’s been a ${resp.statusCode} error. Cannot connect to ${mainUrl}.`)
            }
        }
    });
 
makeDir();