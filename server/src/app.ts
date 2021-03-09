import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { Request, Response } from 'express'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'
import Routes from './routes/index'

import { checkAuth } from './middleware/CheckAuth'
import { createUsers } from './faker/createUsers'

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express()
    app.use(cors({ credentials: true, origin: 'http://localhost:8080' }))
    app.use(bodyParser.json())
    app.use(cookieParser())

    // Monitoring tool
    /* const monitor = require('express-status-monitor')()
    app.use(monitor)
    app.get('/stats', monitor.pageRoute) */

    // register express routes from defined application routes
    Routes.forEach((route) => {
      ;(app as any)[route.method](
        '/api' + route.route,
        'middleware' in route
          ? [route.middleware]
          : (req: Request, res: Response, next: Function) => {
              next() // move on
            },
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](req, res, next)

          if (result instanceof Promise) {
            result.then((result) => (result !== null && result !== undefined ? res.send(result) : undefined))
            //console.log('1st')
          } else if (result !== null && result !== undefined) {
            //console.log('2nd')
            res.json(result)
          }
        }
      )
    })

    // Basic route
    app.get('/api/bye', checkAuth, (req: Request, res: Response, next: Function) => {
      res.json({ user: 'mark', pass: 'verysecretxd' })
    })

    // default 404 route
    app.use((req, res) => {
      res.status(404).send({
        error: {
          name: 'Error',
          status: 404,
          message: 'Invalid Request',
          statusCode: 404,
          stack: `http://${process.env.NODE_ENV === 'development' ? 'localhost' : process.env.HOST}:${
            process.env.PORT
          }/`,
        },
        message: 'Testing!',
      })
    })

    // setup express app here
    app.set('json spaces', 4)

    // Faker
    //createUsers(100)

    if (process.env.NODE_ENV === 'development') {
      console.log('Server is in development mode!')
    }

    // start express server
    const mode = process.env.NODE_ENV === 'development' ? 'localhost' : process.env.HOST
    app.listen({ host: mode, port: process.env.PORT })

    console.log(`Express server has started on port ${process.env.PORT}.`)
    console.log(`Open http://${mode}:${process.env.PORT}/api/users to see results.`)
  })
  .catch((error) => console.log(error))