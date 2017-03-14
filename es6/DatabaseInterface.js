'use strict'
import fs from 'fs'

// @flow 

const store: string = '../jobs.json'

export function initStorage() {

}

export function saveJobListToStorage(jobs: []): Promise<(res: Function, rej: Function) => void> {
  return new Promise((resolve, reject) => {
    let j: string = JSON.stringify(jobs)
    fs.writeFile(store, j, 'utf8', err => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

export function loadJobListFromStorage(uri: string): Promise<> {
  return new Promise((resolve, reject) => {
    fs.readFile(store, (err, data) => {
      //TODO parse data 
      //TODO handle error 
    })
  })
}

export function hasPreviousState(): boolean {

}