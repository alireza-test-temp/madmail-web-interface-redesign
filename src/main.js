/**
 * MadMail Vanilla JS Core
 * Definitive Single Page Application Router & State Manager
 */
const app = document.getElementById('app');
const config = window.__data__;
// --- UTILS ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    const bg = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    toast.className = `${bg} text-white px-6 py-3 rounded-full shadow-lg pointer-events-auto transition-all duration-300 flex items-center gap-2 font-medium opacity-0 translate-y-4`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-y-4');
        toast.classList.add('opacity-100', 'translate-y-0');
    });
    setTimeout(() => {
        toast.classList.add('opacity-0', '-translate-y-4');
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
// Protocol Detection 'Blur Hack'
async function tryOpenProtocol(url) {
    let blurred = false;
    const onBlur = () => { blurred = true; };
    window.addEventListener('blur', onBlur);
    window.location.href = url;
    return new Promise((resolve) => {
        setTimeout(() => {
            window.removeEventListener('blur', onBlur);
            resolve(blurred);
        }, 2000);
    });
}
// --- API CLIENT ---
async function apiFetch(path, options = {}) {
    try {
        const res = await fetch(path, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'خطا در شبکه');
        return json.data;
    } catch (err) {
        console.error('API Error:', err);
        throw err;
    }
}
// --- VIEWS ---
const Views = {
    Home: () => `
        <div class="flex flex-col items-center gap-12 text-center animate-fade-in">
            <header class="space-y-6">
                <div class="inline-flex p-4 rounded-3xl bg-primary/10 text-primary shadow-sm mb-2">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"></path></svg>
                </div>
                <h1 class="text-4xl font-black sm:text-6xl tracking-tight">سرویس <span class="text-primary">MadMail</span></h1>
                <p class="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">ارتباطات آزاد، امن و خصوصی با استفاده از پروتکل‌های استاندارد.</p>
            </header>
            <div id="home-content" class="w-full flex justify-center">
                <div id="cta-card" class="w-full max-w-md bg-card border-2 rounded-3xl shadow-2xl p-8 space-y-6">
                    <h2 class="text-2xl font-bold">ایجاد حساب جدید</h2>
                    <p class="text-muted-foreground">برای شروع، یک آدر�� اختصاصی برای DeltaChat دریافت کنید.</p>
                    <button id="create-acc-btn" class="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">ساخت حساب در ${config.mailDomain}</button>
                </div>
                <div id="success-view" class="hidden w-full max-w-4xl grid md:grid-cols-2 gap-10 items-center text-right"></div>
            </div>
        </div>
    `,
    Share: () => `
        <div class="max-w-2xl mx-auto space-y-10 animate-fade-in">
            <header class="text-center space-y-4">
                <div class="inline-flex p-4 rounded-3xl bg-primary/10 text-primary shadow-inner"><svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg></div>
                <h1 class="text-4xl font-black">اشتراک تماس</h1>
                <p class="text-muted-foreground text-lg">آدرس‌های طولانی DeltaChat را به لینک‌های کوتاه تبدیل کنید.</p>
            </header>
            <div id="share-form-container" class="bg-card border-2 rounded-3xl shadow-xl p-8">
                <form id="share-form" class="space-y-6">
                    <div class="space-y-2">
                        <label class="text-sm font-bold">نام نمایشی</label>
                        <input type="text" id="share-name" placeholder="نام شما" class="w-full h-14 px-4 rounded-xl border bg-muted/50 focus:ring-2 ring-primary outline-none">
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-bold">لینک DeltaChat (https://i.delta.chat/#...)</label>
                        <input type="url" id="share-url" required class="w-full h-14 px-4 rounded-xl border bg-muted/50 font-mono text-sm" dir="ltr">
                    </div>
                    <button type="submit" id="share-submit-btn" class="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg">ایجاد لینک اشتراک</button>
                </form>
            </div>
        </div>
    `,
    Deploy: () => `
        <div class="max-w-4xl mx-auto space-y-10 animate-fade-in">
            <header class="text-center space-y-4">
                <div class="inline-flex p-4 rounded-3xl bg-primary/10 text-primary"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
                <h1 class="text-4xl font-black">راه‌اندازی سرور</h1>
                <p class="text-muted-foreground text-lg">نصب MadMail روی لینوکس در کمتر از یک دقیقه.</p>
            </header>
            <div class="space-y-6">
                <div class="bg-zinc-950 text-zinc-100 p-6 rounded-2xl relative group font-mono text-sm">
                    <p class="text-zinc-500 mb-2 font-sans">دستور نصب:</p>
                    <code id="install-cmd" class="block py-2" dir="ltr">wget http://${config.publicIP}/madmail && chmod +x madmail && ./madmail</code>
                    <button onclick="copyToClipboard(document.getElementById('install-cmd').innerText)" class="absolute top-4 left-4 p-2 hover:bg-white/10 rounded-md transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg></button>
                </div>
            </div>
        </div>
    `,
    Info: () => `
        <div class="space-y-10 max-w-4xl mx-auto animate-fade-in">
            <h1 class="text-4xl font-black">اطلاعات و راهنما</h1>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="p-6 border-2 rounded-2xl bg-card text-center">
                    <p class="text-sm text-muted-foreground mb-1">دامنه</p>
                    <p class="text-xl font-bold">${config.mailDomain}</p>
                </div>
                <div class="p-6 border-2 rounded-2xl bg-card text-center">
                    <p class="text-sm text-muted-foreground mb-1">سهمیه</p>
                    <p class="text-xl font-bold">۱۰۰ مگابایت</p>
                </div>
                <div class="p-6 border-2 rounded-2xl bg-card text-center">
                    <p class="text-sm text-muted-foreground mb-1">نگهداری</p>
                    <p class="text-xl font-bold">${config.retentionDays} روز</p>
                </div>
                <div class="p-6 border-2 rounded-2xl bg-card text-center">
                    <p class="text-sm text-muted-foreground mb-1">نسخه</p>
                    <p class="text-xl font-bold">${config.version}</p>
                </div>
            </div>
            <div class="p-8 bg-muted/30 border-2 border-dashed rounded-3xl">
                <h3 class="text-xl font-bold mb-4">پروکسی Shadowsocks</h3>
                <div class="flex items-center gap-3 p-4 bg-background rounded-xl border font-mono text-xs overflow-hidden">
                    <code class="truncate flex-1" dir="ltr">${config.ssURL}</code>
                    <button onclick="copyToClipboard('${config.ssURL}')" class="shrink-0 text-primary font-sans font-bold">کپی</button>
                </div>
            </div>
        </div>
    `,
    Security: () => `
        <div class="space-y-12 max-w-3xl mx-auto animate-fade-in text-center">
            <header class="space-y-4">
                <div class="inline-flex p-5 rounded-3xl bg-primary/10 text-primary shadow-sm"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></div>
                <h1 class="text-4xl font-black">امنیت و حریم خص��صی</h1>
                <p class="text-xl text-muted-foreground">در اینجا امنیت یک ��نتخاب نیست، یک استاندارد است.</p>
            </header>
            <div class="grid gap-6">
                <div class="p-6 bg-card border-2 rounded-2xl text-right">
                    <h3 class="font-bold text-lg mb-2">رمزنگاری Autocrypt</h3>
                    <p class="text-muted-foreground">تمامی پیام‌ها قبل از خ��وج از دستگاه شما با کلیدهای PGP رمزنگاری می‌شوند.</p>
                </div>
                <div class="p-6 bg-card border-2 rounded-2xl text-right">
                    <h3 class="font-bold text-lg mb-2">عدم ذخیره‌سازی آی‌پی</h3>
                    <p class="text-muted-foreground">ما آدرس‌های IP کاربران را ذخیره نمی‌کنیم و هیچ متادیتایی جمع‌آوری نمی‌شود.</p>
                </div>
            </div>
        </div>
    `,
    Docs: (sub) => {
        const docsNav = `
            <nav class="flex gap-2 mb-8 overflow-x-auto pb-2 border-b">
                <a href="/docs" data-link class="nav-link text-sm font-bold whitespace-nowrap px-4 py-2 rounded-lg hover:bg-accent transition-colors">شاخ��</a>
                <a href="/docs/general" data-link class="nav-link text-sm font-bold whitespace-nowrap px-4 py-2 rounded-lg hover:bg-accent transition-colors">عمومی</a>
                <a href="/docs/admin" data-link class="nav-link text-sm font-bold whitespace-nowrap px-4 py-2 rounded-lg hover:bg-accent transition-colors">مدیریت</a>
                <a href="/docs/database" data-link class="nav-link text-sm font-bold whitespace-nowrap px-4 py-2 rounded-lg hover:bg-accent transition-colors">دیتابیس</a>
                <a href="/docs/custom" data-link class="nav-link text-sm font-bold whitespace-nowrap px-4 py-2 rounded-lg hover:bg-accent transition-colors">سفارشی</a>
            </nav>
        `;
        let content = '';
        if (sub === 'general') {
            content = `
                <article class="prose prose-zinc dark:prose-invert max-w-none">
                    <h2 class="text-3xl font-black mb-6">راهنمای عمومی</h2>
                    <p class="text-lg leading-relaxed">MadMail یک میل‌سرور سبک و متمرکز بر حریم خصوصی است که اختصاصاً برای DeltaChat طراحی شده است. برخلاف میل‌سرورهای سنتی، MadMail بر سادگی، سرعت و ��منیت کاربر نهایی تمرکز دارد.</p>
                    <div class="grid sm:grid-cols-2 gap-6 mt-8">
                        <div class="p-6 border-2 rounded-2xl bg-card">
                            <h4 class="font-bold mb-2">رمزنگاری سرتاسری</h4>
                            <p class="text-sm text-muted-foreground">ا��تفاده از استاندارد Autocrypt برای مدیریت خودکار کلیدهای عمومی و خصوصی PGP بدون دخالت کاربر.</p>
                        </div>
                        <div class="p-6 border-2 rounded-2xl bg-card">
                            <h4 class="font-bold mb-2">حذف خودکار</h4>
                            <p class="text-sm text-muted-foreground">پیام‌ها پس از ۲۰ روز (قابل تغییر) به طور کامل از دیتابیس حذف می‌شوند تا امنیت بلندمدت تامین ��ود.</p>
                        </div>
                    </div>
                </article>
            `;
        } else if (sub === 'admin') {
            content = `
                <article class="space-y-6">
                    <h2 class="text-3xl font-black">مدیریت از طریق CLI</h2>
                    <p class="text-muted-foreground">تمامی جنبه‌های سرور از طریق دستورات خط فرمان قابل کنترل هستند.</p>
                    <div class="space-y-4">
                        <div class="p-4 bg-zinc-900 text-zinc-100 rounded-xl font-mono text-sm border shadow-inner">
                            <p class="text-zinc-500 mb-1">ساخت کاربر:</p>
                            <code dir="ltr">./madmail user add user@domain pass</code>
                        </div>
                        <div class="p-4 bg-zinc-900 text-zinc-100 rounded-xl font-mono text-sm border shadow-inner">
                            <p class="text-zinc-500 mb-1">باز کردن ثبت‌نام:</p>
                            <code dir="ltr">./madmail reg open</code>
                        </div>
                        <div class="p-4 bg-zinc-900 text-zinc-100 rounded-xl font-mono text-sm border shadow-inner">
                            <p class="text-zinc-500 mb-1">فعال‌سازی JIT:</p>
                            <code dir="ltr">./madmail jit on</code>
                        </div>
                    </div>
                </article>
            `;
        } else if (sub === 'database') {
            content = `
                <article class="space-y-6">
                    <h2 class="text-3xl font-black">پیکربندی دیتابیس</h2>
                    <p>MadMail از دو موتور اصلی برای ذخیره‌سازی داده‌ها پشتیبانی می‌کند:</p>
                    <div class="grid gap-4">
                        <div class="p-6 border-2 rounded-2xl bg-card">
                            <h4 class="font-bold text-primary">SQLite3</h4>
                            <p class="text-sm text-muted-foreground">پیش‌فرض و مناسب برای اک��ر نصب‌ها. بدون نیاز به پیکربندی خارجی.</p>
                        </div>
                        <div class="p-6 border-2 rounded-2xl bg-card">
                            <h4 class="font-bold text-blue-600">PostgreSQL</h4>
                            <p class="text-sm text-muted-foreground">توصیه شده برای سرورهایی ب�� بیش از ۱۰۰۰۰ کاربر فعال.</p>
                        </div>
                    </div>
                </article>
            `;
        } else if (sub === 'custom') {
            content = `
                <article class="space-y-6">
                    <h2 class="text-3xl font-black">سفارشی‌سازی ظاهر</h2>
                    <p>شما می‌توانید رابط کاربری وب را کاملاً تغییر دهید. MadMail به دنبال فایل‌های HTML در پوشه <code>static</code> می‌گردد.</p>
                    <div class="p-6 bg-muted/30 border-2 border-dashed rounded-3xl">
                        <p class="text-sm font-medium">نکته برای توسعه‌دهندگان:</p>
                        <p class="text-xs text-muted-foreground mt-2 leading-relaxed">این پروژه از یک SPA با Vanilla JS استفاده می‌کند. تمامی داده‌های سرور در <code>window.__data__</code> تزریق می‌شوند.</p>
                    </div>
                </article>
            `;
        } else {
            content = `
                <div class="text-center py-10 space-y-4">
                    <h2 class="text-4xl font-black">مستندات MadMail</h2>
                    <p class="text-xl text-muted-foreground">برای شروع مطالعه، یکی از بخش‌های منوی بالا را انتخاب کنید.</p>
                </div>
            `;
        }
        return `<div class="max-w-4xl mx-auto animate-fade-in">${docsNav}${content}</div>`;
    },
    Contact: (contact) => `
        <div class="max-w-xl mx-auto space-y-10 animate-fade-in text-center">
            <div class="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-black mx-auto shadow-2xl">
                ${contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div class="space-y-2">
                <h1 class="text-3xl font-black">${contact.name || 'کاربر ناشناس'}</h1>
                <p class="text-muted-foreground">می‌خواهید با این شخص در DeltaChat گفتگو کنید؟</p>
            </div>
            <button onclick="tryOpenProtocol('${contact.url}')" class="block w-full py-5 bg-primary text-white rounded-2xl font-bold text-xl shadow-xl hover:scale-[1.02] transition-transform active:scale-[0.98]">باز کردن در DeltaChat</button>
            <div class="p-6 bg-muted/50 rounded-2xl border border-dashed space-y-3">
                <p class="text-xs text-muted-foreground uppercase font-bold tracking-widest">لینک مستقیم دعوت</p>
                <code class="block text-xs font-mono break-all bg-background p-3 rounded-lg border" dir="ltr">${contact.url}</code>
                <button onclick="copyToClipboard('${contact.url}')" class="text-primary font-bold hover:underline">کپی ��ینک</button>
            </div>
        </div>
    `,
    NotFound: () => `
        <div class="py-20 text-center animate-fade-in space-y-6">
            <h1 class="text-9xl font-black text-primary/20">۴۰۴</h1>
            <p class="text-2xl font-bold text-muted-foreground">متأسفانه صفحه مورد نظر یافت نشد.</p>
            <a href="/" data-link class="inline-block px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:shadow-primary/20 transition-all">بازگشت به خانه</a>
        </div>
    `
};
// --- ROUTER ---
function navigate(path) {
    window.history.pushState({}, "", path);
    handleRoute();
}
async function handleRoute() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    app.innerHTML = '<div class="flex items-center justify-center py-20"><div class="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div></div>';
    let viewHTML = '';
    const route = segments[0] || 'home';
    try {
        if (route === 'home') {
            viewHTML = Views.Home();
        } else if (route === 'share') {
            viewHTML = Views.Share();
        } else if (route === 'deploy') {
            viewHTML = Views.Deploy();
        } else if (route === 'info') {
            viewHTML = Views.Info();
        } else if (route === 'security') {
            viewHTML = Views.Security();
        } else if (route === 'docs') {
            viewHTML = Views.Docs(segments[1]);
        } else if (segments.length === 1) {
            const slug = segments[0];
            const reserved = ['api', 'docs', 'info', 'share', 'security', 'deploy', 'health'];
            if (reserved.includes(slug)) {
                viewHTML = Views.NotFound();
            } else {
                try {
                    const contact = await apiFetch(`/api/contact/${slug}`);
                    viewHTML = Views.Contact(contact);
                } catch { viewHTML = Views.NotFound(); }
            }
        } else {
            viewHTML = Views.NotFound();
        }
    } catch (e) {
        viewHTML = Views.NotFound();
    }
    app.innerHTML = viewHTML;
    // Update active state for all links (Desktop, Mobile, Docs)
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        // Handle precise matching or prefix matching for docs
        const isActive = (href === path) || 
                         (href === '/' && (path === '/' || path === '/home')) ||
                         (href !== '/' && path.startsWith(href) && href.includes('/docs'));
        link.classList.toggle('text-primary', isActive);
        link.classList.toggle('bg-accent/50', isActive);
        if (link.tagName === 'A' && isActive) link.classList.add('active');
    });
    if (path === '/' || path === '/home') initHomeLogic();
    if (path === '/share') initShareLogic();
}
// --- LOGIC: HOME ---
function initHomeLogic() {
    const btn = document.getElementById('create-acc-btn');
    if (!btn) return;
    btn.onclick = async () => {
        btn.disabled = true;
        btn.innerHTML = '<div class="flex items-center justify-center gap-2"><div class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div><span>درحال ساخت...</span></div>';
        try {
            let creds;
            if (config.jitEnabled) {
                await new Promise(r => setTimeout(r, 800));
                const user = generateRandomString(8);
                const pass = generateRandomString(12);
                creds = { email: `${user}@${config.mailDomain}`, pass };
            } else {
                const account = await apiFetch('/new', { method: 'POST', body: JSON.stringify({ name: 'کاربر جدید' }) });
                creds = { email: account.email, pass: account.password };
            }
            const dcLink = `dclogin:${creds.email}?password=${creds.pass}&ssl=${config.turnOffTLS ? 0 : 1}`;
            document.getElementById('cta-card').classList.add('hidden');
            const success = document.getElementById('success-view');
            success.classList.remove('hidden');
            success.innerHTML = `
                <div class="bg-card border-2 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4">
                    <canvas id="qr-canvas" class="max-w-full h-auto"></canvas>
                    <p class="text-sm font-bold text-muted-foreground mt-2">اسکن با دور��ین DeltaChat</p>
                </div>
                <div class="space-y-6">
                    <div class="space-y-2">
                        <div class="flex items-center gap-2 text-green-600 font-black text-2xl">
                            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                            حساب شما ��ماده است!
                        </div>
                        <p class="text-muted-foreground font-medium">اطلاعات ورود خود را برای استفاده در دستگاه‌های دیگر ذخیره کنید.</p>
                    </div>
                    <div class="p-6 bg-muted/50 rounded-2xl space-y-4 font-mono text-left border shadow-inner" dir="ltr">
                        <div><p class="text-xs text-muted-foreground font-sans font-bold uppercase mb-1">EMAIL</p><p class="text-lg select-all text-primary font-bold">${creds.email}</p></div>
                        <div><p class="text-xs text-muted-foreground font-sans font-bold uppercase mb-1">PASSWORD</p><p class="text-lg select-all font-bold">${creds.pass}</p></div>
                    </div>
                    <div class="flex flex-col gap-3">
                        <button id="dc-open-btn" class="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform active:scale-[0.98]">ورود مستقیم به DeltaChat</button>
                        <button id="copy-all-btn" class="w-full py-2 text-muted-foreground hover:text-foreground font-bold transition-colors">کپی تمامی اطلاعات</button>
                    </div>
                </div>
            `;
            new QRious({ element: document.getElementById('qr-canvas'), value: dcLink, size: 280, level: 'H' });
            document.getElementById('dc-open-btn').onclick = async () => {
                const opened = await tryOpenProtocol(dcLink);
                if (!opened) showToast('DeltaChat باز نشد. مطمئن شوید برنامه نصب است.', 'error');
            };
            document.getElementById('copy-all-btn').onclick = () => copyToClipboard(`Email: ${creds.email}\nPass: ${creds.pass}`);
        } catch (err) {
            showToast('خطا در ایجاد حساب. لطفاً دوباره تلاش کنید.', 'error');
            btn.disabled = false;
            btn.innerHTML = 'تلاش دوباره';
        }
    };
}
// --- LOGIC: SHARE ---
function initShareLogic() {
    const form = document.getElementById('share-form');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('share-submit-btn');
        const name = document.getElementById('share-name').value;
        const url = document.getElementById('share-url').value;
        if (!url.startsWith('https://i.delta.chat/#')) {
            showToast('لینک دعوت DeltaChat نامعتبر ��ست', 'error');
            return;
        }
        btn.disabled = true;
        btn.innerHTML = '<div class="flex items-center justify-center gap-2"><div class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div><span>درحال ایجاد...</span></div>';
        try {
            const res = await apiFetch('/api/share', { method: 'POST', body: JSON.stringify({ name, url }) });
            const shareUrl = `${window.location.origin}/${res.slug}`;
            document.getElementById('share-form-container').innerHTML = `
                <div class="text-center space-y-6 animate-fade-in py-6">
                    <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div class="space-y-2">
                        <h3 class="text-2xl font-black">لینک شما ساخته شد!</h3>
                        <p class="text-muted-foreground">این لینک را برای دوستا�� خود بفرستید تا با شما در تماس باشند.</p>
                    </div>
                    <div class="p-6 bg-muted/50 rounded-2xl border flex items-center gap-4 shadow-inner">
                        <code class="text-primary font-black flex-1 truncate text-left" dir="ltr">${shareUrl}</code>
                        <button onclick="copyToClipboard('${shareUrl}')" class="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-transform">کپی</button>
                    </div>
                    <button onclick="window.location.reload()" class="w-full py-4 border-2 rounded-2xl hover:bg-accent font-bold transition-all">ساخت لینک جدید</button>
                </div>
            `;
            showToast('لینک با موفقیت ساخته شد', 'success');
        } catch (err) {
            showToast('خطا در ساخت لینک. دوباره تلاش کنید.', 'error');
            btn.disabled = false;
            btn.innerHTML = 'تلاش دوباره';
        }
    };
}
// --- GLOBAL EVENTS ---
document.addEventListener('click', e => {
    const link = e.target.closest('[data-link]');
    if (link) {
        e.preventDefault();
        navigate(link.getAttribute('href'));
    }
});
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.onclick = () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };
}
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.onclick = () => {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
    };
}
document.getElementById('footer-year').textContent = new Date().getFullYear();
window.onpopstate = handleRoute;
window.copyToClipboard = copyToClipboard;
window.tryOpenProtocol = tryOpenProtocol;
handleRoute();