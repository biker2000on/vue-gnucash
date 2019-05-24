const bcrypt = require('bcryptjs')

const resolvers = {
  Query: {
    async user (root, {id}, {models}) {
      return models.User.findByPk(id)
    },
    async allRecipes (root, args, {models}) {
      return models.Recipe.findAll()
    },
    async recipe (root, {id}, {models}) {
      return models.Recipe.findById(id)
    }
  },
  Mutation: {
    async insert_user (root, {name, email, password}, {models}) {
      return models.User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10)
      })
    },
    async insert_recipe (root, {userId, title, ingredients, directions}, {models}) {
      return models.Recipe.create({
        userId,
        title,
        ingredients,
        directions,
      })
    }
  },
  User: {
    async recipes (user) {
      return user.getRecipes()
    }
  },
  Recipe: {
    async user (recipe) {
      return recipe.getUser()
    }
  }
}

module.exports = resolvers