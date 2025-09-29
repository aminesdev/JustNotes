function App() {
    return (
        <div className="min-h-screen bg-red-500 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">Note App Frontend</h1>
                <p className="text-gray-700 text-lg mb-4">Testing Tailwind CSS v3</p>
                <div className="space-y-2">
                    <div className="p-3 bg-green-500 text-white rounded">Green box = Tailwind working</div>
                    <div className="p-3 bg-blue-500 text-white rounded">Blue box = Colors working</div>
                    <div className="p-3 bg-yellow-500 text-black rounded">Yellow box = All good! ✅</div>
                </div>
            </div>
        </div>
    );
}

export default App;