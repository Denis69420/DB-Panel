// backend/routes/auth.js
const express = require('express');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const jwt = require('jsonwebtoken');
const router = express.Router();

const scopes = ['identify', 'guilds'];

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_REDIRECT_URI,
    scope: scopes
  },
  async (accessToken, refreshToken, profile, done) => {
    // Check if user belongs to the required Discord guild
    const guilds = profile.guilds || [];
    const guildId = process.env.DISCORD_GUILD_ID;
    const member = guilds.find(g => g.id === guildId);
    if (!member) {
      return done(null, false);
    }
    // Optionally check for a specific role here (using Discord API if needed)
    return done(null, profile);
  }
));

// Start Discord OAuth2 flow
router.get('/discord', passport.authenticate('discord'));

// OAuth2 callback URL
router.get('/discord/callback', passport.authenticate('discord', { failureRedirect: '/login' }), (req, res) => {
  // On successful authentication, issue a JWT
  const payload = {
    discordId: req.user.id,
    username: req.user.username,
    avatar: req.user.avatar
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  // Redirect to frontend dashboard with token in query (for simplicity)
  res.redirect(`/dashboard?token=${token}`);
});

module.exports = router;
