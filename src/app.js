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
  const { owner } = request.query;
  const filteredRepositories = owner
    ? repositories.filter(repository => repository.owner.includes(owner))
    : repositories;
  return response.json(filteredRepositories);
});

app.post("/repositories", (request, response) => {
  const { title, owner, url } = request.body;
  const id = uuid();
  const repository = { id, title, owner, url, likes: []}
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id = id);
  if(repositoryIndex < 0) return response.status(400).json({ message: 'Repository not found'});
  const { title, owner, url } = request.body;
  updatedRepository = { id, title, owner, url, likes: repositories[repositoryIndex].likes }
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
  const { owner } = request.body;
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if(!repositoryIndex < 0) return response.status(400).json({ message: 'Repository not found'});
  repositories[repositoryIndex].likes.push({ id: uuid(), owner });
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
