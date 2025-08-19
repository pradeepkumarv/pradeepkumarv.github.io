export default function Dashboard({ onLogout }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">📊 Family Net Worth Dashboard</h1>
      <p className="mt-4">Here you will see your investments, bank balance, FDs, insurance, etc.</p>
      <button
        onClick={onLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
