self.onmessage = function (event) {
    if (Array.isArray(event.data)) {
        const processedData = event.data.map(entry => ({
            name: entry.region.name,
            confirmed: entry.confirmed,
            fatality_rate: entry.fatality_rate,
            recovered: entry.recovered,
        }));

        console.log('Processed Data in Worker:', processedData); // Add this line
        self.postMessage(processedData);
    } else {
        self.postMessage('Error: Expected an array for processing.');
    }
};
