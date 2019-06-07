# Web Services
This project is about connecting my blockchain to a web service that users can interact with.
I have build an API web service using NodeJS that allows you to post new blocks, then retrieve existing block of the private blockchain.

This API web service is built using [Express.js](https://expressjs.com/) framework.

# Deployment Guidance

1. Navigate to the project directory.
2. Run `npm install` on terminal to install all project dependencies.
3. Run `node app.js` so start the server and if it starts sucessfully you will see the message `myBlockchain Service API is listening on port 8000`

# API Endpoints

## POST /requestValidation

http://localhost:8000/requestValidation

POST request with url path http://localhost:8000/requestValidation with address payload option.

### Example
```
curl -X "POST" "http://localhost:8000/requestValidation" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
            "address": "1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx"
          }'
```

### Sample Request

POST : http://localhost:8000/requestValidation
Content-Type: application/json
Request body: {"address": "1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx"}

### Sample Response
```
{
    "address": "1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx",
    "requestTimeStamp": "1559841383445",
    "message": "1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx:1559841383445:starRegistry",
    "validationWindow": 300
}
```

## POST /message-signature/validate

http://localhost:8000/message-signature/validate

POST request with url path http://localhost:8000/message-signature/validate with address and signature payload option.

### Example
```
curl -X "POST" "http://localhost:8000/message-signature/validate" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
            "address": "1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx",
            "signature": "H/iqSmdsSFDOeqAG+6Dz5ecdSLO8bomOuHRwSnmiCOEfPXAr4h9ngb0L+tpsl+crZKwmmIH6M6qjWgsNqtKlJY8="
          }'
```

### Sample Request

POST : http://localhost:8000/message-signature/validate
Content-Type: application/json
Request body: {"address": "1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx", "signature": "H/iqSmdsSFDOeqAG+6Dz5ecdSLO8bomOuHRwSnmiCOEfPXAr4h9ngb0L+tpsl+crZKwmmIH6M6qjWgsNqtKlJY8="}

### Sample Response
```
{
    "registerStar": true,
    "status": {
        "address": "1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx",
        "requestTimeStamp": "1559841383445",
        "message": "1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx:1559841383445:starRegistry",
        "validationWindow": "228.86700000000002",
        "messageSignature": true
    }
}
```

## POST /block

http://localhost:8000/block

POST request with url path http://localhost:8000/block with address and star payload option.

### Example
```
curl -X "POST" "http://localhost:8000/block" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
            "address": "1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx",
            "star": {
              "dec": "-26° 29' 24.9",
              "ra": "16h 29m 1.0s",
              "story": "Found star using https://www.google.com/sky/"
            }
          }'
```

### Sample Request

POST : http://localhost:8000/block
Content-Type: application/json
Request body: {"address":"1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx","star":{"dec":"-26° 29' 24.9","ra":"16h 29m 1.0s","story":"Found star using https://www.google.com/sky/"}}

### Sample Response
```
{
    "hash": "33bd03235f29d8c7cd717921771950ff16e8ab89593199ba2282b968a791808f",
    "height": 2,
    "body": {
        "address": "1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx",
        "star": {
            "dec": "-26° 29' 24.9",
            "ra": "16h 29m 1.0s",
            "story": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1559842082",
    "previousBlockHash": "e2b918c3bfdefa905d9f80de9be269089ab1a94a207fe103f71adcf2d2fb5975"
}
```

## GET /stars/address:[address]

Get stars endpoint using URL path with block address parameter.

http://localhost:8000/stars/address:[address]

### Example
Open `http://localhost:8000/stars/address:1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx` to get the stars of `1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx` address.

### Sample Output

```
[
    {
        "hash": "82256bfa401e69eda9f4442e27b9b013314d3517919a00318a04ea0d859b9e35",
        "height": 1,
        "body": {
            "address": "1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx",
            "star": {
                "dec": "-26° 29' 24.9",
                "ra": "16h 29m 1.0s",
                "story": "Rm91bmQgc3RhciB1c2luZyBodHRwczovL3d3dy5nb29nbGUuY29tL3NreS8=",
                "storyDecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "time": "1559889291",
        "previousBlockHash": "e57329a494be7625c5c60ea39ad3c99986bb36858de15f5344c099ec5ec32f52"
    }
]
```

## GET /stars/hash:[hash]

Get star endpoint using URL path with block hash parameter.

http://localhost:8000/stars/hash:[hash]

### Example
Open `http://localhost:8000/stars/hash:82256bfa401e69eda9f4442e27b9b013314d3517919a00318a04ea0d859b9e35` to get the stars having `82256bfa401e69eda9f4442e27b9b013314d3517919a00318a04ea0d859b9e35` as hash.

### Sample Output

```
{
    "hash": "82256bfa401e69eda9f4442e27b9b013314d3517919a00318a04ea0d859b9e35",
    "height": 1,
    "body": {
        "address": "1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx",
        "star": {
            "dec": "-26° 29' 24.9",
            "ra": "16h 29m 1.0s",
            "story": "Rm91bmQgc3RhciB1c2luZyBodHRwczovL3d3dy5nb29nbGUuY29tL3NreS8=",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1559889291",
    "previousBlockHash": "e57329a494be7625c5c60ea39ad3c99986bb36858de15f5344c099ec5ec32f52"
}
```

## GET /block/{BLOCK_HEIGHT}

Block endpoint using URL path with block height parameter.

http://localhost:8000/block/{BLOCK_HEIGHT}

### Example
Open `http://localhost:8000/block/1` to get the second block of the private blockchain.

### Sample Output

```
{
    "hash": "82256bfa401e69eda9f4442e27b9b013314d3517919a00318a04ea0d859b9e35",
    "height": 1,
    "body": {
        "address": "1Jtcy3Am9LR9JYZSJuN1DbmpJVsAnHRFNx",
        "star": {
            "dec": "-26° 29' 24.9",
            "ra": "16h 29m 1.0s",
            "story": "Rm91bmQgc3RhciB1c2luZyBodHRwczovL3d3dy5nb29nbGUuY29tL3NreS8=",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1559889291",
    "previousBlockHash": "e57329a494be7625c5c60ea39ad3c99986bb36858de15f5344c099ec5ec32f52"
}
```
