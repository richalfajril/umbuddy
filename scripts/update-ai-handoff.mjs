import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const targetFile = path.resolve(rootDir, 'all_markdown/04_guidelines/AI_HANDOFF_STATE.md')

const MARKER_START = '<!-- AI_HANDOFF_AUTO_START -->'
const MARKER_END = '<!-- AI_HANDOFF_AUTO_END -->'

function runGitCommand(command) {
  try {
    return execSync(command, { cwd: rootDir, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim()
  } catch (err) {
    return `[Gagal mengambil data: ${err.message}]`
  }
}

function generateSnapshot() {
  const date = new Date().toLocaleString('id-ID', { timeZoneName: 'short' })
  const branch = runGitCommand('git branch --show-current') || 'Tidak diketahui'
  const gitStatusShort = runGitCommand('git status --short')
  const isDirty = gitStatusShort.length > 0
  const latestCommit = runGitCommand('git log -1 --oneline') || 'Tidak ada commit'
  const last5Commits = runGitCommand('git log -5 --oneline') || 'Tidak ada commit'

  // Attempt to check unpushed commits count
  let unpushedText = 'Tidak diketahui'
  try {
    const trackingBranch = runGitCommand(`git rev-parse --abbrev-ref --symbolic-full-name @{u}`)
    if (trackingBranch && !trackingBranch.startsWith('[Gagal')) {
      const ahead = runGitCommand(`git rev-list --count ${trackingBranch}..HEAD`)
      unpushedText = `${ahead} commit belum di-push`
    } else {
      unpushedText = 'Belum terhubung dengan remote branch'
    }
  } catch {
    unpushedText = 'Belum terhubung dengan remote branch'
  }

  const statusSummary = isDirty ? 'Dirty (Ada perubahan yang belum di-commit)' : 'Clean (Tidak ada perubahan)'
  const filesChangedText = isDirty ? `\n\`\`\`text\n${gitStatusShort}\n\`\`\`` : 'Tidak ada file yang berubah.'
  const nextCommandText = isDirty 
    ? 'Direkomendasikan menjalankan `git diff` atau `git status` sebelum memulai tugas baru.' 
    : 'Aman untuk memulai tugas pengembangan berikutnya.'

  return `${MARKER_START}
## Auto Snapshot (Git State)
*Auto-generated pada: ${date}*

- **Current branch:** \`${branch}\`
- **Working tree status:** ${statusSummary}
- **Unpushed commits:** ${unpushedText}
- **Latest commit:** \`${latestCommit}\`

**Last 5 Commits:**
\`\`\`text
${last5Commits}
\`\`\`

**Changed Files:**
${filesChangedText}

**Saran AI:**
${nextCommandText}
${MARKER_END}`
}

function updateHandoffFile() {
  let content = ''
  
  if (fs.existsSync(targetFile)) {
    content = fs.readFileSync(targetFile, 'utf-8')
  } else {
    console.error(`[Error] Target file tidak ditemukan di: ${targetFile}`)
    process.exit(1)
  }

  const snapshotContent = generateSnapshot()

  const startIndex = content.indexOf(MARKER_START)
  const endIndex = content.indexOf(MARKER_END)

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    // Replace the existing block
    const before = content.substring(0, startIndex)
    const after = content.substring(endIndex + MARKER_END.length)
    content = before + snapshotContent + after
    console.log('[Info] Berhasil memperbarui blok Auto Snapshot.')
  } else {
    // Append the block
    content = content.trimEnd() + '\n\n' + snapshotContent + '\n'
    console.log('[Info] Marker tidak ditemukan. Menambahkan blok Auto Snapshot di akhir dokumen.')
  }

  fs.writeFileSync(targetFile, content, 'utf-8')
  console.log('[Success] AI_HANDOFF_STATE.md berhasil diperbarui.')
}

updateHandoffFile()
