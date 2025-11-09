import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ClientLayout from "../../../components/layout/ClientLayout";
import axios from "axios";
import AnimeCardGrid from "../../../components/AnimeCardGrid";
import StaffCardGrid from "../../../components/StaffCardGrid";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export const CharacterDetailsPage = () => {
    const { id } = useParams();
    const [character, setCharacter] = useState<any>(null);
    const [pictures, setPictures] = useState<any[]>([]);
    const [showGallery, setShowGallery] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showFullAbout, setShowFullAbout] = useState(false);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const [charRes, picRes] = await Promise.all([
                    axios.get(`https://api.jikan.moe/v4/characters/${id}/full`),
                    axios.get(`https://api.jikan.moe/v4/characters/${id}/pictures`),
                ]);
                setCharacter(charRes.data.data);
                setPictures(picRes.data.data || []);
            } catch (error) {
                console.error("Erro ao carregar personagem:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacter();
    }, [id]);

    if (loading) {
        return (
            <ClientLayout>
                <div className="p-5 mt-6 text-gray-400">Carregando detalhes...</div>
            </ClientLayout>
        );
    }

    if (!character) {
        return (
            <ClientLayout>
                <div className="p-5 mt-6 text-gray-400">Personagem não encontrado.</div>
            </ClientLayout>
        );
    }

    const aboutText = character.about || "";
    const extractInfo = (label: string) => {
        const regex = new RegExp(`${label}: ([^\\n]*)`, "i");
        const match = aboutText.match(regex);
        return match ? match[1].trim() : null;
    };



    const info = {
        age: extractInfo("Age"),
        birthday: extractInfo("Birthday"),
        bloodType: extractInfo("Blood type"),
        height: extractInfo("Height"),
        weight: extractInfo("Weight"),
        favoriteFood: extractInfo("Favorite food"),
    };

    const animeList = (character.anime || []).map((a: any) => ({
        mal_id: a.anime.mal_id,
        title: a.anime.title,
        images: { jpg: { large_image_url: a.anime.images?.jpg?.image_url } },
    }));

    const mangaList = (character.manga || []).map((m: any) => ({
        mal_id: m.manga.mal_id,
        title: m.manga.title,
        images: { jpg: { large_image_url: m.manga.images?.jpg?.image_url } },
    }));

    return (
        <ClientLayout>
            <div className="p-5 mt-6">
                <div className="flex justify-center p-5">
                    <div className="max-w-6xl w-full">
                        <div className="relative bg-transparent mb-10">
                            <div className="md:flex md:items-start md:gap-8">
                                <div className="flex justify-center flex-shrink-0 md:flex md:justify-center md:flex-shrink-0">
                                    <img
                                        src={character.images?.jpg?.image_url || '/placeholder.svg'}
                                        alt={character.name}
                                        className="w-[230px] h-[358px] md:w-[230px] md:h-[358px] rounded shadow-lg object-cover bg-gray-800"
                                    />
                                </div>

                                <div className="flex flex-col md:flex-1 md:relative">
                                    <div className="flex flex-col items-center text-center md:flex-row md:items-start md:justify-between md:text-start">
                                        <div className="flex flex-col mt-2 md:mt-2">
                                            <h1 className="text-3xl font-bold text-[#8BA0B2] mb-2">
                                                {character.name}
                                            </h1>

                                            <p className="text-[#7ea6bf] mb-2">
                                                {character.name_kanji ? character.name_kanji : ''}
                                                {character.nicknames?.length ? `, ${character.nicknames.join(', ')}` : ''}
                                            </p>

                                            {/* FAVORITOS - aparece abaixo no mobile */}
                                            <div className="flex justify-center mt-2 md:hidden">
                                                <div className="bg-rose-600 text-white rounded-md px-3 py-2 font-semibold flex items-center gap-2">
                                                    <span>❤</span>
                                                    <span>{character.favorites ?? 0}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* FAVORITOS - aparece à direita no desktop */}
                                        <div className="hidden md:flex items-center justify-center mt-2 md:ml-4">
                                            <div className="bg-rose-600 text-white rounded-md px-3 py-2 font-semibold flex items-center gap-2">
                                                <span>❤</span>
                                                <span>{character.favorites ?? 0}</span>
                                            </div>
                                        </div>
                                    </div>


                                    <dl className="grid grid-cols-1 sm:grid-cols-1 gap-x-8 gap-y-2 text-sm text-gray-600 mt-4">
                                        {info.birthday && (
                                            <div>
                                                <dt className="font-semibold text-[#8BA0B2]">Birthday</dt>
                                                <dd className="text-[#9FADBD]">{info.birthday}</dd>
                                            </div>
                                        )}
                                        {info.age && (
                                            <div>
                                                <dt className="font-semibold text-[#8BA0B2]">Age</dt>
                                                <dd className="text-[#9FADBD]">{info.age}</dd>
                                            </div>
                                        )}
                                        {info.height && (
                                            <div>
                                                <dt className="font-semibold text-[#8BA0B2]">Height</dt>
                                                <dd className="text-[#9FADBD]">{info.height}</dd>
                                            </div>
                                        )}
                                        {info.weight && (
                                            <div>
                                                <dt className="font-semibold text-[#8BA0B2]">weight</dt>
                                                <dd className="text-[#9FADBD]">{info.weight}</dd>
                                            </div>
                                        )}
                                        {(info.bloodType || info.bloodType === '') && (
                                            <div>
                                                <dt className="font-semibold text-[#8BA0B2]">Blood Type</dt>
                                                <dd className="text-[#9FADBD]">{info.bloodType ?? 'Unknown'}</dd>
                                            </div>
                                        )}
                                        {(info.favoriteFood || info.favoriteFood === '') && (
                                            <div>
                                                <dt className="font-semibold text-[#8BA0B2]">Favorite Food</dt>
                                                <dd className="text-[#9FADBD]">{info.favoriteFood ?? 'Unknown'}</dd>
                                            </div>
                                        )}
                                        <div className="mt-6 text-gray-400 text-sm leading-relaxed">
                                            {character.about ? (
                                                <>
                                                    {(() => {
                                                        const maxLength = 300;
                                                        const isLong = character.about.length > maxLength;
                                                        const displayed = !isLong ? character.about : (showFullAbout ? character.about : character.about.substring(0, maxLength) + '...');
                                                        return (
                                                            <>
                                                                <p className="mb-4">{displayed}</p>
                                                                {isLong && (
                                                                    <div className="text-center">
                                                                        <button
                                                                            onClick={() => setShowFullAbout((s) => !s)}
                                                                            className="text-blue-500 font-semibold ml-1 hover:underline"
                                                                        >
                                                                            {showFullAbout ? 'Read Less' : 'Read More'}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </>
                                            ) : (
                                                <p className="text-gray-500">Descrição não disponível.</p>
                                            )}
                                        </div>
                                    </dl>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="mt-6 mb-10">
                    {pictures && pictures.length > 0 ? (
                        <>
                            <button
                                onClick={() => setShowGallery(!showGallery)}
                                className="flex items-center gap-2 text-[#ADC0D2] font-semibold text-lg hover:text-white transition"
                            >
                                {showGallery ? (
                                    <>
                                        Close Gallery <FaChevronUp />
                                    </>
                                ) : (
                                    <>
                                        See Gallery <FaChevronDown />
                                    </>
                                )}
                            </button>

                            {showGallery && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                                    {pictures.map((pic, idx) => (
                                        <div key={idx} className="relative group cursor-pointer">
                                            <img
                                                key={idx}
                                                src={pic.jpg.image_url}
                                                alt={`Character image ${idx}`}
                                                className="w-[180px] h-[260px] md:w-[250px] md:h-[370px] rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer object-cover bg-gray-800"
                                                onClick={() => setSelectedImage(pic.jpg.image_url)}
                                            />
                                            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-90 transition-opacity ">
                                                Ver imagem completa
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-gray-500">Nenhuma imagem disponível.</div>
                    )}
                    {selectedImage && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 "
                            onClick={() => setSelectedImage(null)}
                        >
                            <img
                                src={selectedImage}
                                alt="Imagem completa do personagem"
                                className="max-h-full max-w-full rounded-lg shadow-lg"
                            />
                        </div>
                    )}
                </div>

                {animeList.length > 0 && (
                    <div className="mt-10">
                        <AnimeCardGrid
                            title="Animes"
                            animes={animeList}
                            columns={5}
                            showViewAll={false}
                            isLoading={loading}
                        />
                    </div>
                )}

                {mangaList.length > 0 && (
                    <div className="mt-10">
                        <AnimeCardGrid
                            title="Mangás/Light Novels"
                            animes={mangaList}
                            columns={5}
                            showViewAll={false}
                            isLoading={loading}
                        />
                    </div>
                )}

                {character.voices && character.voices.length > 0 && (
                    <div className="mt-10 px-5">
                        <StaffCardGrid
                            title={"Voices"}
                            staffs={character.voices.map((v: any) => ({
                                person: {
                                    mal_id: v.person.mal_id,
                                    name: v.person.name,
                                    images: v.person.images,
                                },
                                language: v.language,
                            }))}
                            columns={6}
                            isLoading={loading}
                        />
                    </div>
                )}
            </div>
        </ClientLayout>
    );
};

export default CharacterDetailsPage;
