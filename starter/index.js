const fs = require("fs");
const http = require("http");
//const { dirname } = require("path/posix");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate"); //the . represents current loc of module in require

/////////////////////////////////
//FILES

//Blocking, Synchronous Way

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is something about Avo: ${textIn}.\nCreated on ${Date.now()}`; //Template string ES6 syntax

// fs.writeFileSync("./txt/output.txt", textOut); //For new file output.txt
// console.log("File Written");

//Non -blocking Asynch way

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   -fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     //content of start file will be the name of second file here
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your File has been written :)");
//       });
//     });
//   });
//   //File is read in background and will be provided by this callback after it is read
// });

// console.log("Will read file");

///////////////////////////////////////////
//SERVER
//A simple API for json reading

// for reading html templates
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8"); //top level code, gets executed only once, hence synch
const dataObj = JSON.parse(data); //parse takes json string and turns into JS obj

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //gets executed each time there is a new req, hence asynch
  //Consoles for geting the url and parsing to know about query and search
  //console.log(req.url);
  //console.log(url.parse(req.url, true));
  //const pathname = req.url;

  //Overview page

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id]; //retreiving element based on a query string
    const output = replaceTemplate(tempProduct, product);
    //console.log(query);
    res.end(output);

    //API
  } else if (pathname === "/api") {
    //Simple API to request data from application
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html", //browser noe expects some html
      "my-Own-header": "I am awesome",
    }); //It also sends headers
    res.end("<h1>Page not found</h1>");
  }
  //res.end("Hello from the server!"); //callback executed each time a new req hits server
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listenening to requests on port 8000"); // we started to listen to incoming requests on local host IP and port
}); // now a event will be fired
