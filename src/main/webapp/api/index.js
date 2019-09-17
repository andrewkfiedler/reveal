import config from './config.json'
import configUi from './configUi.json'
import metacardType from './metacard-type'
import randomize from './random'

const responseTable = {
  './internal/config': config,
  './internal/platform/config/ui': configUi,
  './internal/metacardtype': metacardType,
}

export default async url => {
  await randomize()

  const response = responseTable[url]

  return response
}
