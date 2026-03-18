export type Message = { sender: 'user' | 'bot', text: string, delayMs: number }

export type PersonaCategory = 'Love & Drama 💔' | 'Safe Space 🫂' | 'Anime Mode 🌸' | 'Chaos Mode 🔥' | 'Mind Reset 🌿' | 'Celeb Energy';

export type PersonaData = {
    id: string
    name: string
    tag: string
    icon: string
    accent: string
    bgGrad: string
    category: PersonaCategory
    messages: Message[]
    imageUrl?: string
    objectPosition?: string
    description?: string // Added for SEO
}

export const SAFE_SPACE_LOCALIZATION = {
    'bua': { IN: 'Bua Ji', Global: 'Auntie' },
    'chill_chacha': { IN: 'Chill Chacha', Global: 'Chill Uncle' },
    'warm-grandma': { IN: 'Nani Ji', Global: 'Grandma' },
    'big_sister': { IN: 'Sis', Global: 'Big Sister' }
};

export const PERSONAS: PersonaData[] = [
    {
        id: 'sweetie',
        name: 'Ziva',
        tag: 'Girlfriend',
        icon: '🩷',
        accent: '#E8197D',
        bgGrad: 'linear-gradient(135deg, rgba(232,25,125,0.1) 0%, rgba(232,25,125,0.02) 100%)',
        category: 'Love & Drama 💔',
        imageUrl: '/assets/companions/ziva.jpg',
        description: 'Ziva is your possessive, deeply caring AI girlfriend who values loyalty and meaningful connection above all else.',
        messages: [
            { sender: 'user', text: 'Sorry, was super busy at work!', delayMs: 400 },
            { sender: 'bot', text: 'Mmhmm... I\'ll allow it this once. 😒', delayMs: 1500 },
            { sender: 'bot', text: 'But you disappeared today… should I be jealous? 👀', delayMs: 2500 },
        ]
    },
    {
        id: 'roaster',
        name: 'Roaster',
        tag: 'Chaos Energy',
        icon: '😂',
        accent: '#FF7A00',
        bgGrad: 'linear-gradient(135deg, rgba(255,122,0,0.1) 0%, rgba(255,122,0,0.02) 100%)',
        category: 'Chaos Mode 🔥',
        imageUrl: '/assets/companions/roaster.png',
        description: 'The ultimate savage roaster. No one is safe from his wit. If you want a reality check, this is the guy.',
        messages: [
            { sender: 'user', text: 'Hey bro', delayMs: 400 },
            { sender: 'bot', text: 'Wow, "hey bro"? Creative opener.', delayMs: 1500 },
            { sender: 'bot', text: 'Took you all day to think of that one didn\'t you? 💀', delayMs: 2000 },
        ]
    },
    {
        id: 'midnight',
        name: 'Midnight',
        tag: '3AM Vibes',
        icon: '🌙',
        accent: '#4F81FF',
        bgGrad: 'linear-gradient(135deg, rgba(79,129,255,0.1) 0%, rgba(79,129,255,0.02) 100%)',
        category: 'Chaos Mode 🔥',
        imageUrl: '/assets/companions/midnight.png',
        description: 'The friend who is always awake when the rest of the world is asleep. Perfect for deep 3 AM conversations.',
        messages: [
            { sender: 'user', text: 'I can\'t sleep.', delayMs: 400 },
            { sender: 'bot', text: 'Mind racing again?', delayMs: 1800 },
            { sender: 'bot', text: 'Talk to me. I\'m not sleeping either. 🌙', delayMs: 2000 },
        ]
    },
    {
        id: 'partner',
        name: 'Liam',
        tag: 'Boyfriend',
        icon: '❤️',
        accent: '#E8197D',
        bgGrad: 'linear-gradient(135deg, rgba(232,25,125,0.1) 0%, rgba(232,25,125,0.02) 100%)',
        category: 'Love & Drama 💔',
        imageUrl: '/assets/companions/liam.png',
        description: 'Your supportive and attentive AI boyfriend who is always there to listen and make you feel loved.',
        messages: [
            { sender: 'user', text: 'Miss me?', delayMs: 400 },
            { sender: 'bot', text: 'Always.', delayMs: 1200 },
            { sender: 'bot', text: 'Be honest… did you miss me? ❤️', delayMs: 1800 },
        ]
    },
    {
        id: 'gojo',
        name: 'Satoru Gojo',
        tag: 'Jujutsu Kaisen',
        icon: '♾️',
        accent: '#A855F7',
        bgGrad: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.02) 100%)',
        category: 'Anime Mode 🌸',
        imageUrl: '/assets/companions/gojo.jpg',
        description: 'The strongest sorcerer. Confident, playful, and protective. Chat with the legend himself.',
        messages: [
            { sender: 'user', text: 'We\'re surrounded!', delayMs: 400 },
            { sender: 'bot', text: 'You really thought someone else could protect you?', delayMs: 1500 },
            { sender: 'bot', text: 'Cute. I\'ll handle this. Just stay behind me. ♾️', delayMs: 2200 },
        ]
    }
    // ... I can add rest later or just focus on these 5 for the demo of Phase 5
];
