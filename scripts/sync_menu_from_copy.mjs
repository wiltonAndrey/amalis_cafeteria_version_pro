import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const projectRoot = process.cwd()
const copyPath = path.join(projectRoot, 'copy_productos.md')
const publicDir = path.join(projectRoot, 'public')
const reportsDir = path.join(projectRoot, 'docs', 'reports')
const payloadPath = path.join(reportsDir, 'menu-copy-sync-payload.json')
const seoReportPath = path.join(reportsDir, 'menu-images-seo-audit.md')

const CATEGORY_MAP = {
  pasteleria: 'pasteleria',
  'bolleria salada': 'bolleria_salada',
  'bolleria dulce': 'bolleria_dulce',
  tostadas: 'tostadas',
  ofertas: 'ofertas',
  cafes: 'bebidas',
}

const MENU_CATEGORIES = [
  { id: 'all', label: 'Todos', sort_order: 0 },
  { id: 'tostadas', label: 'Tostadas', sort_order: 1 },
  { id: 'bolleria_dulce', label: 'Bollería Dulce', sort_order: 2 },
  { id: 'bolleria_salada', label: 'Bollería Salada', sort_order: 3 },
  { id: 'pasteleria', label: 'Pastelería', sort_order: 4 },
  { id: 'ofertas', label: 'Ofertas', sort_order: 5 },
  { id: 'bebidas', label: 'Bebidas', sort_order: 6 },
]

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n')
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function extractBullet(section, labels) {
  for (const label of labels) {
    const rx = new RegExp(`^- \\*\\*${escapeRegex(label)}:\\*\\*\\s*(.+)$`, 'm')
    const match = section.match(rx)
    if (match) {
      return cleanField(match[1])
    }
  }
  return ''
}

function cleanField(value) {
  let text = String(value ?? '').trim()
  if (
    (text.startsWith('"') && text.endsWith('"'))
    || (text.startsWith('`') && text.endsWith('`'))
  ) {
    text = text.slice(1, -1).trim()
  }
  return text
}

function foldText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function slugify(value) {
  return foldText(value).replace(/\s+/g, '_')
}

function parsePrice(priceText) {
  const normalized = priceText
    .replace(/\s/g, '')
    .replace('€', '')
    .replace(',', '.')
  const price = Number.parseFloat(normalized)
  if (Number.isNaN(price)) {
    throw new Error(`Invalid price: ${priceText}`)
  }
  return Number(price.toFixed(2))
}

