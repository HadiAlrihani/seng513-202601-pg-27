export const getPublicClubs = async (req, res) => {
  try {
    return res.status(200).json([
      {
        id: 1,
        club_name: "Dune Readers",
        book_title: "Dune",
        club_description: "A public club for readers going through Dune together.",
        number_members: 8,
        max_members: 20,
        public: true
      },
      {
        id: 2,
        club_name: "1984 Discussion Circle",
        book_title: "1984",
        club_description: "Discuss Orwell chapter by chapter without spoilers.",
        number_members: 5,
        max_members: 15,
        public: true
      }
    ]);
  } catch (error) {
    console.error("Error fetching public clubs:", error);
    return res.status(500).json({ error: "Failed to fetch public clubs" });
  }
};