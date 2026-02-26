/**
 * MadMail Vanilla JS Core
 * Single Page Application Router & State Manager
 */
const app = document.getElementById('app');
const config = window.__data__;
// --- UTILS ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const bg = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    toast.className = `${bg} text-white px-6 py-3 rounded-full shadow-lg pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2 font-medium`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('animate-out', 'fade-out', 'slide-out-to-top-4');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('در حافظه کپی شد', 'success');
        return true;
    } catch (err) {
        showToast('خطا در کپی', 'error');
        return false;
    }
}
function generateRandomString(len = 10) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let res = '';
    const array = new Uint8Array(len);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < len; i++) res += chars.charAt(array[i] % chars.length);
    return res;
}
// --- VIEWS ---
const Views = {
    Home: () => `
        <div class="flex flex-col items-center gap-12 text-center animate-in fade-in duration-500">
            <header class="space-y-6">
                <div class="inline-flex p-4 rounded-3xl bg-primary/10 text-primary shadow-sm mb-2">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"></path></svg>
                </div>
                <h1 class="text-4xl font-black sm:text-6xl tracking-tight">پیام‌رسان <span class="text-primary">MadMail</span></h1>
                <p class="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">ارتباطات آزاد و امن. حساب شما در چند ثانیه آماده می‌شود.</p>
            </header>
            <div id="cta-card" class="w-full max-w-md bg-card border-2 rounded-3xl shadow-2xl p-8 space-y-6">
                <h2 class="text-2xl font-bold">ایجاد حساب جدید</h2>
                <p class="text-muted-foreground">برای شروع، یک آدرس اختصاصی دریافت ک��ید.</p>
                <button id="create-acc-btn" class="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">ساخت حساب در ${config.mailDomain}</button>
            </div>
            <div id="success-view" class="hidden w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center text-right"></div>
        </div>
    `,
    Info: () => `
        <div class="space-y-10 max-w-4xl mx-auto">
            <h1 class="text-4xl font-black">اطلاعات سرور</h1>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-6 border-2 rounded-2xl bg-card">
                    <p class="text-sm text-muted-foreground mb-1">دامنه</p>
                    <p class="text-xl font-bold">${config.mailDomain}</p>
                </div>
                <div class="p-6 border-2 rounded-2xl bg-card">
                    <p class="text-sm text-muted-foreground mb-1">سهمیه فضا</p>
                    <p class="text-xl font-bold">۱۰۰ مگابایت</p>
                </div>
            </div>
            <div class="p-6 bg-muted/30 border-2 border-dashed rounded-2xl">
                <h3 class="font-bold mb-2">وضعیت سیستم</h3>
                <p class="text-muted-foreground">نسخه ${config.version} | وضعیت: عملیاتی</p>
            </div>
        </div>
    `,
    Security: () => `
        <div class="space-y-8 max-w-3xl mx-auto">
            <h1 class="text-4xl font-black">امنیت و حریم خصوصی</h1>
            <p class="text-lg text-muted-foreground">تمام پیام‌های شما در MadMail با استفاده از استانداردهای Autocrypt و PGP رمزنگاری می‌شوند.</p>
            <div class="space-y-4">
                <div class="p-4 bg-green-500/10 border-r-4 border-green-500 rounded-l-lg">
                    <p class="font-bold text-green-700 dark:text-green-400">رمزنگاری سرتاسری</p>
                    <p class="text-sm">پیام‌ها فقط در د��تگاه فرستنده و گیرنده قابل خواندن هستند.</p>
                </div>
                <div class="p-4 bg-blue-500/10 border-r-4 border-blue-500 rounded-l-lg">
                    <p class="font-bold text-blue-700 dark:text-blue-400">حذف خودکار</p>
                    <p class="text-sm">داده‌های شما پس از ۲۰ رو�� به صورت خودکار از سرور پاک می‌شوند.</p>
                </div>
            </div>
        </div>
    `,
    NotFound: () => `<div class="py-20 text-center"><h1 class="text-6xl font-black mb-4">۴۰۴</h1><p>صفحه یافت نشد</p></div>`
};
// --- ROUTER ---
function navigate(path) {
    window.history.pushState({}, "", path);
    handleRoute();
}
function handleRoute() {
    const path = window.location.pathname;
    app.innerHTML = (Views[Object.keys(Views).find(k => k.toLowerCase() === path.slice(1)) || 'Home'] || Views.NotFound)();
    // Highlight active nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('bg-accent', link.getAttribute('href') === path);
    });
    if (path === '/') initHomeLogic();
}
// --- LOGIC ---
function initHomeLogic() {
    const btn = document.getElementById('create-acc-btn');
    if (!btn) return;
    btn.onclick = async () => {
        btn.disabled = true;
        btn.innerHTML = '<svg class="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24"></svg>';
        // Simulating generation
        await new Promise(r => setTimeout(r, 1000));
        const user = generateRandomString(8);
        const pass = generateRandomString(12);
        const email = `${user}@${config.mailDomain}`;
        const dcLink = `dclogin:${email}?password=${pass}&ssl=1`;
        document.getElementById('cta-card').classList.add('hidden');
        const success = document.getElementById('success-view');
        success.classList.remove('hidden');
        success.innerHTML = `
            <div class="bg-card border-2 rounded-3xl p-6 shadow-xl flex flex-col items-center gap-4">
                <canvas id="qr-canvas"></canvas>
                <p class="text-sm font-medium text-muted-foreground">اسکن با دوربین DeltaChat</p>
            </div>
            <div class="space-y-6">
                <div class="space-y-2">
                    <h3 class="text-2xl font-bold text-primary">حساب شما آماده است!</h3>
                    <p class="text-muted-foreground">اطلاعات ورود خود را ذخیره کنید.</p>
                </div>
                <div class="p-6 bg-muted/50 rounded-2xl space-y-4 font-mono text-left" dir="ltr">
                    <div>
                        <p class="text-xs text-muted-foreground uppercase mb-1">EMAIL</p>
                        <p class="text-lg">${email}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted-foreground uppercase mb-1">PASSWORD</p>
                        <p class="text-lg">${pass}</p>
                    </div>
                </div>
                <button id="dc-open-btn" class="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg">ورود مستقیم به DeltaChat</button>
                <button id="copy-details-btn" class="w-full py-2 text-muted-foreground hover:text-foreground">کپی اطلاعات</button>
            </div>
        `;
        new QRious({ element: document.getElementById('qr-canvas'), value: dcLink, size: 240, level: 'H' });
        document.getElementById('dc-open-btn').onclick = () => window.location.href = dcLink;
        document.getElementById('copy-details-btn').onclick = () => copyToClipboard(`Email: ${email}\nPass: ${pass}`);
    };
}
// --- GLOBAL EVENT LISTENERS ---
document.addEventListener('click', e => {
    if (e.target.matches('[data-link], [data-link] *')) {
        e.preventDefault();
        navigate(e.target.closest('[data-link]').getAttribute('href'));
    }
});
document.getElementById('theme-toggle').onclick = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};
document.getElementById('footer-year').textContent = new Date().getFullYear();
// Initial load
window.onpopstate = handleRoute;
handleRoute();