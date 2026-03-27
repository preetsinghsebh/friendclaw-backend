import '../../shared/env.js';
import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import axios from 'axios';
import cron from 'node-cron';
import express from 'express';
import cors from 'cors';
import { enforceSafetyLayer, detectCrisis } from './safety/disclaimer.js';
import { PersistentMap, VectorMemory, Telemetry } from '../../shared/persistence.js';
import { connectDB } from '../../shared/database.js';
import { apiLimiter, verifyInternalToken } from '../../shared/security.js';
import User from '../../shared/models/User.js';
import Memory from '../../shared/models/Memory.js';
import Chat from '../../shared/models/Chat.js';
import { aiQueue, getCharacterResponse, sendHumanizedResponse as sharedSendResponse } from '../../shared/ai-handler.js';
// Note: aiQueue is imported from shared/ai-handler.js for global serialization

export async function init(sharedApp = null, customToken = null, serviceName = 'ziva') {
    const token = customToken || process.env.TELEGRAM_BOT_TOKEN;
    const PROXY_URL = process.env.SARVAM_PROXY_URL || 'http://localhost:3000/v1/chat/completions';
    
    if (!token) {
        console.error(`[${serviceName}] WARNING: TELEGRAM_BOT_TOKEN is missing`);
        return;
    }

    const telemetry = new Telemetry(serviceName);
    const log = (module, msg) => telemetry.info(`[${module}] ${msg}`);

    log('System', `${serviceName} Bot Orchestrator starting...`);
    // Note: Database connection is handled by the master service
    
    const bot = new TelegramBot(token, { polling: false });
    
    // Robust Webhook Clearing (Version-Agnostic)
    try {
        if (typeof bot.deleteWebhook === 'function') await bot.deleteWebhook({ drop_pending_updates: true });
        else if (typeof bot.deleteWebHook === 'function') await bot.deleteWebHook({ drop_pending_updates: true });
        else await bot.setWebHook(''); 
    } catch (e) {
        log('System', `Webhook clear failed (non-critical): ${e.message}`);
    }

    bot.startPolling();
    bot.on('polling_error', (err) => log('System', `Polling Error: ${err.message}`));

// Track service start time to detect cold-start wake-ups
const SERVICE_START_TIME = Date.now();
const WARMUP_WINDOW_MS = 90_000; // 90 seconds after start = cold start window
const warnedUsers = new Set(); // Only warn each user once per cold start


    // State to track current persona, activity, and memory (Persisted via MongoDB)
    const userPersonas = new PersistentMap(User, { mode: 'mongo', service: serviceName });
    const userActivity = new PersistentMap(User, { mode: 'mongo', service: serviceName });
    const userMemories = new PersistentMap(Memory, { mode: 'mongo', service: serviceName });
    const userProfiles = new PersistentMap(User, { mode: 'mongo', service: serviceName }); 
    const userSubscriptions = new PersistentMap(User, { mode: 'mongo', service: serviceName }); 
    const userMessageHistory = new PersistentMap(Chat, { mode: 'mongo', service: serviceName }); 
    const userChatHistory = new PersistentMap(Chat, { mode: 'mongo', service: serviceName }); 
    const anchorMemories = new VectorMemory(Memory, { mode: 'mongo', service: serviceName });

/**
 * Tracks a message ID for later cleanup
 */
function trackMessage(chatId, messageId) {
    if (!messageId) return;
    const history = userMessageHistory.get(chatId) || [];
    history.push(messageId);
    // Keep history manageable (e.g. last 50 messages)
    if (history.length > 50) history.shift();
    userMessageHistory.set(chatId, history);
}

/**
 * Wrapper for bot.sendMessage to enable tracking
 */
async function safeSendMessage(chatId, text, options = {}) {
    try {
        const msg = await bot.sendMessage(chatId, text, options);
        trackMessage(chatId, msg.message_id);
        return msg;
    } catch (e) {
        log(`TG-${chatId}`, `safeSendMessage Error: ${e.message}`);
        throw e;
    }
}

/**
 * Updates the conversation history for LLM context
 */
function saveToHistory(chatId, role, content) {
    if (!chatId || !content) return;
    const history = userChatHistory.get(chatId) || [];
    history.push({ role, content });
    // Keep last 15 messages for context
    if (history.length > 15) history.shift();
    userChatHistory.set(chatId, history);
}

/**
 * Cleanup Utility: Attempts to delete up to N recent messages for a 'fresh start' feel
 */
async function clearChatHistory(chatId) {
    const history = userMessageHistory.get(chatId) || [];
    if (history.length === 0) return;

    log(`TG-${chatId}`, `Cleaning up ${history.length} messages for visual reset...`);

    // Attempt to delete messages in parallel
    const deletePromises = history.map(msgId =>
        bot.deleteMessage(chatId, msgId).catch(err => {
            // Silently fail if message is too old or already deleted
            // log(`TG-${chatId}`, `Delete failed for ${msgId}: ${err.message}`);
        })
    );

    await Promise.all(deletePromises);
    userMessageHistory.set(chatId, []); // Reset history tracker
}

// Map persona IDs to their display names for Telegram UI updates
const personaDisplayNames = {
    'ziva': 'Ziva',
    'liam': 'Liam',
    'emma': 'Emma',
    'confident-zane': 'Zane',
    'midnight': 'Midnight Friend',
    'listener': 'Caring Listener',
    'caring-listener': 'Caring Listener',
    'guide': 'Calm Guide',
    'calm-guide': 'Calm Guide',
    'sleep-luna': 'Luna (Sleep)',
    'mindful-maya': 'Maya (Focus)',
    'crush': 'Aryan',
    'sweet_gf': 'Ziva',
    'sweetie': 'Ziva',
    'protective_bf': 'Liam',
    'partner': 'Liam',
    'jealous_bua': 'Bua Ji',
    'bua': 'Bua Ji',
    'chill_chacha': 'Chill Chacha',
    'late_night_dadi': 'Dadi',
    'warm_grandma': 'Nani Ji',
    'warm-grandma': 'Nani Ji',
    'caring_mom': 'Caring Mom',
    'caring-mom': 'Caring Mom',
    'big_brother': 'Veer',
    'big_sister': 'Sis',
    'fun_aunt': 'Cool Auntie',
    'meme_lord': 'Roaster Bestie',
    'roaster': 'Roaster Bestie',
    'party_bestie': 'Party Friend',
    'bestie': 'Bestie',
    'whimsical': 'Dream Friend',
    'hype_man': 'Hype Man',
    'hype': 'Hype Man',
    'conspiracy': 'Tinfoil Friend',
    'best_friend': 'Bestie',
    'icon': 'Icon',
    'iron': 'Iron',
    'wake': 'Wake',
    'anime_gojo': 'Satoru Gojo',
    'gojo': 'Satoru Gojo',
    'anime_bakugo': 'Katsuki Bakugo',
    'bakugo': 'Katsuki Bakugo',
    'anime_luffy': 'Monkey D. Luffy',
    'luffy': 'Monkey D. Luffy',
    'anime_levi': 'Levi Ackerman',
    'levi': 'Levi Ackerman',
    'taylin-swift': 'Taylin Swift',
    'dax-johnson': 'Dax Johnson',
    'kain-west': 'Kain West',
    'kendro-lamar': 'Kendro Lamar',
    'zay-rukh': 'Zay Rukh',
    'naruto': 'Naruto Uzumaki'
};

const WEB_TO_INTERNAL_ID = {
    'ziva': 'sweet_gf',
    'liam': 'protective_bf',
    'emma': 'sweetie',
    'confident-zane': 'partner',
    'sweetie': 'sweet_gf',
    'partner': 'protective_bf',
    'crush': 'romantic_old',
    'caring-listener': 'listener',
    'calm-guide': 'guide',
    'sleep-luna': 'sleep-luna',
    'mindful-maya': 'mindful-maya',
    'warm-grandma': 'warm_grandma',
    'caring-mom': 'caring_mom',
    'roaster': 'meme_lord',
    'bestie': 'best_friend',
    'hype': 'hype_man',
    'bua': 'jealous_bua',
    'gojo': 'anime_gojo',
    'bakugo': 'anime_bakugo',
    'luffy': 'anime_luffy',
    'levi': 'anime_levi',
    'taylin-swift': 'tay_vibe',
    'dax-johnson': 'iron',
    'kain-west': 'elon_spark',
    'kendro-lamar': 'kendro-lamar',
    'zay-rukh': 'srk_charm',
    'naruto': 'anime_naruto'
};

    // Express Setup for Dashboard Sync
    const router = express.Router();
    router.use(cors());
    router.use(express.json());
    router.use(apiLimiter);

    // Health Check
    router.get('/health', (req, res) => res.status(200).json({ status: 'healthy', service: serviceName, timestamp: new Date().toISOString() }));

    router.get('/api/profile/:chatId', verifyInternalToken, (req, res) => {
        const { chatId } = req.params;
        const profile = userProfiles.get(chatId) || { streakCount: 0, moodScore: 50, nicknames: [], memoryCapsules: [] };
        const defaultPersona = (serviceName === 'emma') ? 'sweetie' : 'sweet_gf';
        const personaId = userPersonas.get(chatId) || defaultPersona;
        res.json({ ...profile, personaId });
    });

    if (sharedApp) {
        sharedApp.use(`/${serviceName}`, router);
        log('API', `${serviceName} Profile Sync mounted to /${serviceName}`);
    } else {
        const port = process.env.PORT || 3006;
        const app = express();
        app.use(`/${serviceName}`, router);
        app.listen(port, () => log('API', `Profile Sync Server listening on port ${port}`));
    }

/**
 * Helper to get current Indian Standard Time (IST) formatted
 */
function getISTTime() {
    return new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
}

/**
 * Detect the primary language of a user message.
 * Returns 'hindi', 'hinglish', or 'english'.
 */
function detectLanguage(text) {
    if (!text || text.trim().length === 0) return 'english'; // Default to English for first starts

    // Explicit language override requests always win
    const lower = text.toLowerCase().trim();
    if (/^(english|speak english|reply in english|talk in english|english only|use english|in english)$/i.test(lower) ||
        lower.includes('speak in english') || lower.includes('reply in english') ||
        lower.includes('talk in english') || lower.includes('english only')) {
        return 'english';
    }

    // Hindi Unicode range (Devanagari)
    const hindiChars = (text.match(/[\u0900-\u097F]/g) || []).length;
    const totalChars = text.replace(/\s/g, '').length;

    if (hindiChars > 0 && hindiChars / totalChars > 0.4) return 'hindi';

    // Common Hindi/Hinglish words written in Latin script
    const hinglishWords = [
        'kya', 'kar', 'raha', 'rahi', 'hoon', 'hai', 'ho', 'tha', 'thi', 'the', 'aur',
        'mera', 'meri', 'tum', 'tumhara', 'tumhari', 'main', 'mujhe', 'mujhko',
        'abhi', 'bas', 'yaar', 'yar', 'kal', 'aaj', 'bhi', 'nahi', 'nhi', 'nai',
        'karo', 'karo', 'bol', 'bata', 'sun', 'ek', 'do', 'teen', 'bahut', 'thoda',
        'kyun', 'kaise', 'kaisa', 'kaisi', 'kahan', 'kab', 'pls', 'arre', 'oye',
        'haan', 'na', 'ji', 'accha', 'theek', 'bilkul', 'sirf', 'toh', 'bhai',
        'jaan', 'babu', 'love', 'dil', 'pyar', 'lag', 'gaya', 'gayi', 'lol'
    ];
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/[\s,!?.]+/).filter(Boolean);
    const hinglishCount = words.filter(w => hinglishWords.includes(w)).length;

    if (hinglishCount >= 1) {
        // Check if there's a good mix of English too → Hinglish
        const englishWords = words.filter(w => !hinglishWords.includes(w) && /^[a-z]+$/.test(w));
        if (englishWords.length > 0) return 'hinglish';
        return 'hinglish';
    }

    // Mostly ASCII and no Hindi markers → English
    return 'english';
}

