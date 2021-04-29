import { Application } from 'express'

import * as swaggerUI from 'swagger-ui-express'
import * as swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Socialama',
      description: 'This is a sample server for Socialama.',
      termsOfService: 'http://example.com/terms/',
      contact: {
        name: 'API Support',
        url: 'http://www.example.com/support',
        email: 'support@example.com',
      },
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
      },
      version: '1.0.0',
      /* consumes: 'application/json;charset=UTF-8',
      produces: 'application/json;charset=UTF-8', */
    },
    servers: [
      {
        url: 'http://' + process.env.HOST + ':' + process.env.PORT + '/v1', //change this
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./src/routes/*.ts'],
}

const specs = swaggerJSDoc(options)

export default (app: Application) => {
  app.use('/v1/api-docs', swaggerUI.serve, swaggerUI.setup(specs, { swaggerOptions: { displayRequestDuration: true } }))
}
