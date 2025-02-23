import { todoMutations } from "./todos/Mutations.js"
import { todoQueries } from "./todos/Queries.js"
import userMutations from "./users/Mutations.js"
import userQueries from "./users/Queries.js"

const resolvers={

Query:{

    ...userQueries,
    ...todoQueries

},
Mutation:{

    ...userMutations,
    ...todoMutations
}

}


export default resolvers