import Promise from 'bluebird'
import cp from 'child_process'
import path from 'path'
import join from 'joinable'
import S from 'string'
import consts from '../../constants/serviceConstants'
S.TMPL_OPEN = '{'
S.TMPL_CLOSE = '}'

export default class ArchiveManager {

  setup (app, path) {
    this.app = app
    this.wailSettings = global.wailSettings
  }

  addWarcsToCol (id, data, params) {
    let opts = {
      cwd: this.wailSettings.get('warcs')
    }
    return new Promise((resolve, reject) => {
      // `/home/john/my-fork-wail/bundledApps/pywb/wb-manager add ${id} ${data.existingWarcs}`
      let exec = S(this.wailSettings.get('pywb.addWarcsToCol')).template({ col: id, warcs: data.existingWarcs }).s
      cp.exec(exec, opts, (error, stdout, stderr) => {
        if (error) {
          console.error(stderr)
          return reject(error)
        }

        let c1 = ((stdout || ' ').match(/INFO/g) || []).length
        let c2 = ((stderr || ' ').match(/INFO/g) || []).length
        let count = c1 === 0 ? c2 : c1

        console.log('added warcs to collection', id)
        console.log('stdout', stdout)
        console.log('stderr', stderr)
        return resolve(this.app.service('archives').update(id, { $inc: { numArchives: count } }))
      })
    })
  }

  addMetadata (id, data, params) {
    let opts = {
      cwd: this.wailSettings.get('warcs')
    }
    return new Promise((resolve, reject) => {
      let exec = S(this.wailSettings.get('pywb.addMetadata')).template({ col: id, metadata: join(...data.metadata) }).s
      cp.exec(exec, opts, (error, stdout, stderr) => {
        if (error) {
          console.error(stderr)
          return reject(error)
        }

        console.log('added metadata to collection', id)
        console.log('stdout', stdout)
        console.log('stderr', stderr)
        return resolve(this.app.service('archives').update(id, { $inc: { numArchives: count } }))
      })
    })
  }

  find (params, cb) {

  }

// GET /memgator
  //id cs.odu.edu params { query: {}, url: 'http:', provider: 'rest' }
  get (id, params, cb) {

  }

// POST /messages
  create (data, params, cb) {
    console.log(data, params)

    let { name } = data
    let opts = {
      cwd: this.wailSettings.get('warcs')
    }
    let exec = S(this.wailSettings.get('pywb.newCollection')).template({ col: name }).s
    return new Promise((resolve, reject) => {
      cp.exec(exec, opts, (error, stdout, stderr) => {
        if (error) {
          console.error(stderr)
          return reject(error)
        }
        console.log('created collection')
        let colpath = `${this.wailSettings.get('warcs')}${path.sep}collections${path.sep}${name}`
        let toCreate = {
          _id: name,
          name,
          colpath,
          archive: `${colpath}${path.sep}archive`,
          indexes: `${colpath}${path.sep}indexes`,
          colName: name,
          numArchives: 0
        }
        return resolve(this.app.service('archives').create(toCreate))
      })
    })

  }

// PUT /messages[/<id>]
  update (id, data, params, cb) {
    console.log('archiveManager update', id, data, params)
    let { action } = params.query
    let { addWarcs, addMetadata } = consts
    switch (action) {
      case addWarcs:
        return this.addWarcsToCol(id, data, params)
      case addMetadata:
        return this.addMetadata(id, data, params)
      default:
        return Promise.resolve({
          "yay": "hell yeah"
        })
    }
    // if (params.query.action === 'addWarcs') {
    //   return this.addWarcsToCol(id, data, params)
    // } else if (params.query.action === 'addMetadata') {
    //   return this.addMetadata(id, data, params)
    // } else {
    //   return Promise.resolve({
    //     "yay": "hell yeah"
    //   })
    // }

  }

// PATCH /messages[/<id>]
  patch (id, data, params, cb) {

  }

// DELETE /messages[/<id>]
  remove (id, params, cb) {

  }
}