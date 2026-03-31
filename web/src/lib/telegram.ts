export const getTelegramLink = (pId: string, action: 'persona' | 'interpret' | 'default' = 'persona') => {
    const personaId = pId.toLowerCase();
    const startPrefix = action === 'interpret' ? 'interpret_' : 'persona_';

    // UNIVERSAL BOT: All companions now route through the single Buddy Claw engine
    return `https://t.me/BuddyClawchat_bot?start=${startPrefix}${personaId}`;
};
