### Usage

```
npm i
node app.js
```

### Run tests

```
npm run test
```

### Example usage

Get sports
```
$ curl localhost:3000/sports
```
Gets events for sport
```
curl localhost:3000/sports/100/events
```
Gets all events
```
curl localhost:3000/events
```
Gets details for event
```
curl localhost:3000/events/1443185300
```
Gets all sport in all langauges
```
curl localhost:3000/sports/all-languages
```
Using language header
```
$ curl -H 'accept-language: de' localhost:3000/sports
```
