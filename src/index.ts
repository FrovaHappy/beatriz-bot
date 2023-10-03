import startClient from './client'
import deployCommand from './deployCommands'
;(async () => {
  await deployCommand()
  await startClient()
})()
