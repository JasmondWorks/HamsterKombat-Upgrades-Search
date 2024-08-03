function Search({ setQuery, query }) {
  return (
    <form
      style={{ padding: "0" }}
      className=""
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="form-groups">
        <div className="form-group" style={{ textAlign: "center" }}>
          {/* <label htmlFor="upgradeSearchBox">Search for an upgrade</label> */}
          <input
            value={query}
            onChange={(e) => {
              console.log("Searching...");
              setQuery(e.target.value);
            }}
            placeholder="Search for an upgrade"
            id="upgradeSearchBox"
            type="text"
          />
        </div>
      </div>
    </form>
  );
}

export default Search;
