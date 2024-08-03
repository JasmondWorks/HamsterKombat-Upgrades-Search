import { useState } from "react";
import { useEffect } from "react";
import Message from "../Message";

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
          <label htmlFor="upgradeSearchBox">Search for an upgrade</label>
          <input
            value={query}
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
function formatDateFromISOString(isoString, options) {
  // Convert the ISO string to a Date object
  const dateObject = new Date(isoString);

  // Default options if none are provided
  const defaultOptions = { year: "numeric", month: "long", day: "numeric" };

  // Use the provided options or fallback to default options
  const formatOptions = options || defaultOptions;

  // Format the date
  return dateObject.toLocaleDateString(undefined, formatOptions);
}

// Example usage:
const isoString = "2024-08-02T12:34:56.789Z";

// Format the date with default options
// console.log(formatDateFromISOString(isoString)); // Outputs something like "August 2, 2024"

// Custom format options
const customOptions = {
  weekday: "long",
  year: "numeric",
  month: "short",
  day: "numeric",
};
// console.log(formatDateFromISOString(isoString, customOptions)); // Outputs something like "Friday, Aug 2, 2024"

// Another custom format
const timeOptions = { hour: "numeric", minute: "numeric", second: "numeric" };
// console.log(formatDateFromISOString(isoString, timeOptions)); // Outputs something like "12:34:56 PM"

// Function to filter items based on dates within the last week
function filterItemsFromLastWeek(items) {
  // Get the current date
  const currentDate = new Date();

  // Calculate the date one week ago
  const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Filter the items
  return items.filter((item) => {
    const itemDate = new Date(item.addedAt);
    return itemDate >= oneWeekAgo && itemDate <= currentDate;
  });
}

// Example usage:
const items = [
  { id: 1, date: "2024-08-01T12:34:56.789Z" },
  { id: 2, date: "2024-07-29T09:12:34.567Z" },
  { id: 3, date: "2024-07-25T08:45:23.456Z" },
  { id: 4, date: "2024-07-20T14:23:12.345Z" },
];

const filteredItems = filterItemsFromLastWeek(items);

// console.log(filteredItems);
// Outputs items with dates within the last week, such as:
// [
//   { id: 1, date: "2024-08-01T12:34:56.789Z" },
//   { id: 2, date: "2024-07-29T09:12:34.567Z" }
// ]

function Home() {
  const [upgrades, setUpgrades] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("pr&team");
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState("");

  console.log(filterItemsFromLastWeek(upgrades));

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
  }, [success]);

  function handleSearch() {
    upgrades.filter((upgrade) => upgrade.name.includes(query.toLowerCase()));
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {success && <Message variant="success" text={success} />}
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
          {filterItemsFromLastWeek(upgrades).map((el) => (
            <li
              key={el.id}
              className="box"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <span>{el.category[0].toUpperCase() + el.category.slice(1)}</span>
              <span>
                <strong>{el.name[0].toUpperCase() + el.name.slice(1)}</strong>
              </span>
              {el.addedAt && (
                <span style={{ marginTop: ".75rem" }}>
                  <small>
                    Added on:{" "}
                    {formatDateFromISOString(el.addedAt, customOptions)}
                  </small>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <h1
        style={{ marginTop: "5rem", marginBottom: "2rem", textAlign: "center" }}
      >
        Upgrades Search Tool
      </h1>
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