/**
 * Detect if the user is mentioning another AI, chatbot, or digital assistant.
 * Returns true if a jealousy reaction should be triggered.
 */
function detectOtherAI(text) {
    if (!text) return false;
    const lower = text.toLowerCase();
    const triggers = [
        'chatgpt', 'gpt', 'openai', 'gemini', 'claude', 'copilot', 'bard',
        'character.ai', 'character ai', 'chai app', 'replika', 'snapchat ai',
        'siri', 'alexa', 'cortana', 'another ai', 'other ai', 'different ai',
        'other chatbot', 'another chatbot', 'other bot', 'another bot',
        'another companion', 'other companion', 'different companion',
        'talked to ai', 'chatted with ai', 'spoke to ai', 'using another',
        'dusra ai', 'dusri ai', 'koi aur ai', 'aur ek ai'
    ];
    return triggers.some(t => lower.includes(t));
}

/**
 * Unified logic to update user context (Streaks, Facts, Nicknames)
 */
async function updateUserContext(chatId, userText) {
    if (!chatId || !userText || userText.length < 2) return;

    // Memory & Streak Extraction
    if (chatId && userText.length > 2) {
        const lowerText = userText.toLowerCase();
        const profile = userProfiles.get(chatId) || { facts: [], jokes: [], nicknames: [], events: [], memoryCapsules: [], lastLowDate: null, streakCount: 0, lastChatDate: null, moodScore: 50 };
        const today = new Date().toISOString().split('T')[0];

        // 1. Streak Logic
        if (!profile.lastChatDate) {
            profile.streakCount = 1;
            profile.lastChatDate = today;
            log(`TG-${chatId}`, `Streak Started: 1 Day`);
        } else if (profile.lastChatDate !== today) {
            const lastDate = new Date(profile.lastChatDate);
            const diffTime = Math.abs(new Date(today) - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                profile.streakCount += 1;
                profile.lastChatDate = today;
                log(`TG-${chatId}`, `Streak Incremented: ${profile.streakCount} Days`);

                // DAY 5 REWARD
                if (profile.streakCount === 5) {
                    const personaId = userPersonas.get(chatId) || 'midnight';
                    setTimeout(async () => {
                        const rewardMsg = "Oye! 🎉 5 din ho gaye humein lagataar baat karte karte. I'm so happy you're here everyday. Mere paas tere liye ek 'Special Reward' hai... ye exclusive sticker pack try kar! Link: https://t.me/addstickers/DostAIPack ✨";
                        await sendHumanizedResponse(chatId, rewardMsg, personaId);
                    }, 5000);
                }
            } else {
                profile.streakCount = 1;
                profile.lastChatDate = today;
                log(`TG-${chatId}`, `Streak Reset to 1 Day (Gap: ${diffDays} days)`);
            }
        }

        // Extract Nickname
        if (lowerText.includes("call me") || lowerText.includes("naam hai")) {
            const nick = userText.split(' ').pop();
            profile.nicknames.push(nick);
        }
        // Extract Jokes (simple keyword match for now)
        if (lowerText.includes("lol") || lowerText.includes("haha") || lowerText.includes("inside joke")) {
            profile.jokes.push(userText.slice(0, 50));
        }
        // Extract Facts
        if (lowerText.includes("my name is") || lowerText.includes("i am a") || lowerText.includes("i work as")) {
            profile.facts.push(userText);
        }

        // Extract Future Events (Life-Sync)
        // Detect patterns like "exam on Tuesday" or "interview tomorrow"
        const eventMatch = lowerText.match(/(interview|exam|meeting|trip|travel|date|doctor|appointment|event|test|presentation)\s+(on|at|this|tomorrow|next)\s+([a-zA-Z0-9\s]+)/);
        if (eventMatch) {
            const eventType = eventMatch[1];
            const eventTime = eventMatch[3].trim();
            // Store as a simple object. In a full system we'd use a date parser.
            profile.events.push({ type: eventType, time: eventTime, raw: userText, created: Date.now() });
            log(`TG-${chatId}`, `Event Detected: ${eventType} @ ${eventTime}`);
        }

        // 5. Mood Tracking (Sentiment Detection)
        const lowKeywords = ['sad', 'lonely', 'tired', 'cry', 'hurt', 'stressed', 'exhausted', 'peace', 'quiet', 'depression', 'scared', 'dukh', 'pareshan'];
        const highKeywords = ['party', 'wild', 'club', 'hype', 'game', 'win', 'fire', 'crazy', 'excited', 'masti', 'dhamaka', 'op'];

        if (lowKeywords.some(k => lowerText.includes(k))) {
            profile.moodScore = Math.max(0, profile.moodScore - 10);
            log(`TG-${chatId}`, `Mood Shift: Low (Score: ${profile.moodScore})`);
        } else if (highKeywords.some(k => lowerText.includes(k))) {
            profile.moodScore = Math.min(100, profile.moodScore + 10);
            log(`TG-${chatId}`, `Mood Shift: High (Score: ${profile.moodScore})`);
        }

        // 6. Memory Capsule Counter (Message count for Wrapped)
        const monthKey = new Date().toISOString().slice(0, 7); // YYYY-MM
        let capsule = profile.memoryCapsules.find(c => c.month === monthKey);
        if (!capsule) {
            capsule = { month: monthKey, messageCount: 0, topKeywords: {}, emotionalSummaries: [] };
            profile.memoryCapsules.push(capsule);
        }
        capsule.messageCount += 1;

        // Limits
        if (profile.events.length > 3) profile.events.shift();
        userProfiles.set(chatId, profile);
    }
}

