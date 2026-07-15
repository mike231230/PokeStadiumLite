const PokemonCard = ({ pokemon, isOpponent }) => {
    if (!pokemon) return null;

    // Calculamos el porcentaje de vida para cambiar el color de la barra
    const hpPercentage = (pokemon.currentHp / pokemon.maxHp) * 100;


    let barColor = "progress-success"; // Verde
    if (hpPercentage < 50) barColor = "progress-warning"; // Amarillo
    if (hpPercentage < 20) barColor = "progress-error"; // Rojo

    return (
        <div className={`flex flex-col ${isOpponent ? 'items-end' : 'items-start'} w-1/2 p-4`}>
            <div className="card bg-base-100 shadow-md border border-gray-200 p-4 w-64">

                {/* Nombre y HP numérico */}
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg uppercase">{pokemon.name}</h3>
                    <span className="text-sm font-semibold text-gray-500">
            {pokemon.currentHp} / {pokemon.maxHp} HP
          </span>
                </div>

                {/* Barra de vida de DaisyUI */}
                <progress
                    className={`progress ${barColor} w-full h-3`}
                    value={pokemon.currentHp}
                    max={pokemon.maxHp}
                ></progress>

                {/* Estadísticas base */}
                <div className="text-xs text-gray-400 mt-2 flex justify-between">
                    <span>ATK: {pokemon.attack}</span>
                    <span>DEF: {pokemon.defense}</span>
                </div>
            </div>

            {/* Sprite del Pokémon */}
            <img
                src={pokemon.sprite}
                alt={pokemon.name}
                className={`h-40 w-40 object-contain mt-4 ${isOpponent ? '' : 'transform scale-x-[-1]'}`}
            />
        </div>
    );
};

export default PokemonCard