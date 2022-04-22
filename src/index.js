const express = require("express");
const { json } = require("express/lib/response");
const { v4: uuidv4 } = require("uuid")

const app = express();

app.use(express.json());

const quadras = [];

function verificarQuadraExistente(request, response, next) {
    const { id } = request.headers;

    const quadra = quadras.find(q => q.id === id);
    if (!quadra)
        return response.status(400).json({ message: "Quadra não encontrada." });

    request.quadra = quadra;

    return next();
}

app.get("/quadras", (request, response) => {
    const { name } = request.query;

    if (name) {
        const quadra = quadras.find(q => q.name === name);
        return response.json(quadra)
    }

    return response.json(quadras);
});

app.get("/quadras/:id", (request, response) => {
    const { id } = request.params;
    return response.json({})
});

app.post("/quadras", (request, response) => {
    const id = uuidv4();
    const { name, description } = request.body;

    if (!name)
        return response.status(400).json({ message: "Nome da quadra é obrigatório." });

    const quadraExistente = quadras.some((quadra) => quadra.name === name);
    if (quadraExistente)
        return response.status(400).json({ message: "Nome já cadastrado para uma quadra." });

    quadras.push({
        id,
        name,
        description
    });

    return response.status(201).send();
});

app.put("/quadras/:id", verificarQuadraExistente, (request, response) => {
    const { name, description } = request.body;
    const { quadra } = request;

    quadra.name = name;
    quadra.description = description;

    const index = quadras.findIndex(q => q.id === quadra.id);
    quadras[index] = quadra;

    return response.send();
});

app.delete("/quadras/:id", verificarQuadraExistente, (resquest, response) => {
    const {id} = request.params;

    quadras = quadras.filter((value, index, array)=> value.id !== id);

    return response.send();
})

app.listen(3333);