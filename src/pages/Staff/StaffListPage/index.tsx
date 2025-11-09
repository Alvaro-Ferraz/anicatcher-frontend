import { Link } from "react-router-dom";
import { useAnimeDetail } from "../../../components/layout/AnimeDetailLayout";

export const StaffListPage: React.FC = () => {
    const { staff } = useAnimeDetail();

    if (!staff) {
        return (
            <div className="p-5 mt-6">
                <p className="text-gray-400">Carregando staff...</p>
            </div>
        );
    }

    return (
        <div className="p-5 mt-6">
            {staff.length === 0 ? (
                <p className="text-gray-400">Nenhum membro de staff encontrado.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {staff.map((member) => (
                        <div
                            key={member.person.mal_id}
                            className="bg-[#1e2a3a] flex h-[80px] overflow-hidden "
                        >
                            <div className="w-[48px] sm:w-[64px] h-full flex-shrink-0">
                                <img
                                    src={
                                        member.person.images?.jpg?.image_url ||
                                        "/placeholder.svg"
                                    }
                                    alt={member.person.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 flex flex-col justify-between pl-2 py-2 min-h-full min-w-0">
                                <Link
                                    to={`/staff/${member.person.mal_id}/${member.person.name}`}
                                    className="font-semibold text-[#8BA0B2] text-[12px] sm:text-[14px] leading-tight hover:text-blue-400 transition-colors truncate"
                                >
                                    {member.person.name.split(',').join(',\n')}
                                </Link>
                                <p className="text-gray-400 text-[10px] sm:text-[12px] truncate">
                                    {member.positions?.join(", ") || "Sem função definida"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaffListPage;
