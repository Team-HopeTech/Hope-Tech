import express from 'express';
import OpenAI from 'openai';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const port = 3000;
app.set('view engine', 'ejs');


const messages=[]
const openai = new OpenAI({
    apiKey: "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" 
});

var userIsAuthorised = false;

app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static("public"));

function passwordCheck(req, res, next) {
    const email = req.body["Email"];    
    const password = req.body["Password"];

    if(email === "john" && password === "Hello@12"){
        userIsAuthorised = true;
    }
    next();
}

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.use(passwordCheck);

app.get("/login", (req, res) => {
    res.render("login.ejs");
})

app.get("/signup", (req,res) => {
    res.render("signup.ejs")
})

app.post("/home", (req,res) => {

    if (userIsAuthorised) {
        res.render("social.ejs");
      } 
      else {  
        res.render("login.ejs")
      }

    const name= "John Theodore";
    res.render("social.ejs", {name});
})

app.get("/survey", (req, res) => {
    res.render("survey.ejs")
})

async function main(input) {
    messages.push({ role: 'user', content: "You are a chatbot specializing in psychology. Your goal is to provide informative responses to questions related to psychology topics. Your task is to recognize various psychology-related inquiries and provide accurate explanations or advice. If a user asks an unrelated question, politely decline to answer." },
      { role: 'user', content: input })
    console.log(messages)
    const chatCompletion = await openai.chat.completions.create({
      messages: messages,
      model: 'gpt-3.5-turbo',
    });
    return chatCompletion.choices[0]?.message?.content;
  }
  
  
  app.use(bodyParser.json()) // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true }))
  // Render Html File
  app.get('/chatbot', function(req, res) {
    res.render("chatbot.ejs");
  });
  
  app.post('/api', async function(req, res, next) {
    console.log(req.body)
    const mes=await main(req.body.input)
    res.json({success:true , message:mes})
  })

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})