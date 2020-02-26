const express = require('express');

const server = express();

server.use(express.json());

let count = 1;

const projects = [ 
    { id: 1, title: 'projeto 1', tasks: [ {title: 'tarefa 1 P1'} ]}, 
    { id: 2, title: 'projeto 2', tasks: [ {title: 'tarefa 1 P2'} ]}, 
];

server.use((req, res, next) => {
    console.log(`${count++} requisição(ões) feita(as).`);
    return next();
});

function checkProjectExists(req, res, next) {
    if ( !projects.find((item => item.id == req.params.id)) ) {
        return res.status(400).json({ error: 'Project not found'});
    }

    return next();
}


// INDEX
server.get('/projects', (req, res) => {
    return res.json(projects);
});

// GET
server.get('/projects/:id', checkProjectExists, (req, res) => {
    const id = req.params.id;

    const project = projects.filter(item => item.id == id);

    return res.json(project); 
});

// CREATE PROJECT
server.post('/projects', (req, res) => {
    const project = req.body;

    projects.push(project);

    return res.json(projects);
});

// EDIT PROJECT
server.put('/projects/:id', checkProjectExists, (req, res) => {
    const id = req.params.id;
    const { title } = req.body;

    const project = projects.find((item, index, array) => item.id == id);
    project.title = title;

    return res.json({"projects": projects});
});

// DELETE PROJECT
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const id = req.params.id;

    projects.splice( projects.findIndex((item, index, array) => item.id == id), 1);
    return res.json(projects);
});

// CREATE TASK IN A PROJECT
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const id = req.params.id;
    const { title } = req.body;
    const project = projects.find((item, index, array) => item.id == id);

    project.tasks.push({title: title});

    return res.json(projects);
});

server.listen(3001);