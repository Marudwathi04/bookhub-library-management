import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    totalCopies: "",
    availableCopies: "",
  });
  const [editingBook, setEditingBook] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch all books (handles pageable response)
  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      const booksData = Array.isArray(res.data.content)
        ? res.data.content
        : [];
      setBooks(booksData);
    } catch (err) {
      console.error("Error fetching books:", err);
      setBooks([]);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await api.post("/books", {
        ...newBook,
        totalCopies: parseInt(newBook.totalCopies),
        availableCopies: parseInt(newBook.availableCopies),
      });
      alert("Book added successfully!");
      setNewBook({
        title: "",
        author: "",
        category: "",
        description: "",
        totalCopies: "",
        availableCopies: "",
      });
      fetchBooks();
    } catch (err) {
      alert("Failed to add book");
      console.error(err);
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setNewBook({
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
    });
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/books/${editingBook.id}`, {
        ...newBook,
        totalCopies: parseInt(newBook.totalCopies),
        availableCopies: parseInt(newBook.availableCopies),
      });
      alert("Book updated successfully!");
      setEditingBook(null);
      setNewBook({
        title: "",
        author: "",
        category: "",
        description: "",
        totalCopies: "",
        availableCopies: "",
      });
      fetchBooks();
    } catch (err) {
      alert("Failed to update book");
      console.error(err);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await api.delete(`/books/${id}`);
      alert("Book deleted successfully!");
      fetchBooks();
    } catch (err) {
      alert("Failed to delete book");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">📚 BookHub Admin Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/home")}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ✅ Add/Edit Book Form */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          {editingBook ? "✏️ Edit Book" : "➕ Add New Book"}
        </h2>
        <form
          onSubmit={editingBook ? handleUpdateBook : handleAddBook}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Title</label>
            <input
              type="text"
              name="title"
              value={newBook.title}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Author</label>
            <input
              type="text"
              name="author"
              value={newBook.author}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Category</label>
            <input
              type="text"
              name="category"
              value={newBook.category}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Description</label>
            <input
              type="text"
              name="description"
              value={newBook.description}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Total Copies</label>
            <input
              type="number"
              name="totalCopies"
              value={newBook.totalCopies}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Available Copies
            </label>
            <input
              type="number"
              name="availableCopies"
              value={newBook.availableCopies}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="col-span-2 text-center mt-4">
            <button
              className={`px-6 py-2 rounded-lg text-white font-semibold ${
                editingBook ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
              } transition`}
            >
              {editingBook ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Books Table */}
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8 mb-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
          📖 Available Books
        </h2>
        {books.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No books available</p>
        ) : (
          <table className="w-full border border-gray-200 text-center text-sm">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Author</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Available</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border">{book.title}</td>
                  <td className="p-3 border">{book.author}</td>
                  <td className="p-3 border">{book.category}</td>
                  <td className="p-3 border">{book.description}</td>
                  <td className="p-3 border">{book.totalCopies}</td>
                  <td className="p-3 border">{book.availableCopies}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleEditBook(book)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
