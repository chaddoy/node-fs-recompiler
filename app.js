const {
  promises: { readdir },
  readFile: fsReadFile,
  writeFile: fsWriteFile,
} = require('fs')
const util = require('util')
const readFile = util.promisify(fsReadFile)
const writeFile = util.promisify(fsWriteFile)

const getComps = (files = []) =>
  `${files
    .map((file) => {
      const name = file.split('.js').join('')
      return `import ${name}Icon from './${name}'`
    })
    .join('\n')}`

const getCompsIcons = (files = [], tabs = '') =>
  `${files
    .map((file) => {
      const name = file.split('.js').join('')
      return `export const ${name} = () => (
  <Gallery
    icons={{
      ${name}: ${name}Icon
    }}
  />
)`
    })
    .join('\n')}`

const getDocsIcons = (files = [], tabs = '') =>
  `${files
    .map((file) => {
      const name = file.split('.js').join('')
      return `${tabs}${name}: ${name}Icon,`
    })
    .join('\n')}`

const getIndex = (files = []) => `${files
  .map((file) => {
    const name = file.split('.js').join('')
    return `import ${name} from './${name}'`
  })
  .join('\n')}

export {
${files.map((file) => `\t${file.replace('.js', '')},`).join('\n')}
}`

const rebuild = async (source = '') => {
  const dirs = (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  await dirs.map(async (dir) => {
    const fullDir = `${source}/${dir}`
    const rawFiles = await readdir(fullDir)
    const files = rawFiles
      .filter(
        (file) =>
          file !== 'index.ts' && file !== 'Icon.js' && file !== 'index.compositions.tsx' && file !== 'index.docs.mdx'
      )
      .sort()
    await files.map(async (file) => {
      const newFile = (await readFile(`${fullDir}/${file}`, 'utf8')).replace('../../../Icon', './Icon')
      return await writeFile(`${fullDir}/${file}`, newFile)
    })

    await writeFile(`${fullDir}/Icon.js`, await readFile('./Icon.js', 'utf8'))
    await writeFile(
      `${fullDir}/index.compositions.tsx`,
      (await readFile('./index.compositions.txt', 'utf8'))
        .split('[IMPORTS]')
        .join(getComps(files))
        .split('[EXPORTS]')
        .join(getCompsIcons(files, '\t\t\t'))
    )
    await writeFile(
      `${fullDir}/index.docs.mdx`,
      (
        await readFile('./index.docs.txt', 'utf8')
      )
        .split('[IMPORTS]')
        .join(getComps(files))
        .split('[ICONS]')
        .join(getDocsIcons(files, '\t\t'))
        .split('[PARENT]')
        .join(`${source.split('/').pop()}`.split('-').join(' '))
    )
    await writeFile(`${fullDir}/index.ts`, getIndex(files))
    console.log(`bbit add ${fullDir.replace('./', 'components/')} -i ${fullDir.replace('./', '').toLowerCase()}`)
  })
}

const getCommands = async (source) =>
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort()
    .forEach((dir) => rebuild(`${source}/${dir}`))

getCommands('./bold')
