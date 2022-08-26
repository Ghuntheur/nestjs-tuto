import { rm } from 'fs/promises'
import * as path from 'path'

global.beforeEach(async () => {
  try {
    await rm(path.join(__dirname, '..', 'test.sqlite'))
  } catch {}
})
