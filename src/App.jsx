import { useState, useEffect } from "react";

// The add icon imporation
import { IoAddOutline } from "react-icons/io5";

// Importing the icons to use
import { FaHome, FaInfoCircle, FaHeart } from 'react-icons/fa';  // FontAwesome icons
function App() {

  // Search Bar Logic
  // useState will store the text in the search bar and update the query value
  const [query, setQuery] = useState("");

  // The list for rendering the pokemons
  const [pokemonList, setPokemonList] = useState([]);

  // The status of the web page
  const [loading, setLoading] = useState(false);

  // Fetch initial list of Pokemon on component mount
  useEffect(() => {
    const fetchInitialPokemon = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
        const data = await response.json();
        // Fetch details for each Pokemon to get images
        const detailPromises = data.results.map(pokemon => 
          fetch(pokemon.url).then(res => res.json())
        );
        const pokemonDetails = await Promise.all(detailPromises);
        setPokemonList(pokemonDetails);
      } catch (error) {
        console.error('Error fetching initial Pokemon:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialPokemon();
  }, []);

  // Fetching of the api data for search
  const fetchPokemonData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (!response.ok) {
        throw new Error("Pokemon not found");
      }
      const data = await response.json();
      setPokemonList([data]); // Replace the list with the searched Pokemon
    } catch (error) {
      console.error(error);
      setPokemonList([]); // Clear the list if there's an error
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = () => {
    // This function will be called when the search button is clicked
    console.log("Searching for:", query);
    fetchPokemonData();
  }

  return (
    <div>
      <nav>
        <a href="/">
          <FaHome />
        </a>
        <a href="/info">
          Info
        </a>
        <a href="/favourite">
          Favourite
        </a>
      </nav>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Pokemon" />
      {/* the handleSearch function will be called when the button is clicked */}
      <button onClick={handleSearch}>Search</button>
      <h1>Pokemon Universe</h1>
      <p>Delve into the world of Pokemon, learn about'em and find your favorites!</p>
      {loading && <p>Loading...</p>}
      {pokemonList.length > 0 && (
        <div>
          {pokemonList.map((pokemon) => (
            <div key={pokemon.id}>
              <h2>{pokemon.name}</h2>
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              <p>Power: {pokemon.power}</p>
              <button><IoAddOutline /></button>
              <button onClick={<info />}><FaInfoCircle /> info</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
