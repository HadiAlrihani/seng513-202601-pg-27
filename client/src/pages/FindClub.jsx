import { useEffect, useState } from "react";

function FindClub() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("http://localhost:5000/bookclubs/public");

        if (!response.ok) {
          throw new Error("Failed to fetch public book clubs");
        }

        const data = await response.json();
        setClubs(data);
      } catch (err) {
        console.error("Error fetching clubs:", err);
        setError("Could not load book clubs.");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) {
    return <div>Loading public book clubs...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Public Book Clubs</h1>

      {clubs.length === 0 ? (
        <p>No public book clubs found.</p>
      ) : (
        clubs.map((club) => (
          <div
            key={club.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h2>{club.club_name}</h2>
            <p><strong>Book:</strong> {club.book_title}</p>
            <p><strong>Description:</strong> {club.club_description}</p>
            <p>
              <strong>Members:</strong> {club.number_members} / {club.max_members}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default FindClub;