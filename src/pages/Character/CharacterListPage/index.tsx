import { Link } from 'react-router-dom';
import { useAnimeDetail } from '../../../components/layout/AnimeDetailLayout';

export const CharacterListPage: React.FC = () => {
    const { characters } = useAnimeDetail();
    
    return (
        <div className='p-5 mt-6'>
            {characters.length === 0 ? (
                <p className="text-gray-400">Nenhum personagem encontrado.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {characters.map((char) => (
                        <div key={char.character.mal_id} className="bg-[#1e2a3a] flex h-[80px] overflow-hidden ">
                            <div className="w-[48px] sm:w-[64px] h-full flex-shrink-0">
                                <img
                                    src={char.character.images?.jpg?.image_url || '/placeholder.svg'}
                                    alt={char.character.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 flex flex-col justify-between text-left pl-2 py-2 min-h-full min-w-0">
                                <Link
                                    to={`/character/${char.character.mal_id}`}
                                    className="font-semibold text-[#8BA0B2] text-[11px] sm:text-[13px] leading-tight whitespace-normal hover:text-blue-400 transition-colors"
                                >
                                    {char.character.name}
                                </Link>
                                <p className="text-gray-400 text-[10px] sm:text-[11px]">{char.role}</p>
                            </div>

                            {char.voice_actors?.length > 0 && (
                                <div className="flex h-full flex-shrink-0">
                                    <div className="flex flex-col justify-between text-right px-1 sm:px-2 py-2 min-h-full min-w-0">
                                        <Link
                                            to={`/staff/${char.voice_actors[0].person.mal_id}/${char.voice_actors[0].person.name}`}
                                            className="text-gray-300 text-[10px] hover:text-blue-400 sm:text-[13px] leading-tight whitespace-pre-line break-words max-w-[90px] sm:max-w-full"
                                        >
                                            {char.voice_actors[0].person.name.split(',').join(',\n')}
                                        </Link>
                                        <p className="text-gray-400 text-[10px] sm:text-[11px]">{char.voice_actors[0].language}</p>
                                    </div>
                                    <div className="w-[48px] sm:w-[64px] h-full flex-shrink-0">
                                        <img
                                            src={char.voice_actors[0].person.images.jpg.image_url || '/placeholder.svg'}
                                            alt={char.voice_actors[0].person.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CharacterListPage;