// sendHumanizedResponse logic moved to shared/ai-handler.js

/**
 * Summarizes the conversation to ensure long-term memory
 */
async function summarizeConversation(chatId, history) {
    if (history.length < 10) return; // Only summarize long chats

    try {
        log(`TG-${chatId}`, "🧠 Generating memory summary...");
        // 3. Prepare AI Prompt with Long-Term Memory
        const memoryFragment = userMemories.get(chatId) || "";
        const finalPersona = memoryFragment 
            ? `[LONG-TERM MEMORY: ${memoryFragment}]\nMemory_Summarizer`
            : "Memory_Summarizer";

        const response = await axios.post(PROXY_URL, {
            content: `Summarize the following conversation into a short "Memory Fragment" (max 2 lines). Focus on facts about the user (name, job, pets, mood). 
            Conversation: ${history.map(h => `${h.role}: ${h.content}`).join('\n')}`,
            persona: "Memory_Summarizer"
        });

        const summary = response.data.response;
        log(`TG-${chatId}`, `✨ New Memory Saved: ${summary}`);
        userMemories.set(chatId, summary);

        // Also extract specific "Anchors" (Facts) from the summary
        // In a real app, this would be a second LLM pass or specific logic
        if (summary.includes("user's") || summary.includes("likes") || summary.includes("is a")) {
             anchorMemories.add(chatId, summary);
        }
    } catch (error) {
        log(`TG-${chatId}`, "❌ Memory Summary Failed");
    }
}

