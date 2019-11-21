const DbUtilsMixin = require('@bit/amazingdesign.moleculer.db-utilsmixin')

module.exports = {
  name: 'system-collections',

  mixins: [DbUtilsMixin],

  settings: {
    requiredPrivileges: {
      get: ['admin', 'superadmin'],
    },
    exposedCollections: [
      'users',
    ]
  },

  actions: {
    get(ctx) {
      return Promise.all(
        this.settings.exposedCollections.map(this.getSchema)
      )
    }
  },

  methods: {
    getSchema(collectionName) {
      return this.broker.call(`${collectionName}.getSchema`)
        .then((data) => ({ name: collectionName, ...data }))
    },
  }
}