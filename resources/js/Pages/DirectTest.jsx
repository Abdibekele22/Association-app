// resources/js/Pages/DirectTest.jsx
export default function DirectTest({ guaranteed_data, _meta }) {
    console.log('Direct Test Props:', { guaranteed_data, _meta });
    
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Direct Inertia Test</h1>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded border border-green-200">
                    <h2 className="font-bold">Guaranteed Data</h2>
                    <pre>{JSON.stringify(guaranteed_data, null, 2)}</pre>
                </div>
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                    <h2 className="font-bold">Meta Data</h2>
                    <pre>{JSON.stringify(_meta, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}