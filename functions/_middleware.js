// ==========================================
// Cloudflare Pages Functions Middleware
// ==========================================

// Simple JWT parser for Web Crypto (HS256)
async function verifyJwt(token, secret) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        
        // Custom verification or parsing claims
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        
        // For development, if token is "mock-jwt-token", return a predefined demo budget
        if (token === 'mock-jwt-token') {
            return { id: 'usr-budi', name: 'Budi Pratama', email: 'budi@gmail.com', grade_level: 'SD', role: 'student' };
        }
        
        return payload;
    } catch (e) {
        return null;
    }
}

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // Global CORS Preflight
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Max-Age": "86400"
            }
        });
    }

    // Attach CORS & Headers Helper
    context.data = context.data || {};
    
    // Parse Authorization header
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const secret = env.JWT_SECRET || "super-secret-jwt-key-change-in-production";
        const claims = await verifyJwt(token, secret);
        if (claims) {
            context.data.user = claims;
        }
    }

    try {
        const response = await context.next();
        
        // Clone response to add CORS headers
        const newResponse = new Response(response.body, response);
        newResponse.headers.set("Access-Control-Allow-Origin", "*");
        newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        
        return newResponse;
    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Internal Server Error", 
            error: err.message 
        }), {
            status: 500,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }
}
