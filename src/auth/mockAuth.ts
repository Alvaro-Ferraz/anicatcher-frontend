export async function loginMock(identifier: string, password: string) {
    // pequena latência para simular request
    await new Promise((r) => setTimeout(r, 500));

    if (identifier === 'yomashiro' && password === 'teste123') {
        const user = { username: 'yomashiro' };
        try {
            localStorage.setItem('anicatcher_user', JSON.stringify(user));
        } catch (e) {
            // ignore storage errors
        }
        return { ok: true, user };
    }

    const err: any = new Error('Credenciais inválidas');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
}

export function isAuthenticated() {
    try {
        return !!localStorage.getItem('anicatcher_user');
    } catch (e) {
        return false;
    }
}

export function logout() {
    try {
        localStorage.removeItem('anicatcher_user');
    } catch (e) {
        // ignore
    }
}
