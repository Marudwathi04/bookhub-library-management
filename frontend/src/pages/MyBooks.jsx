import React, { useEffect, useState } from "react";
import api from "../api/axios";

const MyBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all borrowed books for the logged-in user
  const fetchBorrowedBooks = async () => {
    try {
      const res = await api.get("/borrow/user");
      setBorrowedBooks(res.data || []);
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
      setError("Failed to load borrowed books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  // ✅ Handle book return
  const handleReturn = async (bookId) => {
    try {
      const res = await api.post(`/return/${bookId}`);
      alert(res.data.message || "Book returned successfully!");
      fetchBorrowedBooks(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Return failed. Please try again.");
    }
  };

  // ✅ Borrow book
  const handleBorrow = async (bookId) => {
    try {
      const res = await api.post(`/borrow/${bookId}`);
      alert(res.data.message || "Book borrowed successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Borrow failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        📘 My Borrowed Books
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading your books...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : borrowedBooks.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven’t borrowed any books yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {borrowedBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-all duration-300"
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
              <p className="text-gray-500 text-sm mb-3">
                {book.description || "No description available."}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleBorrow(book.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition-all"
                >
                  Borrow
                </button>
                <button
                  onClick={() => handleReturn(book.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 transition-all"
                >
                  Return
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
