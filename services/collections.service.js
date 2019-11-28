const DbService = require('../db/main')
const DbUtilsMixin = require('../bits/db-utilsmixin')

const EventDispatcherMixin = require('../bits/event-dispatcher.mixin')

module.exports = {
  name: 'collections',

  collection: 'collections',

  mixins: [
    DbService,
    DbUtilsMixin,
    EventDispatcherMixin,
  ],

  hooks: {
    before: {
      'create': [
        'throwWhenNameExists',
      ],
    },
  },

  settings: {
    requiredPrivileges: {
      count: ['admin', 'superadmin'],
      get: ['admin', 'superadmin'],
      list: ['admin', 'superadmin'],
      create: ['superadmin'],
      insert: ['superadmin'],
      update: ['superadmin'],
      remove: ['superadmin'],
    },
    fields: [
      '_id',
      'name',
      'displayName',
      'tableFields',
      'schema',
      'requiredPrivileges',
      'singleton',
    ],
    entityValidator: {
      required: ['name', 'tableFields'],
      type: 'object',
      properties: {
        name: { type: 'string' },
        displayName: { type: 'string' },
        tableFields: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              fieldType: { type: 'string' },
              name: { type: 'string' },
              label: { type: 'string' },
              props: { type: 'object' },
              displayAsTableColumn: { type: 'boolean' },
              initialValue: {},
            },
          },
        },
        schema: { $ref: 'http://json-schema.org/draft-07/schema#' },
        requiredPrivileges: {
          type: 'object',
          additionalProperties: false,
          properties: {
            count: { type: 'array', items: { type: 'string' } },
            list: { type: 'array', items: { type: 'string' } },
            create: { type: 'array', items: { type: 'string' } },
            insert: { type: 'array', items: { type: 'string' } },
            get: { type: 'array', items: { type: 'string' } },
            update: { type: 'array', items: { type: 'string' } },
            remove: { type: 'array', items: { type: 'string' } },
          },
        },
        singleton: { type: 'boolean' }
      }
    },
  },

  actions: {
    async getSchema(ctx) {
      return {
        schema: {
          required: ['name', 'tableFields'],
          type: 'object',
          properties: {
            name: { type: 'string' },
            displayName: { type: 'string' },
            tableFields: {
              type: 'array',
              // minItems: 1,
              items: {
                type: 'object',
                // additionalProperties: false,
                properties: {
                  fieldType: { type: 'string' },
                  name: { type: 'string' },
                  label: { type: 'string' },
                  props: { type: 'object', properties: {} },
                  initialValue: { type: 'string' },
                  displayAsTableColumn: { type: 'boolean' },
                },
              },
              uniforms: { component: 'ListFieldReorder' }
            },
            schema: { type: 'object', properties: {}, uniforms: { component: 'MonacoEditorField', language: 'json' } },
            requiredPrivileges: {
              type: 'object',
              additionalProperties: false,
              properties: {
                count: { $ref: '#/definitions/privileges' },
                list: { $ref: '#/definitions/privileges' },
                create: { $ref: '#/definitions/privileges' },
                insert: { $ref: '#/definitions/privileges' },
                get: { $ref: '#/definitions/privileges' },
                update: { $ref: '#/definitions/privileges' },
                remove: { $ref: '#/definitions/privileges' },
              },
            },
            singleton: { type: 'boolean' }
          },
          definitions: {
            privileges: {
              type: 'array',
              items: { type: 'string' },
              options: await this.createOptionsFromService('privileges', 'name', 'name'),
              uniforms: { checkboxes: true },
            }
          }
        },
        icon: 'fas fa-database',
        displayName: 'Collections',
        tableFields: [
          { label: 'Name', name: 'name', displayAsTableColumn: true },
        ]
      }
    },
  },

  methods: {
    throwWhenNameExists(ctx) {
      return this.throwWhenFieldExists('name')(ctx)
    }
  }

}