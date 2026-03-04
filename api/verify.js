/**
 * @file api/verify.js
 * Vercel Serverless Function to handle activation code verification.
 * This is the secure side of the application.
 */

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { code } = req.body;

    // 1. HARDCODED WHITELIST (Example - Keep secret codes here)
    const WHITE_LIST = [
        "SPECIAL_GUEST_2024",
        "MASTER_BETA_USER",
        "GIFT_FROM_DEVELOPER"
    ];

    if (!code) {
        return res.status(400).json({ error: 'Activation code required.' });
    }

    // Check Whitelist
    if (WHITE_LIST.includes(code)) {
        return res.status(200).json({
            success: true,
            token: "WH_JWT_" + Math.random().toString(36).substring(7), // In reality, use signed JWT
            message: "Whitelist activated successfully."
        });
    }

    // 2. AFDIAN API VERIFICATION (Future Implementation)
    // If not in whitelist, we could check Afdian orders here using fetch()
    // ...

    return res.status(403).json({
        success: false,
        error: 'Invalid activation code.'
    });
}