bot.on('message', async (msg) => {
    try {
        const chatId = msg.chat.id;
        let text = msg.text || msg.caption;

    // If the user sent a photo without a caption, tell the LLM they sent an image
    if (msg.photo && !text) {
        text = "*sent a photo*";
    }

    if (!text) return; // Still ignore stickers/voice notes with no text for now

    // Track activity
    userActivity.set(chatId, Date.now());
    trackMessage(chatId, msg.message_id);

    // Update memory/streaks in background
    updateUserContext(chatId, text).catch(e => log(`TG-${chatId}`, `Context Update Error: ${e.message}`));

    // 🌅 Cold-start wake-up notification
    if (Date.now() - SERVICE_START_TIME < WARMUP_WINDOW_MS && !warnedUsers.has(chatId)) {
        warnedUsers.add(chatId);
        await safeSendMessage(chatId, `☕ *Just waking up!*\n\nI was resting to save energy. Give me a few seconds to get ready — I'll reply right after! 🌸`, { parse_mode: 'Markdown' });
    }

    // Update Chat History (LLM Context)
    if (!text.startsWith('/')) {
        saveToHistory(chatId, 'user', text);
    }

    log(`TG-${chatId}`, `Incoming: "${text}"`);

    // 1. Basic Command Handling
    // --- COMMAND: DASHBOARD ---
    if (text === '/dashboard') {
        const stats = userProfiles.get(chatId) || { streakCount: 0, moodScore: 50 };
        const response = `📊 *Your RealCompanion Dashboard*\n\n` +
            `❤️ Relationship: ${stats.moodScore}%\n` +
            `🔥 Day Streak: ${stats.streakCount}\n\n` +
            `🔗 [Open your Web Dashboard](http://localhost:3000/dashboard?id=${chatId})\n\n` +
            `_Check your stats across all companions in a premium UI._`;
        
        return bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
    }

    if (text.startsWith('/start')) {
        const parts = text.split(' ');
        const startParam = parts[1];

        if (startParam && startParam.startsWith('persona_')) {
            let requestedPersona = startParam.replace('persona_', '');

            // Map web ID to internal ID if needed
            if (WEB_TO_INTERNAL_ID[requestedPersona]) {
                log(`TG-${chatId}`, `Mapping web ID ${requestedPersona} to internal ID ${WEB_TO_INTERNAL_ID[requestedPersona]}`);
                requestedPersona = WEB_TO_INTERNAL_ID[requestedPersona];
            }

            // VISUAL RESET: Clear history before switching
            await clearChatHistory(chatId);

            userPersonas.set(chatId, requestedPersona);

            // FRESH START: Wipe memory/profile/chat for this user when switching personas via deep link
            if (userProfiles.has(chatId)) {
                log(`TG-${chatId}`, `Wiping memory for fresh start with ${requestedPersona}`);
                userProfiles.delete(chatId);
            }
            if (userChatHistory.has(chatId)) {
                userChatHistory.delete(chatId);
            }

            log(`TG-${chatId}`, `Deep link switch to: ${requestedPersona}`);

            // Try updating the bot's global name to match the persona
            try {
                const newName = personaDisplayNames[requestedPersona] || "Real Companion";
                await fetch(`https://api.telegram.org/bot${token}/setMyName`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newName })
                });
                log(`TG-${chatId}`, `Set bot name to: ${newName}`);
            } catch (nameErr) {
                log(`TG-${chatId}`, `Failed to set name: ${nameErr.message}`);
            }


            try {
                // Ask LLM for a proper first greeting (not a nudge scenario)
                const greetPrompt = "This is the very first time you're meeting this user. Greet them warmly and in-character. IMPORTANT: You MUST reply in ENGLISH for this first message. Keep it short, casual, and natural — like a real person saying hi for the first time. 1-2 sentences max.";
                const welcome = await getCharacterResponse(requestedPersona, greetPrompt, false);
                if (welcome && welcome.trim()) {
                    await sendHumanizedResponse(chatId, enforceSafetyLayer("", welcome), requestedPersona);
                }
                return;
            } catch (e) {
                log(`TG-${chatId}`, `Welcome failed: ${e.message}`);
            }
        } else if (startParam && startParam.startsWith('interpret_')) {
            const personaId = userPersonas.get(chatId) || 'midnight';
            safeSendMessage(chatId, "🔮 *Decoding your dream...*", { parse_mode: 'Markdown' });

            const prompt = "I'm returning from the Dreamscape portal. Interpret my latest dream for me in your character style. Be mystical.";
            const response = await getCharacterResponse(personaId, prompt, false, chatId);
            saveToHistory(chatId, 'assistant', response);
            await sendHumanizedResponse(chatId, `🌙 *Dreamscape:* ${response}`, personaId);
            return;
        } else if (!startParam) {
            // STANDALONE BOT GREETING (No parameters, just pure /start)
            log(`TG-${chatId}`, `Pure /start detected. Triggering Ziva greeting.`);
            const personaId = 'sweetie';
            userPersonas.set(chatId, personaId);
            try {
                const greetPrompt = "This is the very first time you're meeting this user. Greet them warmly and in-character. Keep it short, casual, and natural — like a real person saying hi for the first time. 1-2 sentences max.";
                const welcome = await getCharacterResponse(personaId, greetPrompt, false);
                if (welcome && welcome.trim()) {
                    await sendHumanizedResponse(chatId, enforceSafetyLayer("", welcome), personaId);
                }
            } catch (e) {
                log(`TG-${chatId}`, `Greeting generation failed: ${e.message}`);
                safeSendMessage(chatId, "Hey! 👋 What's up?"); // Fallback
            }
        }

        return;
    }

    if (text.startsWith('/persona') || text.startsWith('/summon')) {
        const parts = text.split(' ');
        const subCommand = parts[1];

        if (subCommand === 'list') {
            safeSendMessage(chatId, "Available Relationship Personas:\n- `sweetie` (Ziva - Sweet Girlfriend)\n- `partner` (Liam - Protective Partner)\n- `flirty-stranger` (Emma - Curious Stranger)\n- `confident-zane` (Zane - Confident Lover)\n\nTry `/persona <id>`!");
        } else if (subCommand === 'sub') {
            const isSub = !userSubscriptions.get(chatId);
            userSubscriptions.set(chatId, isSub);
            safeSendMessage(chatId, `Subscription status updated: ${isSub ? "PRO ✅ (Busy Mode active)" : "FREE ❌"}`);
        } else if (subCommand) {
            userPersonas.set(chatId, subCommand);
            const action = text.startsWith('/summon') ? "summoned" : "switched";
            safeSendMessage(chatId, `Persona ${action} to: *${subCommand}*. 🎭`, { parse_mode: 'Markdown' });
        }
        return;
    }

    // 2. Safety Check (Pre-LLM)
    if (detectCrisis(text)) {
        const emergencyReply = enforceSafetyLayer(text, "");
        safeSendMessage(chatId, emergencyReply);
        log(`TG-${chatId}`, `[CRISIS OVERRIDE] Sent emergency reply`);
        return;
    }

    // 3. Inference via Sarvam Proxy
    try {
        const defaultPersona = (serviceName === 'emma') ? 'sweetie' : 'sweet_gf';
        const personaId = userPersonas.get(chatId) || defaultPersona;

        // STICKER REACTION (4% chance)
        if (Math.random() < 0.04) {
            // Note: In real production, we'd use stickers.sendSticker with a valid file_id
            // Simulating with a relatable emoji reply for now
            const sticks = ["🔥", "😂", "🙄", "👀", "🙌"];
            await safeSendMessage(chatId, sticks[Math.floor(Math.random() * sticks.length)]);
            log(`TG-${chatId}`, `Sent visual reaction (sticker placeholder)`);
        }

        // SEEN vs DELIVERED: Initial 2-5s delay to simulate "notification noticed"
        const seenDelay = Math.floor(Math.random() * 3000) + 2000;
        await new Promise(r => setTimeout(r, seenDelay));

        // ONLINE STATUS: Immediate typing on message receive
        bot.sendChatAction(chatId, 'typing');

        // MOOD TRACKING: Identify "low/sad" moods
        if (text.toLowerCase().match(/sad|low|ro raha|dukh|upset|depression|tension/)) {
            const profile = userProfiles.get(chatId) || { facts: [], jokes: [], nicknames: [], lastLowDate: null };
            profile.lastLowDate = Date.now();
            userProfiles.set(chatId, profile);
        }

        // COMPLEXITY THINKING DELAY (Elite Feature)
        const thinkDelay = Math.min(Math.max(text.length * 50, 1500), 10000);
        await new Promise(r => setTimeout(r, thinkDelay));
        bot.sendChatAction(chatId, 'typing');

        // MISSED CALL SIMULATION (2% chance)
        if (Math.random() < 0.02) {
            await safeSendMessage(chatId, "📞 Missed voice call");
            await new Promise(r => setTimeout(r, 4000));
            await safeSendMessage(chatId, "Arre, just checking if you're okay. Busy thee kya? 😏");
            return;
        }

        // BUSY MODE (Subscription Only)
        const isSubscribed = userSubscriptions.get(chatId) || false;
        if (isSubscribed && Math.random() < 0.05) {
            const busyMsgs = ["Arre yar, 5 min de, thoda kaam hai.", "Ek min, call aa rahi hai.", "Just reaching home, 10 min mein reply karta hoon!", "Wait, kuch urgent kaam aa gaya."];
            const busyMsg = busyMsgs[Math.floor(Math.random() * busyMsgs.length)];
            await safeSendMessage(chatId, busyMsg);

            setTimeout(async () => {
                await bot.sendChatAction(chatId, 'typing');
                const llmResponse = await getCharacterResponse(personaId, text, false, chatId);
                saveToHistory(chatId, 'assistant', llmResponse);
                await sendHumanizedResponse(chatId, llmResponse, personaId);
            }, 30000);
            return;
        }

        // VISUAL REACTION (15% chance to react to user message)
        if (Math.random() < 0.15) {
            const reactionEmojis = ['❤️', '😂', '👍', '🔥', '👀', '🙏'];
            const chosenEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
            try {
                // Using raw request to ensure compatibility with all bot versions
                await fetch(`https://api.telegram.org/bot${token}/setMessageReaction`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        message_id: msg.message_id,
                        reaction: [{ type: 'emoji', emoji: chosenEmoji }]
                    })
                });
                log(`TG-${chatId}`, `Reacted with ${chosenEmoji}`);
            } catch (e) {
                log(`TG-${chatId}`, `Reaction failed: ${e.message}`);
            }
        }

        // DOUBLE TEXTING (5% chance intro)
        if (Math.random() < 0.05) {
            const pings = ["Oye", "Listen", "Sunn", "Ek cheez bolu?", "Yar..."];
            const ping = pings[Math.floor(Math.random() * pings.length)];
            await safeSendMessage(chatId, ping);
            await new Promise(r => setTimeout(r, 1500));
            bot.sendChatAction(chatId, 'typing');
        }

        // 4. SMART QUEUE: Call AI within the serializer to prevent resource contention
        const llmResponse = await aiQueue.add(
            async () => {
                const profile = userProfiles.get(chatId) || {};
                const neuralMemory = userMemories.get(chatId) || "";
                const history = userChatHistory.get(chatId) || [];
                const anchors = await anchorMemories.query(chatId, history[history.length - 1]?.content || "");

                return getCharacterResponse({
                    personaId,
                    userText: text,
                    history,
                    memory: neuralMemory,
                    anchors,
                    profile,
                    proxyUrl: process.env.SARVAM_PROXY_URL,
                    chatId
                });
            },
            bot,
            chatId
        );

        saveToHistory(chatId, 'assistant', llmResponse);

        await sharedSendResponse({
            bot,
            chatId,
            text: llmResponse,
            personaId,
            safeSendMessage
        });
        log(`TG-${chatId}`, `Responded to: "${text.slice(0, 30)}..."`);

        // 5. Periodic Memory Sync (Neural Summary)
        const history = userChatHistory.get(chatId) || [];
        if (history.length > 0 && history.length % 10 === 0) {
            summarizeConversation(chatId, history);
        }
    } catch (e) {
        log(`TG-${chatId}`, `CRITICAL ERROR: ${e.message}`);
        console.error(`[TG-${chatId}] FULL ERROR STACK:`, e);
        
        // Send a natural, in-character error message instead of a generic one
        const personaId = userPersonas.get(chatId) || 'midnight';
        const errorMsgs = [
            "arre yar, ek sec...",
            "wait wait, kuch ho gaya 😅",
            "sry thoda lag gaya, phir bolo?",
            "oops, kuch glitch hua. dobara bhejo!"
        ];
        const errMsg = errorMsgs[Math.floor(Math.random() * errorMsgs.length)];
        await safeSendMessage(chatId, errMsg);
    }
    } catch (err) {
        telemetry.error(`Global Bot Error for Chat ${msg?.chat?.id}: ${err.message}`, { stack: err.stack });
    }
});

