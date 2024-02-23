import startClient from './client'
import deployCommand from './deployCommands'
import { upsertSetting } from './setting'
;(async () => {
  await upsertSetting({})
  await deployCommand()
  await startClient()
})()
