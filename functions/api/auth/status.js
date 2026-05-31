// ==========================================
// API Endpoint: /api/auth/status
// ==========================================

export async function onRequestGet(context) {
    const user = context.data.user;
    
    if (!user) {
        return new Response(JSON.stringify({ success: false, message: "Sesi tidak valid atau telah berakhir." }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }
    
    return new Response(JSON.stringify({ success: true, user }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
