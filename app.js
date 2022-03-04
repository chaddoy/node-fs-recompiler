const {
  promises: { readdir },
  readFile: fsReadFile,
  writeFile: fsWriteFile,
  appendFile: fsAppendFile,
} = require('fs')
const util = require('util')
const readFile = util.promisify(fsReadFile)
const writeFile = util.promisify(fsWriteFile)
const appendFile = util.promisify(fsAppendFile)

const getComps = (files = []) =>
  `${files
    .map((file) => {
      const name = file.split('.js').join('')
      return `import ${name}Icon from './${name}'`.split('import 3D').join('import ThreeD')
    })
    .join('\n')}`

const getCompsIcons = (files = []) =>
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
        .split('const 3D')
        .join('const ThreeD')
        .split(`
      3D`)
        .join(`
      ThreeD`)
        .split(': 3D')
        .join(': ThreeD')
    })
    .join('\n')}`

const getDocsIcons = (files = [], tabs = '') =>
  `${files
    .map((file) => {
      const name = file.split('.js').join('')
      return `${tabs}${name}: ${name}Icon,`
        .split(`${tabs}3D`).join(`${tabs}ThreeD`)
        .split(`: 3D`).join(`: ThreeD`)
    })
    .join('\n')}`

const getIndex = (files = []) => `${files
  .map((file) => {
    const name = file.split('.js').join('')
    return `import ${name} from './${name}'`.split('import 3D').join('import ThreeD')
  })
  .join('\n')}

export {
${files.map((file) => `\t${file.replace('.js', '')},`).join('\n').split('\t3D').join('\tThreeD')}
}`

const rebuild = async (src, dir) => {
  const source = `./${src}/${dir}`
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
        .join(getCompsIcons(files))
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
        .split('[TYPE]')
        .join(src)
        .split('[PARENT]')
        .join(`${source.split('/').pop()}`.split('-').join(' '))
        .split('[CAT]')
        .join(`${dir.split('-').join(' ')}`)
        .split('[ICON_NAMES]')
        .join(
          `${files.map((file) =>
            `'${file
              .split('.js')
              .join('')
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace('3D', '3D ')
              // .split('3D')
              // .join('3D ')
            }'`
          ).join(', ')}`
        )
    )
    return await writeFile(`${fullDir}/index.ts`, getIndex(files))
    // console.log(`bbit add ${fullDir.replace('./', 'components/')} -i ${fullDir.replace('./', '').toLowerCase()}`)
  })
}

const harmonyfy = async (source) =>
  (await readdir(`./${source}`, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort()
    .forEach((dir) => rebuild(source, dir))

const getMissingCmds = async (source = '') => {
  const add = (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      const fullDir = `${source}/${dirent.name}`
      return `bbit add ${fullDir.replace('./', 'components/')} -i ${fullDir.replace('./', '').toLowerCase()}`
    })
    .sort()
    .join(' && ')

  const compile = (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => `${source}/${dirent.name}`.replace('./', '').toLowerCase())
    .sort()
    .join(' ')

  return await appendFile(`./commands.txt`, `${add} && bbit compile ${compile} && bbit tag ${compile} && `)
}

const saveCommands = async (source, cat) => {
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((n) => n === cat)
    .sort()
    .forEach((dir) => getMissingCmds(`${source}/${dir}`))
}

const getCommands = async (source) => {
  const dirs = (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort()
    .forEach((cat) => saveCommands(source, cat))
}

// harmonyfy('regular')
getCommands('./regular')