// WINGMAN PROTOCOL & COMMAND HANDLERS
bot.onText(/\/wingman (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const play = match[1].toLowerCase();
    const personaId = userPersonas.get(chatId) || 'midnight';

    log(`TG-${chatId}`, `Wingman Requested: ${play}`);

    let prompt = "";
    if (play.includes("hype")) {
        prompt = "We are in a group chat. The user is a legend. Say something high-energy and character-appropriate to hype them up. Make it look natural.";
    } else if (play.includes("save") || play.includes("rescue")) {
        prompt = "Create a believable 'fake emergency' or a reason for the user to leave the conversation immediately. Be convincing and in character.";
    } else {
        prompt = `Respond to the group in a way that makes the user look cool/funny. Context: ${play}`;
    }

    const response = await getCharacterResponse(personaId, prompt, false, chatId);
    saveToHistory(chatId, 'assistant', response);
    await safeSendMessage(chatId, response);
});

bot.onText(/\/interpret (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const dream = match[1];
    const personaId = userPersonas.get(chatId) || 'midnight';

    log(`TG-${chatId}`, `Dream Interpretation Requested`);

    const prompt = `I just had a dream: "${dream}". As my companion, interpret this dream for me in your unique character style. Be mystical, psychological, or funny depending on who you are.`;

    const response = await getCharacterResponse(personaId, prompt, false, chatId);
    saveToHistory(chatId, 'assistant', response);
    await sendHumanizedResponse(chatId, `🌙 *Dreamscape:* ${response}`, personaId);
});

