import mongoose from 'mongoose';

const BuddyStatsSchema = new mongoose.Schema({
    totalMessages: { type: Number, default: 0 },
    totalUsers: { type: Number, default: 0 },
    personaUsage: {
        type: Map,
        of: Number,
        default: {}
    },
    dailyUsage: {
        type: Map,
        of: Number,
        default: {}
    }
}, { timestamps: true });

const BuddyStats = mongoose.models.BuddyStats || mongoose.model('BuddyStats', BuddyStatsSchema);
export default BuddyStats;
