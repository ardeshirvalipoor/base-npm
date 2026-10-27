// Frees a TCP port by killing whatever is listening on it.
//
// `npm run serve` (http-server) survives a closed terminal or a hung `npm run
// dev`, and the next run then dies on EADDRINUSE. This finds the owner of the
// port and kills it, on Windows and on POSIX.
//
// Usage: npm run web:stop          (port 3000)
//        npm run web:stop -- 8080  (any other port)
import { execSync } from 'node:child_process'

const port = process.argv[2] ?? '3000'
const windows = process.platform === 'win32'

// Both lookups exit non-zero when they find nothing, so failure means "free".
const run = (cmd) => {
  try {
    return execSync(cmd, { encoding: 'utf8' })
  } catch {
    return ''
  }
}

const listeners = () => {
  if (!windows) return run(`lsof -ti tcp:${port} -sTCP:LISTEN`).split('\n')

  // netstat columns: proto, local address, remote address, state, pid
  return run('netstat -ano -p tcp')
    .split('\n')
    .map((line) => line.trim().split(/\s+/))
    .filter((cols) => cols[3] === 'LISTENING' && cols[1]?.endsWith(`:${port}`))
    .map((cols) => cols[4])
}

const pids = [...new Set(listeners().map((pid) => pid.trim()).filter(Boolean))]

if (pids.length === 0) {
  console.log(`Port ${port} is already free`)
} else {
  // /T takes the children with it: `npm run dev` owns the server through
  // concurrently, and killing the parent alone would orphan the listener.
  for (const pid of pids) run(windows ? `taskkill /PID ${pid} /T /F` : `kill -9 ${pid}`)
  console.log(`Freed port ${port} (killed ${pids.join(', ')})`)
}
