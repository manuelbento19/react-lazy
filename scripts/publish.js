import readline from "readline"
import { execSync } from "child_process"

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question("Tem certeza que deseja publicar no NPM? (y/N) ", (answer) => {
    if (answer.toLowerCase() === "y") {
        execSync("npm publish --access public", { stdio: "inherit" })
    } else {
        console.log("Publicação cancelada.")
    }
    rl.close()
})