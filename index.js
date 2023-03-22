const express = require("express")

var {graphqlHTTP } = require("express-graphql")
var {buildSchema} = require("graphql")

var app = express()

app.use(express.static('public'));

class Coche {
    constructor(id, tipo) {
        this.id = id;
        this.tipo = tipo;
    }
}

const schema = buildSchema(`
    type Query{
        saludo: String,
        consultaCoche (id: Int!): Coche,
    }
    type Coche{
        id: Int,
        tipo: String
    }
    input ModeloEntrada{
        tipo: String
    }
    type Mutation{
        nuevoModelo(modelo: ModeloEntrada): Coche
    }
`)

const root = {
    saludo: () => {
        return 'Hola Mundo'
    },
    consultaCoche: ({ id }) => {
        if (!id) {
            throw new Error('id no informado')
        }
        return fakeDB.find(e => e.id === id);
    },
    nuevoModelo: ({ modelo }) => {
        if (!modelo) {
            throw new Error('id no informado')
        }
        const newId = fakeDB.length + 1;
        fakeDB.push(new Coche(newId, modelo.tipo));
        return new Coche(newId, modelo.tipo);
    }
}



const fakeDB = [ new Coche(1, 'deportivo')]

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))

app.listen(4000);

console.log('Running a GraphQL API server at http://localhost:4000/graphql');

