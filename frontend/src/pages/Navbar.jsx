<Link to="/mybooks" className="text-blue-600 hover:underline">
  My Books
</Link>
{user?.role === "ADMIN" && (
  <Link to="/admin" className="text-blue-600 font-semibold underline ml-4">
    Admin Dashboard
  </Link>
)}
