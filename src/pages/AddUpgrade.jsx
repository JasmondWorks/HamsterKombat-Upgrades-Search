import { useEffect } from "react";
import { useState } from "react";
import Message from "../Message";
import { useNavigate } from "react-router-dom";

const categories = ["pr&team", "markets", "legal", "web3", "specials"];

function AddUpgrade() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[4]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  async function postUpgrade(e) {
    e.preventDefault();
    // Check if upgrade already exists

    setError("");
    setSuccess("");

    if (!name) return;

    try {
      let res = await fetch(`${import.meta.env.VITE_API_URL}/upgrades`);
      const allUpgrades = await res.json();

      if (allUpgrades.find((upgrade) => upgrade.name === name))
        throw new Error("Upgrade already exists!");

      console.log(category);

      const newUpgrade = { name, category, id: allUpgrades.length + 1 };

      res = await fetch("http://localhost:3200/upgrades", {
        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify(newUpgrade),

        // Adding headers to the request
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      setSuccess("Successfully created new upgrade");
      setTimeout(function () {
        navigate("/");
      }, 2500);
      setName("");
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
  }

  useEffect(() => {}, []);
  return (
    <div>
      <form className="form box" onSubmit={postUpgrade}>
        <div className="form-groups">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat[0].toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="btn-wrapper" style={{ textAlign: "right" }}>
          <button>Submit</button>
        </div>
      </form>
      {error && <Message text={error} variant="error" />}
      {success && <Message text={success} variant="success" />}
    </div>
  );
}

export default AddUpgrade;
