// Задание
// Написать обработчик запроса:
// - Ответом на запрос `?hello=<name>` должна быть **строка** "Hello, <name>.", код ответа 200
// - Если параметр `hello` указан, но не передано `<name>`, то ответ **строка** "Enter a name", код ответа 400
// - Ответом на запрос `?users` должен быть **JSON** с содержимым файла `data/users.json`, код ответа 200
// - Если никакие параметры не переданы, то ответ **строка** "Hello, World!", код ответа 200
// - Если переданы какие-либо другие параметры, то пустой ответ, код ответа 500

const http = require("http");
const getUsers = require("./modules/users");

const HOST = "http://127.0.0.1";
const PORT = 3003;

const server = http.createServer((request, response) => {
  // Пишу для собственного понимания
  // Второй параметр является обязательным в данном случае
  // т.к. request.url - относительный url и нуждается в хосте
  const url = new URL(request.url, HOST);
  // Достаем ЗНАЧЕНИЕ параметра из queryString
  const userName = url.searchParams.get("hello");

  switch (true) {
    // get-запрос в root
    case request.url === "/":
      response.statusMessage = "OK";
      response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Hello World!");
      break;

    // Если параметр не передан
    case request.url === "/?hello=":
      response.statusMessage = "Bad Request";
      response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Enter the name!");
      break;

    //   Если параметр передан
    case Boolean(userName):
      response.statusMessage = "OK";
      response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(`Hello, ${userName}!`);
      break;

    //   Зварос к файлу, возвращает json
    case request.url === "/?users":
      response.statusMessage = "OK";
      response.writeHead(200, "Content-Type: application/json");
      response.end(getUsers);
      break;

    //   Если ничего выше не подошло.
    default:
      response.statusCode = 500;
      response.end("Пусть будет хоть что-то");
  }
});

server.listen(PORT, () => {
  console.log(`Сервер доступен по адресу: ${HOST}:${PORT}
  Запрос без указания user: ${HOST}:${PORT}/?hello=
  Запрос с указанием имени: ${HOST}:${PORT}/?hello=Alex
  Запрос к файлу: ${HOST}:${PORT}/?users
  Запрос бреда: ${HOST}:${PORT}/lkjh`);
});
