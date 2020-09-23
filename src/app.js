const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4')

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateId = (request, response, next) => {
  const { id } = request.params;
  if(!isUuid(id)) return response.status(400).json({ message: "Invalid ID"});
  return next();
}

app.use('/repositories/:id', validateId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, techs, url } = request.body;
  const id = uuid();
  const repository = { id, title, url, techs, likes: 0 }
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id = id);
  if(repositoryIndex < 0) return response.status(400).json({ message: 'Repository not found'});
  const { title, techs, url } = request.body;
  updatedRepository = { id, title, techs, url, likes: repositories[repositoryIndex].likes }
  repositories[repositoryIndex] = updatedRepository;
  return response.json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if(repositoryIndex < 0) return response.status(400).json({ message: 'Repository not found'});
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if(!repositoryIndex < 0) return response.status(400).json({ message: 'Repository not found'});
  repositories[repositoryIndex].likes += 1;
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
