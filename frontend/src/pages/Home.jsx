import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Fetch all books on load
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books?size=1000");
        console.log("API Response:", res); // Log the full response
        const bookList = res.data.content || [];
        setBooks(bookList);
        setFilteredBooks(bookList);

        // extract unique categories
        const uniqueCategories = [...new Set(bookList.map(b => b.category || "Others"))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to fetch books. Please try again later.");
      }
    };
    fetchBooks();
  }, []);

  // ✅ Search functionality
  useEffect(() => {
    let result = books;
    if (searchTerm.trim()) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (category && category !== "All") {
      result = result.filter((book) => book.category === category);
    }
    setFilteredBooks(result);
  }, [searchTerm, category, books]);

  // ✅ Borrow book
  const handleBorrow = async (bookId) => {
    try {
      const res = await api.post(`/borrow/${bookId}`);
      alert(res.data.message || "Book borrowed successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Borrow failed. Please try again.");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-700">
          📚 BookHub Library
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all outline-none"
        >
          Logout
        </button>
      </div>

      {/* 🔍 Search and Filter Bar */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-400 rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-400 rounded-lg p-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 📖 Book Display */}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {filteredBooks.length === 0 ? (
        <p className="text-center text-gray-600">No books found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                {book.title}
              </h2>
              <p className="text-gray-700 mb-1">
                <strong>Author:</strong> {book.author || "Unknown"}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                {book.category || "No category"}
              </p>
              <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                {book.description || "No description available."}
              </p>
              <p className="text-sm text-green-600 font-medium mb-3">
                Available Copies:{" "}
                {book.availableCopies !== undefined
                  ? book.availableCopies
                  : "N/A"}
              </p>

              {/* Borrow button */}
              <button
                onClick={() => handleBorrow(book.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition-all"
              >
                Borrow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
