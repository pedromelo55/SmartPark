const { default: axios } = require("axios");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const app = express();
const server = process.env.SERVER;
const dominio = process.env.DOMAIN;

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Página inicial (Menu Principal)
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get("/sensor", function(req, res) {
    res.render("sensor", {dominio});
});

app.get("/updateVaga/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const vaga = await axios.get(`${server}slots/${id}`);
        console.log("Vaga", vaga.data);
        const vagas = await axios.put(`${server}slots/${id}`, {
            ...vaga.data, occupied:!vaga.data.occupied
        });
        console.log("Vagas", vagas.data)
        res.json("Ok");
    } catch (error) {
        console.error(error);
        throw error;
    }
});

app.get("/vagas", async(req, res) => {
    try {
        const vagas = await axios.get(`${server}slots`);
        res.render("vagas", {vagas:vagas.data, dominio});
    } catch (error) {
        console.error(error);
        throw error;
    }
});

app.get("/loadVagas", async (req, res) => {
    try {
      const vagas = await axios.get(`${server}slots`);
      res.json(vagas.data); // Remova o .send() antes do .json()
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao carregar vagas" }); // Adicione um status de erro e uma resposta JSON
    }
  });
  

app.listen(3002, () => {
    console.log("server listening at http://localhost:3002");
});
