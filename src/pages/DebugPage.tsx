const DebugPage = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Debug Information</h1>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Supabase URL:</h2>
          <code className="text-sm">{supabaseUrl || 'NOT SET'}</code>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Supabase Anon Key (first 50 chars):</h2>
          <code className="text-sm">{supabaseKey?.substring(0, 50) || 'NOT SET'}...</code>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Expected Values:</h2>
          <p className="text-sm mb-2">URL should be: <code>https://pffvmsuerzdiajglcavy.supabase.co</code></p>
          <p className="text-sm">Key should start with: <code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh</code></p>
        </div>

        <div className={`p-4 rounded ${supabaseUrl === 'https://pffvmsuerzdiajglcavy.supabase.co' ? 'bg-green-100' : 'bg-red-100'}`}>
          <h2 className="font-semibold mb-2">Status:</h2>
          {supabaseUrl === 'https://pffvmsuerzdiajglcavy.supabase.co' ? (
            <p className="text-green-700">✅ Using correct Supabase URL</p>
          ) : (
            <p className="text-red-700">❌ Using wrong Supabase URL! Need to restart dev server.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
