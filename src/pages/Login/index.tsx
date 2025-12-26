
import React, { useState } from 'react';
import { z } from 'zod';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginMock } from '../../auth/mockAuth';

const LoginSchema = z.object({
    identifier: z.string().min(3, 'Informe seu usuário ou e-mail.'),
    password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres.'),
    remember: z.boolean().optional(),
});

type LoginData = z.infer<typeof LoginSchema>;

const LoginForm: React.FC = () => {
    const [form, setForm] = useState<LoginData>({ identifier: '', password: '', remember: false });
    const [errors, setErrors] = useState<Partial<Record<keyof LoginData, string>>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Register state + schema
    const [isRegister, setIsRegister] = useState(false);
    const RegisterSchema = z.object({
        name: z.string().min(2, 'Informe seu nome.'),
        email: z.string().email('E-mail inválido.'),
        password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres.'),
        confirmPassword: z.string().min(6, 'Confirme a senha.'),
        agree: z.boolean().refine((v) => v === true, 'Você deve aceitar os termos.'),
    }).superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['confirmPassword'], message: 'As senhas não coincidem.' });
        }
    });

    type RegisterData = z.infer<typeof RegisterSchema>;
    const [regForm, setRegForm] = useState<RegisterData>({ name: '', email: '', password: '', confirmPassword: '', agree: false });
    const [regErrors, setRegErrors] = useState<Partial<Record<keyof RegisterData, string>>>({});

    const onChange = (k: keyof LoginData, v: any) => {
        setForm((s) => ({ ...s, [k]: v }));
        setErrors((e) => ({ ...e, [k]: undefined }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setErrors({});
        setSuccess(null);

        const parsed = LoginSchema.safeParse(form);
        if (!parsed.success) {
            const zErrors: Partial<Record<keyof LoginData, string>> = {};
            parsed.error.issues.forEach((issue) => {
                const path = issue.path[0] as keyof LoginData | undefined;
                if (path) zErrors[path] = issue.message;
            });
            setErrors(zErrors);
            return;
        }

        setLoading(true);
        try {
            await loginMock(parsed.data.identifier, parsed.data.password);
            setSuccess('Login realizado com sucesso.');
            // redireciona para a página de ativação por voz
            navigate('/voice-start');
        } catch (err) {
            setErrors({ identifier: 'Erro ao autenticar. Verifique suas credenciais.' });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setRegErrors({});
        setSuccess(null);

        const parsed = RegisterSchema.safeParse(regForm);
        if (!parsed.success) {
            const zErrors: Partial<Record<keyof RegisterData, string>> = {};
            parsed.error.issues.forEach((issue) => {
                const path = issue.path[0] as keyof RegisterData | undefined;
                if (path) zErrors[path] = issue.message;
            });
            setRegErrors(zErrors);
            return;
        }

        setLoading(true);
        try {
            await axios.post('/api/auth/register', parsed.data);
            setSuccess('Registro realizado com sucesso. Verifique seu e-mail.');
            setIsRegister(false);
        } catch (err) {
            setRegErrors({ email: 'Erro ao registrar. E-mail pode já estar em uso.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md mx-4">
                <div className="bg-[#0d121d] p-6 shadow-2xl">
                    <h1 className="text-2xl font-light text-white mb-6">Log in <span className="text-[#bfe7ff]">_.:</span></h1>

                    <div>
                        <div className="flex gap-3 mb-4">
                            <button type="button" onClick={() => setIsRegister(false)} className={`px-3 py-1.5 text-sm ${!isRegister ? 'bg-white/10 text-white' : 'text-white/80'}`}>
                                Login
                            </button>
                            <button type="button" onClick={() => setIsRegister(true)} className={`px-3 py-1.5 text-sm ${isRegister ? 'bg-white/10 text-white' : 'text-white/80'}`}>
                                Register
                            </button>
                        </div>

                        {isRegister ? (
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div>
                                    <label className="text-white text-sm font-medium mb-1 block">Nome</label>
                                    <input
                                        value={regForm.name}
                                        onChange={(ev) => setRegForm((s) => ({ ...s, name: ev.target.value }))}
                                        type="text"
                                        className="w-full px-3 py-2 bg-utils text-slate-400 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        placeholder="Seu nome"
                                    />
                                    {regErrors.name && <p className="mt-2 text-sm text-rose-400">{regErrors.name}</p>}
                                </div>

                                <div>
                                    <label className="text-white text-sm font-medium mb-1 block">E-mail</label>
                                    <input
                                        value={regForm.email}
                                        onChange={(ev) => setRegForm((s) => ({ ...s, email: ev.target.value }))}
                                        type="email"
                                        className="w-full px-3 py-2 bg-utils text-slate-400 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        placeholder="seu@email.com"
                                    />
                                    {regErrors.email && <p className="mt-2 text-sm text-rose-400">{regErrors.email}</p>}
                                </div>

                                <div>
                                    <label className="text-white text-sm font-medium mb-1 block">Senha</label>
                                    <div className="relative">
                                        <input
                                            value={regForm.password}
                                            onChange={(ev) => setRegForm((s) => ({ ...s, password: ev.target.value }))}
                                            type={showPassword ? 'text' : 'password'}
                                            className="w-full px-3 py-2 bg-utils text-slate-400 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 pr-10"
                                            placeholder="Sua senha"
                                        />
                                        <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {regErrors.password && <p className="mt-2 text-sm text-rose-400">{regErrors.password}</p>}
                                </div>

                                <div>
                                    <label className="text-white text-sm font-medium mb-1 block">Confirmar senha</label>
                                    <input
                                        value={regForm.confirmPassword}
                                        onChange={(ev) => setRegForm((s) => ({ ...s, confirmPassword: ev.target.value }))}
                                        type={showPassword ? 'text' : 'password'}
                                        className="w-full px-3 py-2 bg-utils text-slate-400 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        placeholder="Repita a senha"
                                    />
                                    {regErrors.confirmPassword && <p className="mt-2 text-sm text-rose-400">{regErrors.confirmPassword}</p>}
                                </div>

                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={regForm.agree} onChange={(e) => setRegForm((s) => ({ ...s, agree: e.target.checked }))} className="accent-[#2c9bd1]" />
                                    <span className="text-white/90 text-sm">Eu aceito os termos</span>
                                </div>

                                <div>
                                    <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#18a0d6] to-[#2cc0e6] px-3 py-2 text-white text-sm font-semibold shadow">
                                        {loading ? 'Registrando...' : 'Registrar'}
                                    </button>
                                    {success && <p className="mt-2 text-sm text-emerald-300">{success}</p>}
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-white text-sm font-medium mb-1 block">:account</label>
                                    <input
                                        value={form.identifier}
                                        onChange={(ev) => onChange('identifier', ev.target.value)}
                                        type="text"
                                        className="w-full px-3 py-2 bg-utils text-white text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        placeholder="you@email.com"
                                    />
                                    {errors.identifier && <p className="mt-2 text-sm text-rose-400">{errors.identifier}</p>}
                                </div>

                                <div>
                                    <label className="text-white text-sm font-medium mb-1 block">:password</label>
                                    <div className="relative">
                                        <input
                                            value={form.password}
                                            onChange={(ev) => onChange('password', ev.target.value)}
                                            type={showPassword ? 'text' : 'password'}
                                            className="w-full px-3 py-2 bg-utils text-white text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 pr-10"
                                            placeholder="Password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((s) => !s)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                                            aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-2 text-sm text-rose-400">{errors.password}</p>}
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="inline-flex items-center gap-2 text-white/90 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={!!form.remember}
                                            onChange={(e) => onChange('remember', e.target.checked)}
                                            className="accent-[#2c9bd1]"
                                        />
                                        Remember-me
                                    </label>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#18a0d6] to-[#2cc0e6] px-3 py-2 text-white text-sm font-semibold shadow"
                                    >
                                        {loading ? 'loading...' : 'Login'}
                                    </button>
                                    {success && <p className="mt-2 text-sm text-emerald-300">{success}</p>}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;