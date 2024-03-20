If we want to use same lambda to process several different HTTP requests. Therefore our lambda should process API Gateway Event objects. It would be nice to not create instances of services for every single request processing. Service once instantiated should be reusable.

Here we are checking startup times for three different solutions.

### Nest.js

Microservice is implemented and API Gateway Events are processed as regular HTTP requests (via express). It is expected that startup time will be the longest here. TypeORM is used for DB access.

### Typescript

We don't really need all the features Nest.js provides to implement our solution. Only things needed are depencency injection and a clear separation between repository and service layers. Dependency injection is trivial to implement as it is simply a big map with object name as a key and the object itself as a value. Implementing lazy loading for every single DI is a bit of a chore but it is doable. Dynamic imports at the top level (router in lambda entry point) also speeds things up.

### CommonJS

Same thing as in typescript but in CommonJS. There is less code to write but there are no type safeguards. In order to avoid holding all the object definitions in memory we use JSDoc. With JSDoc we can define all the type definitions in comments, so the age old javascript question "what THIS is?" can be answered easily by looking up the type in docs.