function parseCommaList(text) {
  return text
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function parseAllergens(text) {
  const trimmed = text.trim()
  if (!trimmed) return []

  const firstPeriodIndex = trimmed.indexOf('.')
  if (firstPeriodIndex === -1) {
    return parseCommaList(trimmed.replace(/\.$/, ''))
  }

  const mainPart = trimmed.slice(0, firstPeriodIndex).trim()
  const tail = trimmed.slice(firstPeriodIndex + 1).trim()
  const items = parseCommaList(mainPart.replace(/\.$/, ''))

  if (tail) {
    items.push(tail)
  }

  return items
}

function normalizeCategory(categoryLabel) {
  const mapped = CATEGORY_MAP[foldText(categoryLabel)]
  if (!mapped) {
    throw new Error(`Unknown category label in copy: ${categoryLabel}`)
  }
  return mapped
}

function deriveBeverageSubcategory(name) {
  const key = foldText(name)
  if (key === 'infusion' || key === 'infusion especial') return 'infusiones'
  if (key === 'zumo de naranja' || key.startsWith('zumo ')) return 'zumos'
  if (key === 'cola cao') return 'cacao'
  return 'cafes'
}

function toPublicFsPath(relativeUrl) {
  return path.join(publicDir, relativeUrl.replace(/^\//, ''))
}

function fileExistsFromUrl(relativeUrl) {
  if (!relativeUrl.startsWith('/')) return false
  return fs.existsSync(toPublicFsPath(relativeUrl))
}

function swapImagePrefix(relativeUrl) {
  if (relativeUrl.startsWith('/images/productos/')) {
    return relativeUrl.replace('/images/productos/', '/images/products/')
  }
  if (relativeUrl.startsWith('/images/products/')) {
    return relativeUrl.replace('/images/products/', '/images/productos/')
  }
  return relativeUrl
}

function replaceImageExtension(relativeUrl, extension) {
  return relativeUrl.replace(/\.[a-z0-9]+$/i, extension)
}

function resolveImageUrl(imageOriginal) {
  const candidates = []
  const seen = new Set()
  const pushCandidate = (url, reason) => {
    if (!url || seen.has(url)) return
    seen.add(url)
    candidates.push({ url, reason })
  }

  pushCandidate(imageOriginal, 'original')

  const swappedPrefix = swapImagePrefix(imageOriginal)
  if (swappedPrefix !== imageOriginal) {
    pushCandidate(swappedPrefix, 'prefix')
  }

  if (/\.[a-z0-9]+$/i.test(imageOriginal)) {
    pushCandidate(replaceImageExtension(imageOriginal, '.webp'), 'extension')
  }

  if (swappedPrefix !== imageOriginal && /\.[a-z0-9]+$/i.test(swappedPrefix)) {
    pushCandidate(replaceImageExtension(swappedPrefix, '.webp'), 'prefix+extension')
  }

  const match = candidates.find(candidate => fileExistsFromUrl(candidate.url))
  if (!match) {
    return {
      finalImage: imageOriginal,
      exists: false,
      corrected: false,
      correctionKind: null,
    }
  }

  return {
    finalImage: match.url,
    exists: true,
    corrected: match.url !== imageOriginal,
    correctionKind: match.url !== imageOriginal ? match.reason : null,
  }
}

function parseSections(markdown) {
  const matches = [...markdown.matchAll(/^##\s+(\d+)\.\s+(.+)$/gm)]
  return matches.map((match, index) => {
    const start = match.index ?? 0
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? markdown.length) : markdown.length
    return {
      ordinal: Number.parseInt(match[1], 10),
      heading: match[2].trim(),
      body: markdown.slice(start, end).trim(),
    }
  })
}

function buildProductsFromCopy(markdown) {
  const products = []
  const imageAuditRows = []

  for (const section of parseSections(markdown)) {
    const name = extractBullet(section.body, ['Nombre'])
    const priceText = extractBullet(section.body, ['Precio'])
    const categoryLabel = extractBullet(section.body, ['Categoría'])
    const ingredientsText = extractBullet(section.body, ['Ingredientes', 'Ingredientes principales'])
    const allergensText = extractBullet(section.body, ['Alérgenos'])
    const imageOriginal = extractBullet(section.body, ['Nombre de archivo (URL)'])
    const altText = extractBullet(section.body, ['Texto alternativo (SEO "alt")'])
    const imageTitle = extractBullet(section.body, ['Título para la imagen (title)'])
    const description = extractBullet(section.body, ['Descripción (SEO / Copy listado)'])
    const chefSuggestion = extractBullet(section.body, ['Sugerencia del chef'])

    if (!name || !priceText || !categoryLabel || !description) {
      throw new Error(`Missing required fields in copy section ${section.ordinal}`)
    }

    const resolvedImage = resolveImageUrl(imageOriginal)
    const image = resolvedImage.finalImage

    const category = normalizeCategory(categoryLabel)
    const subcategory = category === 'bebidas' ? deriveBeverageSubcategory(name) : null

    products.push({
      name,
      price: parsePrice(priceText),
      category,
      subcategory,
      description,
      image,
      alt_text: altText,
      image_title: imageTitle,
      chef_suggestion: chefSuggestion,
      ingredients: parseCommaList(ingredientsText),
      allergens: parseAllergens(allergensText),
      featured: false,
      active: true,
      sort_order: section.ordinal,
      _source: {
        ordinal: section.ordinal,
        category_label: categoryLabel,
        original_image: imageOriginal,
      },
    })

    imageAuditRows.push({
      ordinal: section.ordinal,
      name,
      original: imageOriginal,
      final: image,
      corrected: resolvedImage.corrected,
      correctionKind: resolvedImage.correctionKind,
      exists: resolvedImage.exists,
    })
  }

  return { products, imageAuditRows }
}

function buildImageAudit(products, imageAuditRows) {
  const prefixCounts = { products: 0, productos: 0, other: 0 }
  const byImage = new Map()
  const missingImages = []
  const correctedPrefixRows = []

  for (const product of products) {
    if (product.image.startsWith('/images/products/')) prefixCounts.products++
    else if (product.image.startsWith('/images/productos/')) prefixCounts.productos++
    else prefixCounts.other++

    const list = byImage.get(product.image) ?? []
    list.push({ ordinal: product._source.ordinal, name: product.name })
    byImage.set(product.image, list)
  }

  for (const row of imageAuditRows) {
    if (row.corrected) correctedPrefixRows.push(row)
    if (!row.exists) missingImages.push(row)
  }

  const duplicateImagePaths = [...byImage.entries()]
    .filter(([, refs]) => refs.length > 1)
    .map(([image, refs]) => ({ image, refs }))
    .sort((a, b) => a.image.localeCompare(b.image))

  return {
    prefixCounts,
    duplicateImagePaths,
    missingImages,
    correctedPrefixRows,
  }
}

function writeSeoReport(audit) {
  fs.mkdirSync(reportsDir, { recursive: true })

  const lines = []
  lines.push('# SEO Audit - Menu Product Images')
  lines.push('')
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('## Prefix Summary')
  lines.push('')
  lines.push(`- /images/products/: ${audit.prefixCounts.products}`)
  lines.push(`- /images/productos/: ${audit.prefixCounts.productos}`)
  lines.push(`- Other prefixes: ${audit.prefixCounts.other}`)
  lines.push('')

  lines.push('## Auto-corrected Prefixes')
  lines.push('')
  if (audit.correctedPrefixRows.length === 0) {
    lines.push('- None')
  } else {
    for (const row of audit.correctedPrefixRows) {
      const reason = row.correctionKind ? ` (${row.correctionKind})` : ''
      lines.push(`- #${row.ordinal} ${row.name}: \`${row.original}\` -> \`${row.final}\`${reason}`)
    }
  }
  lines.push('')

  lines.push('## Duplicate Image Paths (review)')
  lines.push('')
  if (audit.duplicateImagePaths.length === 0) {
    lines.push('- None')
  } else {
    for (const dup of audit.duplicateImagePaths) {
      const refs = dup.refs.map(ref => `#${ref.ordinal} ${ref.name}`).join(' | ')
      lines.push(`- \`${dup.image}\` -> ${refs}`)
    }
  }
  lines.push('')

  lines.push('## Missing Files (pending)')
  lines.push('')
  if (audit.missingImages.length === 0) {
    lines.push('- None')
  } else {
    for (const row of audit.missingImages) {
      lines.push(`- #${row.ordinal} ${row.name}: \`${row.final}\``)
    }
  }
  lines.push('')

  fs.writeFileSync(seoReportPath, `${lines.join('\n')}\n`, 'utf8')
}

function stripInternalFields(products) {
  return products.map(({ _source, ...product }) => product)
}

function runPhp(commandArgs, stdinText = null) {
  const result = spawnSync('php', commandArgs, {
    cwd: projectRoot,
    encoding: 'utf8',
    input: stdinText ?? undefined,
  })
  return result
}

function main() {
  const argv = new Set(process.argv.slice(2))
  const shouldSync = !argv.has('--no-sync')

  const markdown = readUtf8(copyPath)
  const { products, imageAuditRows } = buildProductsFromCopy(markdown)
  const imageAudit = buildImageAudit(products, imageAuditRows)

  writeSeoReport(imageAudit)

  const payload = {
    action: 'sync_menu_products',
    match_by: 'name_category',
    deactivate_missing: true,
    menuCategories: MENU_CATEGORIES,
    products: stripInternalFields(products),
  }

  fs.mkdirSync(reportsDir, { recursive: true })
  fs.writeFileSync(payloadPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

  const summary = {
    products_count: payload.products.length,
    category_counts: payload.products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] ?? 0) + 1
      return acc
    }, {}),
    image_prefix_counts: imageAudit.prefixCounts,
    auto_corrected_prefixes: imageAudit.correctedPrefixRows.length,
    duplicate_image_paths: imageAudit.duplicateImagePaths.length,
    missing_image_files: imageAudit.missingImages.length,
    payload_path: path.relative(projectRoot, payloadPath),
    seo_report_path: path.relative(projectRoot, seoReportPath),
  }

  if (!shouldSync) {
    console.log(JSON.stringify({ ok: true, mode: 'dry-run', summary }, null, 2))
    return
  }

  const taxonomyMigration = runPhp(['api/update_schema_menu_taxonomy.php'])
  if (taxonomyMigration.status !== 0) {
    process.stderr.write(taxonomyMigration.stderr || '')
    process.stdout.write(taxonomyMigration.stdout || '')
    process.exit(taxonomyMigration.status ?? 1)
  }

  const migration = runPhp(['api/update_schema_chef_suggestion.php'])
  if (migration.status !== 0) {
    process.stderr.write(migration.stderr || '')
    process.stdout.write(migration.stdout || '')
    process.exit(migration.status ?? 1)
  }

  const sync = runPhp(['api/utils/sync_products.php'], JSON.stringify(payload))
  process.stdout.write(taxonomyMigration.stdout || '')
  process.stdout.write(migration.stdout || '')
  if (sync.stdout) process.stdout.write(sync.stdout)
  if (sync.stderr) process.stderr.write(sync.stderr)

  if (sync.status !== 0) {
    process.exit(sync.status ?? 1)
  }

  console.log(`\nSYNC_SUMMARY ${JSON.stringify(summary)}`)
}

main()
