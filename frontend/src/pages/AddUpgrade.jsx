import { useState } from "react";
import Message from "../Message";
import { useNavigate } from "react-router-dom";

const categories = ["pr&team", "markets", "legal", "web3", "specials"];
const PIN = "1102";

function AddUpgrade() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pin, setPin] = useState("");

  const navigate = useNavigate();

  async function postUpgrade(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    let errors = [];

    if (!name || !pin || !category) return;

    try {
      let res = await fetch(`${import.meta.env.VITE_API_URL}/upgrades`);
      const allUpgrades = await res.json();

      // Check if upgrade already exists
      const existingUpgrade = allUpgrades.find(
        (upgrade) => upgrade.name === name.toLowerCase()
      );
      errors[0] = existingUpgrade
        ? `Upgrade already exists in ${
            existingUpgrade.category[0].toUpperCase() +
            existingUpgrade.category.slice(1)
          } category!`
        : "";
      errors[1] = pin !== PIN ? "Incorrect pin!" : "";

      if (errors[0] || errors[1]) throw new Error(errors.join("\n"));

      console.log(category);

      const newUpgrade = { name, category, id: `${allUpgrades.length + 1}` };

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
              <option value="">Choose a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat[0].toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="password">Pin</label>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              type="password"
              placeholder="****"
              maxLength={4}
              id="password"
            />
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
