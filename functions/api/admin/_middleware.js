// ==========================================
// Cloudflare Pages Admin Middleware
// ==========================================

export async function onRequest(context) {
    const user = context.data.user;
    
    // Pastikan user terautentikasi dan memiliki role 'admin'
    if (!user || user.role !== 'admin') {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Akses ditolak. Silakan masuk menggunakan akun Administrator." 
        }), {
            status: 403,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            }
        });
    }
    
    return context.next();
}
