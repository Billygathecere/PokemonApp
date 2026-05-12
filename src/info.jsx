import React from 'react';
import { FaHeart} from 'react-icons/fa';  // FontAwesome icons

function PokemonCard({ pokemon }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '8px' }}>
      <h2>{pokemon.name}</h2>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <h3>Power: {pokemon.power || 'N/A'}</h3>  {/* Add more details if needed */}

      <button style={{ marginRight: '5px' }}><FaHeart /></button>
      <span>
        type: {pokemon.types ? pokemon.types.map(t => t.type.name).join(', ') : 'N/A'}

      </span>
      <p>
        {pokemon.description || 'No description available.'}
      </p>
    </div>
  );
}

export default PokemonCard;