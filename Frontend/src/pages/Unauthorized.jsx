function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-gray-600">403 - Unauthorized</h1>
      <p className="mt-4">You don't have permission to view this page.</p>
    </div>
  );
}

export default Unauthorized;
