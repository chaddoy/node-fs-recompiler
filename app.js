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

const getDirectories = async (source = '') => {
  const dirs = (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  await dirs.map(async (dir) => {
    const fullDir = `${source}/${dir}`
    const files = await readdir(fullDir)
    const filteredFiles = files.filter(
      (file) =>
        file !== 'index.ts' && file !== 'Icon.js' && file !== 'index.compositions.tsx' && file !== 'index.docs.mdx'
    )
    await filteredFiles.map(async (file) => {
      const newFile = (await readFile(`${fullDir}/${file}`, 'utf8')).replace('../../../Icon', './Icon')
      return await writeFile(`${fullDir}/${file}`, newFile)
    })

    await writeFile(`${fullDir}/Icon.js`, await readFile('./Icon.js', 'utf8'))
    await writeFile(
      `${fullDir}/index.compositions.tsx`,
      (await readFile('./index.compositions.txt', 'utf8'))
        .split('[IMPORTS]')
        .join(getComps(filteredFiles))
        .split('[EXPORTS]')
        .join(getCompsIcons(filteredFiles, '\t\t\t'))
    )
    await writeFile(
      `${fullDir}/index.docs.mdx`,
      (await readFile('./index.docs.txt', 'utf8'))
        .split('[IMPORTS]')
        .join(getComps(filteredFiles))
        .split('[ICONS]')
        .join(getDocsIcons(filteredFiles, '\t\t'))
        .split('[PARENT]')
        .join(`${source.split('/').pop()}`.split('-').join(' '))
    )
    await writeFile(`${fullDir}/index.ts`, getIndex(filteredFiles))
    console.log(
      `bbit add ${fullDir.replace('./', 'components/')} -i ${fullDir
        .replace('./', '')
        .toLowerCase()}`
    )
  })
}

getDirectories('./bold/01-Interface-Essential')
