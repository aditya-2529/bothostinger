const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { deployBot, stopBot, startBot, deleteBot , getContainerLogs } = require('./deployer');
const Bot = require('./models/Bot');
const User = require('./models/User');
const cors = require('cors');
const Transaction = require('./models/Transaction');
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail } = require('./utils/email');

const app = express();
app.use(cors());
app.use(express.json());

const PLAN_LIMITS = {
    free:       { maxBots: 1,   ram: 128 },
    pro:        { maxBots: 5,   ram: 512 },
    enterprise: { maxBots: 100, ram: 1024 } // 1GB
};

// 1. CONNECT TO MONGODB
mongoose.connect('')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));


app.post('/register', async (req, res) => {
    const { username, email, password, termsAccepted } = req.body;

    if (termsAccepted !== true) return res.status(400).json({ error: "Accept Terms" });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User exists" });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User (Not Verified yet)
        const user = await User.create({ 
            username, 
            email, 
            password: hashedPassword,
            termsAccepted: true,
            termsAcceptedAt: new Date(),
            otp,
            otpExpires,
            isVerified: false 
        });

        // Send Email
        await sendWelcomeEmail(email, username, otp);

        res.json({ 
            success: true, 
            userId: user._id, 
            username: user.username,
            requireVerification: true, // Tell frontend to show OTP screen
            message: "OTP sent to email" 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/verify-email', async (req, res) => {
    const { userId, otp } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.isVerified) {
            return res.json({ success: true, message: "Already verified" });
        }

        // Check Logic
        if (user.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "OTP Expired" });
        }

        // Success!
        user.isVerified = true;
        user.otp = undefined; // Clear OTP
        user.otpExpires = undefined;
        await user.save();

        res.json({ success: true, message: "Email Verified!" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const user = await User.findOne({ email });
        // console.log(user.email+" "+user.password);
        // 2. Check if user exists AND password matches
        // (Note: In production, use 'bcrypt.compare' here!)
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // 3. Success! Return the User ID and Name
        res.json({ 
            success: true, 
            userId: user._id, 
            username: user.username,
            message: "Login successful" 
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/purchase-plan', async (req, res) => {
    const { userId, planName, price } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // 1. Check sufficient balance
        if (user.balance < price) {
            return res.status(400).json({ 
                error: "Insufficient balance. Please add funds to your wallet first.",
                currentBalance: user.balance
            });
        }

        // 2. Deduct balance and update plan
        user.balance -= price;
        user.plan = planName.toLowerCase(); // 'pro' or 'enterprise'
        await user.save();

        // 3. Create PURCHASE transaction record (Auto-COMPLETED)
        await Transaction.create({
            user: userId,
            amount: -price, // Negative amount to show spending
            utr: `PURCHASE-${Date.now()}`, // Internal ID
            type: 'PURCHASE',
            description: `Purchased ${planName} Plan`,
            status: 'COMPLETED'
        });

        res.json({ success: true, message: `Successfully upgraded to ${planName} plan!`, newBalance: user.balance });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 1. USER: Submit a Deposit Request
app.post('/deposit', async (req, res) => {
    const { userId, amount, utr } = req.body;

    try {
        // Basic validation
        if (!amount || amount < 10) return res.status(400).json({ error: "Minimum deposit is ₹10" });
        if (!utr || utr.length < 4) return res.status(400).json({ error: "Invalid UTR/Transaction ID" });

        // Check if UTR already used
        const existing = await Transaction.findOne({ utr });
        if (existing) return res.status(400).json({ error: "Transaction ID already submitted" });

        // Create the Record
        const tx = await Transaction.create({
            user: userId,
            amount,
            utr,type: 'DEPOSIT',
            description: 'UPI Top-up',
            status: 'PENDING'
        });

        res.json({ success: true, message: "Deposit submitted! Waiting for approval." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. ADMIN: Approve Deposit (Protected by a simple secret for now)
app.post('/admin/approve', async (req, res) => {
    const { transactionId, secret } = req.body;

    // SIMPLE SECURITY: Replace this string with a hard password only you know
    if (secret !== "my-super-secret-admin-password") {
        return res.status(403).json({ error: "Unauthorized" });
    }

    try {
        const tx = await Transaction.findById(transactionId).populate('user');
        if (!tx) return res.status(404).json({ error: "Transaction not found" });
        if (tx.status === 'COMPLETED') return res.status(400).json({ error: "Already approved" });

        // A. Add Balance to User
        const user = await User.findById(tx.user._id);
        user.balance += tx.amount;
        await user.save();

        // B. Mark Transaction as Approved
        tx.status = 'COMPLETED';
        await tx.save();

        res.json({ success: true, newBalance: user.balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        // Return fresh balance and plan info
        res.json({ 
            _id: user._id, 
            username: user.username, 
            email: user.email, 
            balance: user.balance,
            coins: user.coins,
            plan: user.plan
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const LOOTABLY_IPS = ['54.236.143.208', '54.173.22.100', '52.70.187.97'];
app.get('/api/postback/lootably', async (req, res) => {
    // 1. Capture the data sent by Lootably
    // URL looks like: /api/postback/lootably?sid=USER_ID&amount=500&status=1&ip=1.2.3.4
    const requestIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { sid, amount, status, currency } = req.query;
    
    // 2. Validate Status ('1' means credited)
    if (status !== '1') {
        return res.send('0'); // '0' means we acknowledge but ignored it
    }

    try {
        // 3. Find the user using 'sid' (which is our userId)
        const user = await User.findById(sid); 
        
        if (!user) {
            console.error(`[POSTBACK] User not found: ${sid}`);
            return res.send('0');
        }

        // 4. Add the coins
        // Ensure amount is a number
        const coinsToAdd = Math.floor(Number(amount));
        
        if (coinsToAdd > 0) {
            user.coins += coinsToAdd;
            await user.save();
            console.log(`[OFFERWALL] Credited ${coinsToAdd} coins to ${user.username}`);
        }

        // 5. Respond '1' to tell Lootably "Success, stop sending this request"
        res.send('1');

    } catch (error) {
        console.error("[POSTBACK] Error:", error);
        res.send('0'); // Lootably will try again later if we send error
    }
});
app.get('/transactions/:userId', async (req, res) => {
    try {
        const history = await Transaction.find({ user: req.params.userId })
            .sort({ createdAt: -1 }); // Newest first
        res.json({ transactions: history });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/admin/transactions', async (req, res) => {
    const { secret } = req.query;

    // Simple Security Check
    if (secret !== "my-super-secret-admin-password") {
        return res.status(403).json({ error: "Unauthorized" });
    }

    try {
        // Fetch only PENDING requests, newest first
        const transactions = await Transaction.find({ status: 'PENDING' })
            .populate('user', 'username email') // Include user details
            .sort({ createdAt: -1 });

        res.json({ transactions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/bots', async (req, res) => {
    const { userId } = req.query; // Usage: /bots?userId=12345

    if (!userId) {
        return res.status(400).json({ error: "User ID required" });
    }

    try {
        // Find all bots where user matches the requested ID
        const bots = await Bot.find({ user: userId });
        res.json({ bots });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- UPDATED DEPLOY ROUTE ---

app.post('/deploy', async (req, res) => {
    // We now expect 'userId' to be the MongoDB _id (e.g., "64f8a...")
    const { repoUrl, userId } = req.body; 
    
    // 1. CHECK IF USER EXISTS
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: "User not found! Please register first." });
    }

    // (Optional: Check Balance here later)
    // if (user.balance < 5) return res.status(402).json({ error: "Insufficient funds" });

    const userPlan = user.plan || 'free'; // Default to free
    const limits = PLAN_LIMITS[userPlan];

    // 2. Count how many bots they already have
    // (We count all bots that represent 'active' slots. 
    //  Usually we count everything except 'FAILED' or 'DELETED' if you implement soft-delete.)
    const currentBots = await Bot.countDocuments({ user: userId });

    // 3. CHECK: Limit Reached?
    if (currentBots >= limits.maxBots) {
        return res.status(403).json({ 
            error: `Plan limit reached! You have ${currentBots}/${limits.maxBots} bots. Please upgrade your plan.` 
        });
    }

    const deploymentId = crypto.randomUUID();

    try {
        // 2. Save Bot with link to User
        await Bot.create({
            deploymentId,
            user: user._id, // Save the relationship
            repoUrl,
            status: 'QUEUED'
        });

        // 3. Trigger Async Build
        deployBot(deploymentId, repoUrl, userId, limits.ram)
            .then(async () => {
                console.log(`[${deploymentId}] RUNNING`);
                await Bot.updateOne({ deploymentId }, { status: 'RUNNING' });
            })
            .catch(async (err) => {
                console.error(`[${deploymentId}] FAILED`);
                await Bot.updateOne({ deploymentId }, { status: 'FAILED' });
            });

        res.json({ success: true, deploymentId, message: "Deployment queued." });

    } catch (error) {
        res.status(500).json({ error: "Database error: " + error.message });
    }
});

// STATUS (Polling)
app.get('/status/:id', async (req, res) => {
    const bot = await Bot.findOne({ deploymentId: req.params.id });
    if (!bot) return res.status(404).json({ error: "Bot not found" });
    res.json(bot);
});

// STOP
app.post('/stop', async (req, res) => {
    const { deploymentId } = req.body;
    try {
        await stopBot(deploymentId);
        await Bot.updateOne({ deploymentId }, { status: 'STOPPED' }); // Update DB
        res.json({ success: true, message: "Bot stopped" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// START
app.post('/start', async (req, res) => {
    const { deploymentId } = req.body;
    try {
        await startBot(deploymentId);
        await Bot.updateOne({ deploymentId }, { status: 'RUNNING' }); // Update DB
        res.json({ success: true, message: "Bot started" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE
app.post('/delete', async (req, res) => {
    const { deploymentId } = req.body;
    try {
        await deleteBot(deploymentId);
        await Bot.deleteOne({ deploymentId }); // Remove from DB entirely
        res.json({ success: true, message: "Bot deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/logs/:deploymentId', async (req, res) => {
    const { deploymentId } = req.params;
    try {
        const logs = await getContainerLogs(deploymentId);
        res.json({ logs });
    } catch (error) {
        console.error(`[LOGS] Error:`, error.message);
        res.json({ logs: "System Error: Could not fetch logs." });
    }
});

app.post('/earn-coins', async (req, res) => {
    const { userId } = req.body;
    const COINS_PER_AD = 50;
    const DAILY_LIMIT = 5;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Reset counter if it's a new day
        const today = new Date().toDateString();
        const lastDate = new Date(user.lastAdDate).toDateString();

        if (today !== lastDate) {
            user.adWatchesToday = 0;
            user.lastAdDate = Date.now();
        }

        // Check Limit
        if (user.adWatchesToday >= DAILY_LIMIT) {
            return res.status(400).json({ error: "Daily limit reached (5/5). Come back tomorrow!" });
        }

        // Add Coins
        user.coins += COINS_PER_AD;
        user.adWatchesToday += 1;
        await user.save();

        res.json({ 
            success: true, 
            coins: user.coins, 
            watches: user.adWatchesToday,
            message: `+${COINS_PER_AD} Coins added!` 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. REDEEM PLAN (Buy with Coins)
app.post('/redeem-plan', async (req, res) => {
    const { userId, planName } = req.body;
    
    // Coin Prices
    const COIN_PRICES = {
        'pro': 5000,
        'enterprise': 10000
    };

    const cost = COIN_PRICES[planName.toLowerCase()];
    if (!cost) return res.status(400).json({ error: "Invalid plan" });

    try {
        const user = await User.findById(userId);
        
        if (user.coins < cost) {
            return res.status(400).json({ 
                error: `Insufficient Coins. Need ${cost}, you have ${user.coins}.` 
            });
        }

        // Deduct Coins & Update Plan
        user.coins -= cost;
        user.plan = planName.toLowerCase();
        await user.save();

        res.json({ success: true, message: `Upgraded to ${planName} using Coins!` });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('BotHost Engine running on port 3000'));