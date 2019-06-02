# Web Services
This project is about connecting my blockchain to a web service that users can interact with.
I have build an API web service using NodeJS that allows you to post new blocks, then retrieve existing block of the private blockchain.

This API web service is built using [Express.js](https://expressjs.com/) framework.

# Deployment Guidance

1. Navigate to the project directory.
2. Run `npm install` on terminal to install all project dependencies.
3. Run `node app.js` so start the server and if it starts sucessfully you will see the message `myBlockchain API is listening on port 8000`

# API Endpoints

## POST /block

POST Block endpoint with body payload option.

http://localhost:8000/block

POST request with url path http://localhost:8000/block with body payload option.

### Example
```
curl -X "POST" "http://localhost:8000/block" -H 'Content-Type: application/json' -d $'{"body":"block body contents"}'
```

### Sample Request

POST : http://localhost:8000/block
Content-Type: application/json
Request body: {"body":"block body contents"}

### Sample Response

```
{"hash":"e2b918c3bfdefa905d9f80de9be269089ab1a94a207fe103f71adcf2d2fb5975","height":1,"body":"block body contents","time":"1559446176","previousBlockHash":"63a7836116661a1ab0eec71babefaad3ce14b64263ca252942c689f348d5b171"}
```

## GET /block/{BLOCK_HEIGHT}

Block endpoint using URL path with block height parameter.

http://localhost:8000/block/{BLOCK_HEIGHT}

### Example

Open `http://localhost:8000/block/0` to get the first block of the private blockchain.

### Sample Output

```
{"hash":"63a7836116661a1ab0eec71babefaad3ce14b64263ca252942c689f348d5b171","height":0,"body":"First block in the chain - Genesis block","time":"1559446176","previousBlockHash":""}
```
