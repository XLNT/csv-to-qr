#!/usr/bin/env node

const path = require('path')
const pify = require('pify')
const csv = pify(require('csv'))
const fs = pify(require('fs'))
const shell = pify(require('shelljs'))

const main = async () => {
  const argv = require('minimist')(process.argv.slice(2));
  const [
    inputCsv,
    outputDirectory,
  ] = argv._;

  const csvFile = await fs.readFile(path.resolve(inputCsv))
  const parsed = await csv.parse(csvFile.toString())

  const fullOutputDirectory = path.resolve(outputDirectory)
  for (const [code, url] of parsed) {
    const outputFile = path.resolve(outputDirectory, `${code}.png`);
    const input = url
    await shell.exec(`qrencode -o ${outputFile} "${input}"`)
  }

}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
