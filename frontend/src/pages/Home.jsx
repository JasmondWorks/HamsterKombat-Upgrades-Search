import { useState } from "react";
import { useEffect } from "react";
import Message from "../Message";
import {
  customOptions,
  filterItemsFromLastWeek,
  formatDateFromISOString,
  sortItemsByDateDescending,
} from "../utils";

function Tabs({ selectedTab, upgrades, setSelectedTab }) {
  const tabs = [...new Set(upgrades.map((upgrade) => upgrade.category))];

  return (
    <div
      style={{
        overflowX: "auto",
        paddingBottom: ".5rem",
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "start",
          width: "fit-content",
          gap: "1rem",
          margin: "auto",
        }}
      >
        {tabs.map((tab) => (
          <span
            onClick={() => setSelectedTab(tab)}
            style={
              selectedTab === tab
                ? { borderBottom: "3px solid black", fontWeight: "600" }
                : { cursor: "pointer" }
            }
            key={tab}
          >
            {tab[0].toUpperCase() + tab.slice(1)}
          </span>
        ))}
      </div>
    </div>
  );
}
function UpgradesList({ data, setSuccess }) {
  const [selectedItem, setSelectedItem] = useState(null);

  if (!data) return;

  async function handleDeleteUpgrade(item) {
    const proceed = confirm(
      `Proceed with deletion of ${item.name} from ${item.category}?`
    );
    const pin = proceed && prompt("Pin: ");

    if (!proceed || pin !== "1102") return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/upgrades/${item.id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.log(err.message);
    } finally {
      setSuccess(`Successfully deleted ${item.name} from ${item.category}`);
    }
  }
  async function handleEditUpgrade(item) {
    const proceed = confirm(
      `Proceed with deletion of ${item.name} from ${item.category}?`
    );
    const pin = proceed && prompt("Pin: ");

    if (!proceed || pin !== "1102") return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/upgrades/${item.id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.log(err.message);
    } finally {
      setSuccess(`Successfully deleted ${item.name} from ${item.category}`);
    }
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem",
        maxHeight: "500px",
        overflowY: "auto",
        paddingRight: "1rem",
      }}
    >
      {data.map((el) => (
        <div
          className="options-wrapper"
          onClick={() => setSelectedItem(selectedItem === el.id ? null : el.id)}
          style={{
            padding: "1rem",
            border: "1px solid rgba(0, 0, 0, .15)",
            cursor: "pointer",
          }}
          key={el.name}
        >
          {el.name[0].toUpperCase() + el.name.slice(1)}
          <div className={`options ${selectedItem === el.id ? "active" : ""}`}>
            <button onClick={() => handleDeleteUpgrade(el)}>❌</button>
            {/* <button onClick={() => handleEditUpgrade(el)}>✏️</button> */}
          </div>
        </div>
      ))}
    </div>
  );
}
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
            placeholder="Search for an upgrade"
            onChange={(e) => {
              console.log("Searching...");
              setQuery(e.target.value);
            }}
            id="upgradeSearchBox"
            type="text"
          />
        </div>
      </div>
    </form>
  );
}

function JustAdded({ upgrades }) {
  return (
    <div style={{ marginTop: "3.5rem" }}>
      <h3>Just added</h3>
      <ul
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          listStyle: "none",
          paddingLeft: 0,
        }}
      >
        {sortItemsByDateDescending(filterItemsFromLastWeek(upgrades)).map(
          (el) => (
            <li
              key={el.id}
              className="box"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".15rem",
              }}
            >
              <span>{el.category[0].toUpperCase() + el.category.slice(1)}</span>
              <span>
                <strong>{el.name[0].toUpperCase() + el.name.slice(1)}</strong>
              </span>
              {el.addedAt && (
                <span style={{ marginTop: ".35rem" }}>
                  <small>
                    Added on:{" "}
                    {formatDateFromISOString(el.addedAt, customOptions)}
                  </small>
                </span>
              )}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

function Home() {
  const [upgrades, setUpgrades] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("pr&team");
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState("");

  let filteredUpgrades = upgrades.filter((upgrade) =>
    upgrade.name.includes(query.toLowerCase())
  );

  const groupedUpgrades = filteredUpgrades.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
  const categorizedUpgrades = groupedUpgrades[selectedTab];

  useEffect(() => {
    async function fetchUpgrades() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/upgrades`);
        const data = await res.json();

        setUpgrades(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUpgrades();

    setTimeout(function () {
      setSuccess("");
    }, 4000);

    return function () {};
  }, [success]);

  function handleSearch() {
    upgrades.filter((upgrade) => upgrade.name.includes(query.toLowerCase()));
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {success && <Message variant="success" text={success} />}
      <JustAdded upgrades={upgrades} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingBlock: "1.75rem",
          gap: "2.25rem",
          flexWrap: "wrap",
        }}
      >
        <Search handleSearch={handleSearch} query={query} setQuery={setQuery} />
        <Tabs
          upgrades={upgrades}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </div>
      {query && !categorizedUpgrades ? (
        <h3 style={{ textAlign: "center" }}>Could not match your search!</h3>
      ) : (
        <UpgradesList data={categorizedUpgrades} setSuccess={setSuccess} />
      )}
    </div>
  );
}

export default Home;
