
(function (){
  //required
  const request = require('request'),
      cheerio = require('cheerio'),
      json2csv = require('json2csv'),
      fs = require('fs'),
      http = require('http');

  //locals
  const mainUrl = 'http://shirts4mike.com/',
        entryUrl = 'shirts.php',
        dayInMilli = (((1000*60)*60)*24);

  //creates specific format of date depending on boolean param
  function getDate(timeStamp) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
          weekdayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
          dt = new Date();
    if(timeStamp){
      return `[${dt}]`;
    }else{
      return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
    }
  }

  function getTime() {
    const dt = new Date();
    return `${dt.getHours()}:${dt.getMinutes() + 1}:${dt.getSeconds()}`;
  }

  function errorLog(err) {
    fs.appendFileSync('data/scraper-error.log', `\r\n ${getDate(true)} ${err}`);
  }

  function createFile(date, shirtsData) {
    return new Promise((resolve, reject) => {
      const newDate = date(),
            fields = ['Title', 'Price', 'ImageURL', 'URL', 'Time'];
      fs.writeFile('data/' + newDate + '.csv', json2csv({data: shirtsData, fields: fields}), function(err) {
        if(err) reject(err);
        resolve();
        console.log('Filed saved!');
      });
    });
  }

  //creates data directory if it does not already exist
  function makeDir() {
    return new Promise((resolve, reject) => {
      const dir = './data';
      if(fs.existsSync(dir)){
        resolve();
      }else{
        fs.mkdir(dir, function(err){
          if(err) reject(err);
          console.log(`Directory named ${dir} created`);
          resolve();
        });
      }
    })
  }

  //gets specific urls, stores them in array and then returns array
  function getShirtsURLS() {
    return new Promise((resolve, reject) => {
      let urls = [];
      request(mainUrl + entryUrl, function(err, resp, body){
        if(err) {
          reject(`There's been a ${err.code} error. Cannot connect to ${mainUrl}`);
        }else if(resp.statusCode == 200){
          const $ = cheerio.load(body);
          $('.products a').each(function(){
              let url = $(this).attr('href');
              urls.push(url);
          });
          console.log('Urls gotten!');
          resolve(urls);
        }
      });
   });
  }

  //uses each param provided url to retrieve specific shirt details from page and store them as object in an array
  function getShirts(urls) {
    return  new Promise((resolve, reject) => {
      let shirts = [];
      //loops through each url and scrapes data then resolves func once all urls are scraped
      for(let i = 0; i < urls.length; i++){
        request(mainUrl + urls[i], function(err, resp, body){
            if(err) reject(`There's been a ${err.code} error. Cannot connect to ${mainUrl + urls[i]}`);
            if(resp.statusCode == 200){
              const $ = cheerio.load(body);
              const shirtDetails = {
                  'Title': $('.shirt-details h1').clone()
                                                  .children()
                                                  .remove()
                                                  .end()
                                                  .text(),
                  'Price': $('.price').text(),
                  'URL': mainUrl + urls[i],
                  'ImageURL': mainUrl + $('.shirt-picture img').attr('src'),
                  'Time': getTime()
              }
              shirts.push(shirtDetails);
              if(shirts.length === urls.length){
                console.log('Shirts details gotten!');
                resolve(shirts);
              }
            }
        });
      }
    });
  }

  function run(){
    makeDir().then(() => {
      return getShirtsURLS();
    }).then((urls) => {
      return getShirts(urls);
    }).then((shirts) => {
      return createFile(getDate, shirts);
    }).catch((err) => {
        console.log(`An error has occured. Check scraper-error.log`);
        errorLog(err);
        clearInterval(dailyDataRetrieval);
    });
  }

  run();
  let dailyDataRetrieval = setInterval(() => {
    run();
  },dayInMilli);

}());
