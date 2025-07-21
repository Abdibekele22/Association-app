// resources/js/Pages/FirewallTest.jsx
import React from 'react';
export default function FirewallTest({ FORCE_data, _meta }) {
    console.log('Firewall Props:', { FORCE_data, _meta });
    
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Inertia Firewall Test</h1>
            
            <div className={`p-4 mb-6 rounded-lg border ${
                FORCE_data ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
            }`}>
                <p className="font-bold">
                    {FORCE_data ? '✅ Data received' : '❌ No data received'}
                </p>
                {_meta && (
                    <p className="text-sm mt-2">
                        Inertia v{_meta.inertia_version} at {_meta.time}
                    </p>
                )}
            </div>

            {FORCE_data && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-bold">Numbers</h3>
                        <pre>{JSON.stringify(FORCE_data.numbers, null, 2)}</pre>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-bold">Message</h3>
                        <p>{FORCE_data.message}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-bold">Sum</h3>
                        <p>${FORCE_data.sum.toFixed(2)}</p>
                    </div>
                </div>
            )}
        </div>
    );
}