import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

const projectRoot = dirname(import.meta.dir)
const skillName = process.platform === 'win32' ? 'impeccable.cmd' : 'impeccable'
const skillRoots = [
  join(projectRoot, '.agents', 'skills', 'impeccable'),
  ...['.agents', '.gemini', '.claude', '.codex', '.cursor'].map((directory) =>
    join(homedir(), directory, 'skills', 'impeccable'),
  ),
]
const executable = skillRoots
  .map((root) => join(root, 'scripts', skillName))
  .find(existsSync)

if (!executable) process.exit(0)

const isWindows = process.platform === 'win32'
const result = spawnSync(
  isWindows ? process.env.ComSpec ?? 'cmd.exe' : executable,
  isWindows ? ['/d', '/s', '/c', `call "${executable}" hook`] : ['hook'],
  {
    input: readFileSync(0),
    encoding: 'utf8',
    maxBuffer: 1_000_000,
  },
)

if (result.stdout) process.stdout.write(result.stdout)
if (result.stderr) process.stderr.write(result.stderr)
if (result.error) {
  process.stderr.write(`${result.error.message}\n`)
  process.exitCode = 1
} else {
  process.exitCode = result.status ?? 1
}
