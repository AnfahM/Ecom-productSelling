import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationData = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch states
                const states = await axios.get('https://api.countrystatecity.in/v1/countries/IN/states', { 
                    headers: { 'X-CSCAPI-KEY': 'YOUR_API_KEY' } 
                });
                
                const structuredData = [];
                
                // Fetch districts for each state
                for (const state of states.data) {
                    const districts = await axios.get(
                        `https://api.countrystatecity.in/v1/countries/IN/states/${state.iso2}/cities`,
                        { headers: { 'X-CSCAPI-KEY': 'YOUR_API_KEY' } }
                    );

                    structuredData.push({ state: state.name, districts: districts.data });
                }
                
                setData(structuredData);
            } catch (error) {
                console.error('Error fetching location data:', error);
            }
        };
        
        fetchData();
    }, []);

    return (
        <div>
            <h2>Location Data</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default LocationData;
