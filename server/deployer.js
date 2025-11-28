const Docker = require('dockerode');
const simpleGit = require('simple-git');
const fs = require('fs-extra');
const path = require('path');

const socketPath = process.platform === 'win32' 
    ? '//./pipe/docker_engine' 
    : '/var/run/docker.sock';

const docker = new Docker({ socketPath });

async function deployBot(deploymentId, repoUrl, userId, ramLimitMB) {
    const workDir = path.join(__dirname, 'temp', deploymentId);

    try {
        console.log(`[${deploymentId}] 1. Cloning Repo...`);
        // 1. CLONE
        await simpleGit().clone(repoUrl, workDir);

        // 2. DETECT LANGUAGE & WRITE DOCKERFILE
        console.log(`[${deploymentId}] 2. Detecting Language...`);
        await createDockerfile(workDir);

        // 3. BUILD IMAGE
        const imageName = `bot-${userId}-${deploymentId.substring(0, 8)}`;
        console.log(`[${deploymentId}] 3. Building Image: ${imageName}...`);
        console.log(`[${deploymentId}] Cloning (RAM Limit: ${ramLimitMB}MB)...`);
        
        // This connects the source files to the Docker Daemon
        const stream = await docker.buildImage({
            context: workDir,
            src: ['.']
        }, { t: imageName });

        // Wait for build to finish (Helper function below)
        await streamToPromise(stream);

        // 4. RUN CONTAINER
        console.log(`[${deploymentId}] 4. Starting Container...`);
        
        const container = await docker.createContainer({
            Image: imageName,
            name: imageName, // Unique name
            HostConfig: {
                Memory: ramLimitMB * 1024 * 1024, // Limit: 128MB RAM
                CpuPeriod: 100000,
                CpuQuota: 50000,           // Limit: 50% of 1 CPU Core
                RestartPolicy: { Name: 'always' } // Auto-restart if crashes
            }
        });

        await container.start();
        console.log(`[${deploymentId}] SUCCESS: Bot is running!`);
        
        // Cleanup: Delete the source code folder to save space
        await fs.remove(workDir);

    } catch (error) {
        console.error(`[${deploymentId}] FAILED:`, error.message);
        // Here you would update your Database to status: "FAILED"
    }
}

// --- HELPER 1: Language Detection Logic ---
async function createDockerfile(workDir) {
    const hasPackageJson = await fs.pathExists(path.join(workDir, 'package.json'));
    const hasRequirements = await fs.pathExists(path.join(workDir, 'requirements.txt'));

    let content = "";

    if (hasPackageJson) {
        content = `
            FROM node:18-alpine
            WORKDIR /app
            COPY . .
            RUN npm install
            CMD ["node", "index.js"] 
        `; // Note: In production, read 'package.json' scripts to find the start command
    } else if (hasRequirements) {
        content = `
            FROM python:3.9-slim
            WORKDIR /app
            COPY . .
            RUN pip install -r requirements.txt
            CMD ["python", "bot.py"]
        `;
    } else {
        throw new Error("Unknown project type (No package.json or requirements.txt)");
    }

    await fs.writeFile(path.join(workDir, 'Dockerfile'), content);
}

// --- HELPER 2: Wait for Docker Stream ---
function streamToPromise(stream) {
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => {
             // Optional: Log build output to console/DB so user sees "Step 1/5..."
             // console.log(chunk.toString()); 
        });
        stream.on('end', resolve);
        stream.on('error', reject);
    });
}

async function startBot(deploymentId) {
    // 1. Find the container by name pattern
    const containers = await docker.listContainers({ all: true });
    // Look for a container that matches the ID (stopped or running)
    const target = containers.find(c => c.Names[0].includes(deploymentId.substring(0, 8)));

    if (!target) throw new Error("Bot container not found! You might need to Deploy it first.");

    const container = docker.getContainer(target.Id);
    
    // 2. Check if it's already running to avoid errors
    if (target.State === 'running') {
        console.log(`[${deploymentId}] Bot is already running.`);
        return; 
    }

    console.log(`[${deploymentId}] Starting container...`);
    await container.start();
    console.log(`[${deploymentId}] Bot Started.`);
}

async function stopBot(deploymentId, userId) {
    
    const containers = await docker.listContainers({ all: true });
    const target = containers.find(c => c.Names[0].includes(deploymentId.substring(0, 8)));

    if (!target) throw new Error("Bot not found running");

    const container = docker.getContainer(target.Id);
    
    console.log(`[${deploymentId}] Stopping container...`);
    await container.stop();
    console.log(`[${deploymentId}] Bot Stopped.`);
}

async function deleteBot(deploymentId) {
    // Find it again (Stop before delete)
    const containers = await docker.listContainers({ all: true });
    const target = containers.find(c => c.Names[0].includes(deploymentId.substring(0, 8)));

    if (!target) throw new Error("Bot not found");

    const container = docker.getContainer(target.Id);
    
    // Force remove (kills it if running)
    await container.remove({ force: true });
    console.log(`[${deploymentId}] Bot Deleted from server.`);
}

async function getContainerLogs(deploymentId) {
    // 1. Find container by ID pattern
    const containers = await docker.listContainers({ all: true });
    const target = containers.find(c => c.Names[0].includes(deploymentId.substring(0, 8)));

    if (!target) {
        return "System: Container not found. Is it running?";
    }

    // 2. Get Logs
    const container = docker.getContainer(target.Id);
    const logsBuffer = await container.logs({
        follow: false,
        stdout: true,
        stderr: true,
        tail: 100
    });

    // 3. Clean weird characters
    let cleanLogs = logsBuffer.toString('utf8');
    cleanLogs = cleanLogs.replace(/[^\x20-\x7E\n\r]/g, ''); 
    
    return cleanLogs;
}

module.exports = { deployBot , startBot , stopBot , deleteBot , getContainerLogs};