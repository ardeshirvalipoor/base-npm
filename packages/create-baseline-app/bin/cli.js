#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const readline = require('readline')

const BOLD = '\x1b[1m'
const GREEN = '\x1b[32m'
const CYAN = '\x1b[36m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

function ask(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close()
            resolve(answer.trim())
        })
    })
}

function copyDir(src, dest, replacements) {
    fs.mkdirSync(dest, { recursive: true })
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name)
        const destPath = path.join(dest, entry.name)
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath, replacements)
        } else {
            let content = fs.readFileSync(srcPath, 'utf-8')
            for (const [key, value] of Object.entries(replacements)) {
                content = content.replaceAll(key, value)
            }
            fs.writeFileSync(destPath, content)
        }
    }
}

async function main() {
    console.log()
    console.log(`${BOLD}  ▲ Create Baseline App${RESET}`)
    console.log()

    let projectName = process.argv[2]

    if (!projectName) {
        projectName = await ask(`  ${BOLD}Project name:${RESET} `)
        if (!projectName) {
            console.log('  Please provide a project name.')
            process.exit(1)
        }
    }

    const projectPath = path.resolve(process.cwd(), projectName)

    if (fs.existsSync(projectPath)) {
        const files = fs.readdirSync(projectPath)
        if (files.length > 0) {
            console.log(`  ${projectName}/ already exists and is not empty.`)
            process.exit(1)
        }
    }

    console.log(`  ${DIM}Creating project in ${projectPath}${RESET}`)
    console.log()

    const templateDir = path.join(__dirname, '..', 'template')
    const replacements = {
        '{{PROJECT_NAME}}': projectName,
    }

    copyDir(templateDir, projectPath, replacements)

    // Create .gitignore (can't be in template as npm ignores .gitignore in published packages)
    fs.writeFileSync(
        path.join(projectPath, '.gitignore'),
        ['node_modules', 'build/bundle.js', 'build/bundle.js.map', 'build/bundle.css', '.DS_Store'].join('\n') + '\n'
    )

    console.log(`  ${GREEN}✓${RESET} Project files created`)

    // Install dependencies
    console.log()
    console.log(`  ${DIM}Installing dependencies...${RESET}`)
    console.log()

    try {
        execSync('npm install', { cwd: projectPath, stdio: 'inherit' })
        console.log()
        console.log(`  ${GREEN}✓${RESET} Dependencies installed`)
    } catch {
        console.log()
        console.log(`  ${DIM}Could not install dependencies. Run npm install manually.${RESET}`)
    }

    console.log()
    console.log(`  ${GREEN}${BOLD}Done!${RESET} Your Baseline app is ready.`)
    console.log()
    console.log(`  ${BOLD}Next steps:${RESET}`)
    console.log()
    console.log(`    ${CYAN}cd${RESET} ${projectName}`)
    console.log(`    ${CYAN}npm run dev${RESET}       ${DIM}# Build (watch mode) + serve${RESET}`)
    console.log()
    console.log(`  ${DIM}Or separately:${RESET}`)
    console.log(`    ${CYAN}npm run build${RESET}     ${DIM}# One-time build${RESET}`)
    console.log(`    ${CYAN}npm run watch${RESET}     ${DIM}# Build with watch${RESET}`)
    console.log(`    ${CYAN}npm run serve${RESET}     ${DIM}# Serve build/ on localhost:3000${RESET}`)
    console.log()
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
