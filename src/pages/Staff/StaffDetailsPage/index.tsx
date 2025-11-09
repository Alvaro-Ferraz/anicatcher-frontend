import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ClientLayout from "../../../components/layout/ClientLayout";
import CharacterCardGrid from "../../../components/CharacterCardGrid";
import WorkCardGrid from "../../../components/WorkCardGrid";

type AnimeData = {
    mal_id: number;
    title: string;
    images?: { jpg?: { image_url?: string; small_image_url?: string; large_image_url?: string } };
};

type CharacterData = {
    role: string;
    anime: AnimeData;
    character: { mal_id: number; name: string; images?: { jpg?: { image_url?: string; small_image_url?: string } } };
};

type StaffFullData = {
    given_name: any;
    family_name: any;
    alternate_names?: string[];
    mal_id: number;
    name: string;
    birthday?: string;
    favorites?: number;
    about?: string;
    images?: { jpg?: { image_url?: string } };
    url?: string;
    website_url?: string;
    twitter_username?: string;
    external_links?: { url?: string; name?: string }[];
    anime: { position?: string; anime: AnimeData }[];
    manga: { position?: string; manga: AnimeData }[];
    voices: CharacterData[];
};

export const StaffDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [staff, setStaff] = useState<StaffFullData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [voices, setVoices] = useState<CharacterData[]>([]);
    const [hasMoreVoices, setHasMoreVoices] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                setLoading(true);
                setPage(1);
                setVoices([]);
                const res = await axios.get(`https://api.jikan.moe/v4/people/${id}/full`);
                const staffData = res.data.data;
                setStaff(staffData);
                const initialVoices = staffData.voices.slice(0, ITEMS_PER_PAGE);
                setVoices(initialVoices);
                setHasMoreVoices(staffData.voices.length > ITEMS_PER_PAGE);
            } catch (err) {
                setError("Não foi possível carregar os detalhes do staff.");
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, [id]);

    // Constrói lista de links a partir dos campos disponíveis no objeto staff
    const buildStaffLinks = (s: Partial<StaffFullData>) => {
        const links: { label: string; url: string }[] = [];
        const pushIfValid = (label: string, url?: string | null) => {
            try {
                if (!url) return;
                const u = new URL(url);
                if (!u.href) return;
                // evitar duplicatas por URL
                if (!links.find(l => l.url === u.href)) links.push({ label, url: u.href });
            } catch (e) {
                // tenta prefixar com https:// se for apenas um username ou falta o esquema
                if (typeof url === 'string' && /^https?:\/\//.test(url) === false) {
                    try {
                        const u2 = new URL('https://' + url);
                        if (!links.find(l => l.url === u2.href)) links.push({ label, url: u2.href });
                    } catch (_) { }
                }
            }
        };

        // link MAL/profile
        pushIfValid('Profile', s.url || undefined);

        // external_links (vários tipos: Twitter, Instagram, Official Site, etc.)
        if (s.external_links && Array.isArray(s.external_links)) {
            s.external_links.forEach(el => {
                if (!el) return;
                const name = el.name || guessLabelFromUrl(el.url);
                pushIfValid(name || 'Link', el.url);
            });
        }

        // twitter username -> monta link conhecido
        if ((s as any).twitter_username) {
            const tw = (s as any).twitter_username as string;
            // se já houver link pro twitter, evita duplicata
            if (!links.find(l => l.label.toLowerCase() === 'twitter' || l.url.includes('twitter.com'))) {
                pushIfValid('Twitter', tw.startsWith('http') ? tw : `https://twitter.com/${tw.replace(/^@/, '')}`);
            }
        }

        // website_url (campo comum em algumas respostas)
        pushIfValid('Website', s.website_url as string | undefined);

        return links;
    };

    const guessLabelFromUrl = (url?: string) => {
        if (!url) return undefined;
        try {
            const u = new URL(url);
            const host = u.hostname.replace(/^www\./, '');
            // mapeamentos simples
            if (host.includes('twitter.com')) return 'Twitter';
            if (host.includes('instagram.com')) return 'Instagram';
            if (host.includes('facebook.com')) return 'Facebook';
            return host;
        } catch (e) {
            return undefined;
        }
    };

    // Função para carregar mais voices
    const loadMoreVoices = useCallback(() => {
        if (!staff || isLoadingMore || !hasMoreVoices) return;

        setIsLoadingMore(true);
        const nextPage = page + 1;
        const start = page * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;

        // Simula delay para evitar rate limit da API
        setTimeout(() => {
            const newVoices = staff.voices.slice(start, end);
            setVoices(prev => [...prev, ...newVoices]);
            setPage(nextPage);
            setHasMoreVoices(end < staff.voices.length);
            setIsLoadingMore(false);
        }, 500);
    }, [staff, page, isLoadingMore, hasMoreVoices]);



    if (loading) return <ClientLayout><div className="text-center mt-10 text-gray-400">Carregando...</div></ClientLayout>;
    if (error) return <ClientLayout><div className="text-center mt-10 text-red-400">{error}</div></ClientLayout>;

    if (!staff) return (
        <ClientLayout>
            <div className="p-5 mt-6 text-gray-400">Staff não encontrado.</div>
        </ClientLayout>
    );;

    return (
        <ClientLayout>
            <div className="p-5 mt-6">
                <header className="mb-8 bg-[#0f1a24] rounded p-6 relative">
                    <div className="absolute right-6 top-6">
                        <button className="bg-[#e11d48] text-white px-3 py-2 rounded-lg shadow-md flex items-center gap-2">
                            <span className="font-semibold">❤</span>
                            <span className="text-sm">{`${staff.favorites}`}</span>
                        </button>
                    </div>

                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-6">
                        <div className="flex-shrink-0">
                            <img
                                src={staff.images?.jpg?.image_url || "/placeholder.svg"}
                                alt={staff.name}
                                className="w-[200px] h-[280px] md:w-[220px] md:h-[320px] rounded shadow-lg object-cover"
                            />
                        </div>

                        <div className="flex-1 text-left text-gray-200">
                            <h1 className="text-2xl font-bold text-[#8BA0B2] mb-2">{staff.name}</h1>
                            <div className="flex gap-1">
                                <p className="text-[#7ea6bf] mb-4">{`${staff.given_name}`}</p>
                                <p className="text-[#7ea6bf] mb-4">{`${staff.family_name}`}</p>
                                <p className="text-[#7ea6bf] mb-4">{`${staff.alternate_names}`}</p>
                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300 mb-4">
                                <div>
                                    <div><span className="font-semibold text-gray-200">Birth:</span> {staff.birthday || 'Unknown'}</div>
                                    <div><span className="font-semibold text-gray-200">Favorites:</span> {staff.favorites ?? 0}</div>
                                </div>
                            </div>

                            <div className="mb-3">
                                {(() => {
                                    const staffLinks = buildStaffLinks(staff);
                                    if (!staffLinks || staffLinks.length === 0) return null;
                                    return (
                                        <div className="flex flex-wrap gap-2">
                                            {staffLinks.map((l) => (
                                                <a
                                                    key={l.url}
                                                    className="text-sm text-blue-400 mr-3 break-words"
                                                    href={l.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {l.label}
                                                </a>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>

                            <p className="text-gray-400 max-w-3xl">{staff.about || 'Descrição não disponível.'}</p>
                        </div>
                    </div>
                </header>

                {staff.voices && staff.voices.length > 0 && (
                    <div className="mb-8">
                        <CharacterCardGrid
                            title={"Voices"}
                            characters={voices.map(v => ({
                                character: {
                                    mal_id: v.character.mal_id,
                                    name: v.character.name,
                                    images: v.character.images
                                },
                                role: v.role,
                                anime: v.anime
                            }))}
                            isLoading={loading}
                            isLoadingMore={isLoadingMore}
                            hasMore={hasMoreVoices}
                            onLoadMore={loadMoreVoices}
                            columns={6}
                        />
                    </div>
                )}

                {staff.anime.length > 0 && (
                    <div className="mb-8">
                        <WorkCardGrid
                            title="ANIME STAFF ROLES"
                            animes={Array.from(new Map(staff.anime.map(m => [m.anime.mal_id, m.anime])).values()).map(a => ({
                                mal_id: a.mal_id,
                                title: a.title,
                                images: a.images,
                                subtitle: staff.anime.find(s => s.anime.mal_id === a.mal_id)?.position || ''
                            }))}
                        />
                    </div>
                )}

                {staff.manga.length > 0 && (
                    <div className="mb-8">
                        <WorkCardGrid
                            title="MANGAS"
                            animes={Array.from(new Map(staff.manga.map(m => [m.manga.mal_id, m.manga])).values()).map(a => ({
                                mal_id: a.mal_id,
                                title: a.title,
                                images: a.images,
                                subtitle: staff.manga.find(s => s.manga.mal_id === a.mal_id)?.position || ''
                            }))}
                        />
                    </div>
                )}
            </div>
        </ClientLayout>
    );
};

export default StaffDetailsPage;
