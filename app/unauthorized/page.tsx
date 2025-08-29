export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-600">403 - Forbidden</h1>
      <p className="mt-4 text-lg">
        You dont have permission to access this resource.
      </p>
    </div>
  );
}
