import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

const buildClientUrl = (path) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  return new URL(path, clientUrl).toString();
};

const buildServerUrl = (path) => {
  const serverUrl = process.env.SERVER_URL || "http://localhost:5000";
  return new URL(path, serverUrl).toString();
};

const buildGoogleAuthUrl = (mode) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || buildServerUrl("/api/auth/google/callback");

  if (!clientId) {
    return null;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    access_type: "offline",
    state: mode,
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
};

const exchangeCodeForTokens = async (code) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || buildServerUrl("/api/auth/google/callback");

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google token exchange failed: ${errorText}`);
  }

  return response.json();
};

const fetchGoogleProfile = async (accessToken) => {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google userinfo request failed: ${errorText}`);
  }

  return response.json();
};

// Google OAuth start
router.get("/google", (req, res) => {
  const mode = req.query.mode === "signin" ? "signin" : "signup";
  const authUrl = buildGoogleAuthUrl(mode);

  if (!authUrl) {
    return res.status(500).json({ message: "Google OAuth is not configured on the server." });
  }

  return res.redirect(authUrl);
});

// Google OAuth callback
router.get("/google/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    const mode = state === "signin" ? "signin" : "signup";

    if (!code) {
      return res.redirect(`${buildClientUrl(mode === "signin" ? "/signin" : "/signup")}?google=error`);
    }

    const tokens = await exchangeCodeForTokens(code);
    const profile = await fetchGoogleProfile(tokens.access_token);

    if (!profile.email) {
      return res.redirect(`${buildClientUrl(mode === "signin" ? "/signin" : "/signup")}?google=error`);
    }

    let user = await User.findOne({ email: profile.email });

    // For signin mode: user must already exist
    if (mode === "signin" && !user) {
      return res.redirect(`${buildClientUrl("/signin")}?google=error&reason=no_account`);
    }

    // For signup mode: create user if doesn't exist
    if (!user) {
      user = new User({
        fullName: profile.name || profile.given_name || "Google User",
        email: profile.email,
        phone: "",
        password: null,
        googleId: profile.sub,
      });
      await user.save();
    } else if (!user.googleId) {
      // Update existing user with Google ID if not already linked
      user.googleId = profile.sub;
      if (!user.fullName && profile.name) {
        user.fullName = profile.name;
      }
      await user.save();
    }

    const clientPath = mode === "signin" ? "/signin" : "/signup";
    const redirectUrl = new URL(clientPath, process.env.CLIENT_URL || "http://localhost:5173");
    redirectUrl.searchParams.set("google", "success");
    redirectUrl.searchParams.set("email", profile.email);
    redirectUrl.searchParams.set("name", user.fullName || profile.name || "Google User");

    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Google OAuth error:", error);
    return res.redirect(`${buildClientUrl("/signin")}?google=error`);
  }
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, phone, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    if (!user.password) {
      return res.status(400).json({ message: "This account uses Google sign-in. Please continue with Google." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    res.json({ message: "Signin successful!", user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