/**
 * Proactive Scheduler (Cron Job)
 * Checks every hour, sends nudge if user was active in last 24h but inactive for N hours.
 */
const NUDGE_INTERVAL_HOUR = parseInt(process.env.PROACTIVE_INTERVAL_HOURS || '6');

cron.schedule('0 * * * *', async () => {
    log('Scheduler', `Running proactive check...`);
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const nudgeIntervalMs = NUDGE_INTERVAL_HOUR * 60 * 60 * 1000;

    for (const [chatId, lastActive] of userActivity.entries()) {
        const timeSinceActive = now - lastActive;
        const profile = userProfiles.get(chatId) || { facts: [], jokes: [], nicknames: [], events: [], lastLowDate: null };
        const personaId = userPersonas.get(chatId) || 'midnight';

        // 1. EVENT FOLLOW-UP (Prioritize Life-Sync)
        // Detect if an event is for "today"
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); // e.g. "monday"
        const eventToday = profile.events.find(e => {
            const time = e.time.toLowerCase();
            return time.includes(today) || (time.includes("tomorrow") && (now - e.created) > (18 * 60 * 60 * 1000));
        });

        if (eventToday) {
            log(`TG-${chatId}`, `Triggering EVENT nudge for ${eventToday.type}`);
            const eventNudges = [
                `Oye, ${eventToday.type} ke liye ready? All the best! 🤞`,
                `Poora bharosa hai, ${eventToday.type} mein fod ke aaoge! 🔥`,
                `Deep breaths. ${eventToday.type} acha jaayega, don't worry. ❤️`,
                `Hamari naak mat katwana, ${eventToday.type} dhang se dena! 😉`
            ];
            const nudge = eventNudges[Math.floor(Math.random() * eventNudges.length)];
            await sendHumanizedResponse(chatId, nudge, personaId);

            // Remove event after nudging so it doesn't repeat
            profile.events = profile.events.filter(e => e !== eventToday);
            userProfiles.set(chatId, profile);
            userActivity.set(chatId, now);
            continue;
        }

        // 2. MOOD FOLLOW-UP
        if (profile.lastLowDate && (now - profile.lastLowDate) > (20 * 60 * 60 * 1000)) {
            log(`TG-${chatId}`, `Triggering MOOD follow-up for ${personaId}`);
            const moodNudges = [
                "Kal low tha na? Aaj better hai? ❤️",
                "Just checking in... hope today is better than yesterday. 🤗",
                "Oye, mood theek hai aaj? Kal thoda upset lag rahe thay.",
                "Thinking of you. Kal ka din hard tha, hope you're smiling today! ✨"
            ];
            const nudge = moodNudges[Math.floor(Math.random() * moodNudges.length)];
            await sendHumanizedResponse(chatId, nudge, personaId);

            profile.lastLowDate = null; // Reset
            userProfiles.set(chatId, profile);
            userActivity.set(chatId, now); // Update activity
            continue;
        }

        // 2. STANDARD NUDGE
        if (timeSinceActive > nudgeIntervalMs && timeSinceActive < twentyFourHours) {
            const isFollowUp = Math.random() > 0.6;
            log(`TG-${chatId}`, `Triggering proactive nudge (followup=${isFollowUp}) for ${personaId}`);

            try {
                let nudge;
                if (isFollowUp) {
                    const follows = ["??", "Kahan gaye yar?", "Sun rahe ho?", "Oye!", "Hellooo", "Silent kyun ho gaye?"];
                    nudge = follows[Math.floor(Math.random() * follows.length)];
                } else {
                    nudge = await getCharacterResponse(personaId, "", true, chatId);
                }

                saveToHistory(chatId, 'assistant', nudge);
                await sendHumanizedResponse(chatId, nudge, personaId);
                userActivity.set(chatId, now);
            } catch (e) {
                log(`TG-${chatId}`, `Scheduler Fail: ${e.message}`);
            }
        }
    }
});

// 8 AM DAILY VIBES NUDGE (Premium Feature)
cron.schedule('0 8 * * *', async () => {
    log('Scheduler', 'Sending Daily Vibes 🌟...');
    const now = Date.now();
    for (const [chatId, isSubscribed] of userSubscriptions.entries()) {
        if (isSubscribed) {
            const personaId = userPersonas.get(chatId) || 'midnight';
            const vMsg = "Suprabhat! ✨ Aaj ki 'Daily Vibes' ready hain. Click here to see your horoscope & affirmation: https://dostai.vercel.app/vibes";
            await sendHumanizedResponse(chatId, vMsg, personaId);
            userActivity.set(chatId, now);
        }
    }
});

process.on('SIGINT', () => {
    if (bot) bot.stopPolling();
    process.exit();
});
}
