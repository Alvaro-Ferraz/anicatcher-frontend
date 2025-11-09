import Winter from '../../assets/images/Winter-banner.jpg';
import Springs from '../../assets/images/Springs-banner.jpg';
import Fall from '../../assets/images/Fall-banner.jpg';
import Summer from '../../assets/images/Summer-banner.jpg';

const getTemporadaAtual = () => {
  const hoje = new Date();
  const mes = hoje.getMonth() + 1;

  if (mes >= 1 && mes <= 3) {
    return { imagem: Winter, nome: 'Inverno' };
  } else if (mes >= 4 && mes <= 6) {
    return { imagem: Springs, nome: 'Primavera' };
  } else if (mes >= 7 && mes <= 9) {
    return { imagem: Summer, nome: 'Verão' };
  } else {
    return { imagem: Fall, nome: 'Outono' };
  }
};

const TemporadaAtual = () => {
  const { imagem, nome } = getTemporadaAtual();

  return (
    <div className="w-full h-24 mt-5 mb-5 rounded-lg overflow-hidden">
      <img
        src={imagem}
        alt={`Temporada de ${nome}`}
        className="w-full h-full object-cover object-center"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          const imgElement = e.target;
          const siblingElement = (imgElement as HTMLImageElement).parentElement?.querySelector('div');
          if (siblingElement) {
            siblingElement.style.display = 'block';
          }
        }}
      />
      <div
        className="w-full h-full bg-gray-100 flex items-center justify-center text-center text-gray-700 font-semibold text-sm"
        style={{ display: 'none' }}
      >
        Temporada de {nome}
      </div>
    </div>
  );
};

export default TemporadaAtual;