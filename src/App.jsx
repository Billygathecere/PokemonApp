import { useState } from "react";
function App() {

  // Search Bar Logic
  // useState will store the text in the search bar and update the query value
  const [query, setQuery] = useState("");


  return (
    <div>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Pokemon" />
      {/* the handleSearch function will be called when the button is clicked */}
      <button onClick={handleSearch}>Search</button>
      <h1>Pokemon Universe</h1>
      <p>Delve into the world of Pokemon, learn about'em and find your favorites!</p>
    </div>
  );
}

export default App;
