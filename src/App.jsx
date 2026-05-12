import { useState, useEffect } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import { FaHeart, FaPlus, FaMinus } from "react-icons/fa";

function Home() {
  const [query, setQuery] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchInitialPokemon = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=12');
        const data = await response.json();
        const detailPromises = data.results.map((pokemon) => fetch(pokemon.url).then((res) => res.json()));
        const pokemonDetails = await Promise.all(detailPromises);
        setPokemonList(pokemonDetails);
      } catch (err) {
        console.error('Error fetching initial Pokemon:', err);
        setError('Unable to load Pokemon. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPokemon();
  }, []);

  const fetchPokemonData = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokemon not found');
      }
      const data = await response.json();
      setPokemonList([data]);
    } catch (err) {
      console.error(err);
      setPokemonList([]);
      setError('Pokemon not found. Try another name.');
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = (pokemon) => {
    const abilityText = pokemon.abilities?.map((ability) => ability.ability.name).join(', ');
    return abilityText || 'No additional details available.';
  };

  const renderDetails = (pokemon) => {
    const types = pokemon.types?.map((type) => type.type.name).join(', ');
    const abilities = pokemon.abilities?.map((ability) => ability.ability.name).join(', ');
    const stats = pokemon.stats?.map((stat) => `${stat.stat.name}: ${stat.base_stat}`).join(' · ');

    return (
      <div className="movie-details">
        <div className="detail-row">
          <span>Type</span>
          <span>{types || 'Unknown'}</span>
        </div>
        <div className="detail-row">
          <span>Abilities</span>
          <span>{abilities || 'None'}</span>
        </div>
        <div className="detail-row">
          <span>Height</span>
          <span>{pokemon.height ?? '-'} dm</span>
        </div>
        <div className="detail-row">
          <span>Weight</span>
          <span>{pokemon.weight ?? '-'} hg</span>
        </div>
        <div className="detail-row">
          <span>Stats</span>
          <span>{stats || 'N/A'}</span>
        </div>
      </div>
    );
  };

  const renderImage = (pokemon) => {
    return (
      pokemon.sprites.other?.['official-artwork']?.front_default ||
      pokemon.sprites.other?.dream_world?.front_default ||
      pokemon.sprites.front_default
    );
  };

  const toggleDetails = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <main className="movie-container">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">FEATURED COLLECTION</span>
          <h1>Explore the Legendary Pokemon Vault</h1>
          <p>Search the Aether-Dex to reveal rare Pokemon and view their power stats in a cinematic dark UI.</p>
          <div className="search-bar">
            <input
              type="text"
              id="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a Pokemon..."
            />
            <button id="search-button" onClick={fetchPokemonData}>
              Search
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="hero-image">
          <img
            src="https://assets.pokemon.com/assets/cms2/img/trading-card-game/_tiles/pokemon-tcg/swsh9/promo/2022/ss-9-prerelease-1-2022-1200x675.jpg"
            alt="Featured Pokemon"
          />
        </div>
      </section>

      <section className="movie-grid">
        {loading && <div className="loading-message">Loading Pokemon...</div>}
        {!loading && pokemonList.length === 0 && !error && (
          <div className="no-results">No Pokemon found. Try another search.</div>
        )}

        {!loading && pokemonList.map((pokemon) => {
          const isExpanded = expandedId === pokemon.id;

          return (
            <div key={pokemon.id} className="movie-card">
              <img className="poster" src={renderImage(pokemon)} alt={pokemon.name} />
              <div className="movie-info">
                <h3>{pokemon.name.toUpperCase()}</h3>
                <div className="card-actions">
                  <span className="rating">{Math.round((pokemon.base_experience || 0) * 2.5)}%</span>
                  <button
                    type="button"
                    className="toggle-details-btn"
                    onClick={() => toggleDetails(pokemon.id)}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? <FaMinus /> : <FaPlus />}
                  </button>
                </div>
              </div>
              <div className="overview">
                <h4>Overview</h4>
                <p>{renderOverview(pokemon)}</p>
                <button className="add-list-btn">Add to Collection</button>
              </div>
              {isExpanded && renderDetails(pokemon)}
            </div>
          );
        })}
      </section>
    </main>
  );
}

function Favourite() {
  return (
    <main className="movie-container">
      <div className="no-results">Favourite list is empty. Search and add Pokemon to your collection.</div>
    </main>
  );
}

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo" id="site-logo">POKEMON UNIVERSE</div>
        <nav className="nav-links">
          <NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/">
            Home
          </NavLink>
          <NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/favourite">
            My List
          </NavLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favourite" element={<Favourite />} />
      </Routes>
    </div>
  );
}

export default App;
