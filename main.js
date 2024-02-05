function createDeathRateScatterChart(processedData) {
    console.log('Processed Data for Death Rate Scatter Chart:', processedData);

    const countries = [];
    const deathRates = [];

    processedData.forEach(entry => {
        const countryName = entry.name;
        countries.push(countryName);
        deathRates.push(entry.fatality_rate);
    });

    const ctxScatterDeathRate = document.getElementById('scatter-chart-death-rate').getContext('2d');
    const scatterChartDeathRate = new Chart(ctxScatterDeathRate, {
        type: 'scatter',
        data: {
            labels: countries,
            datasets: [{
                label: 'Death Rate',
                data: deathRates,
                backgroundColor: 'rgba(255, 99, 132, 0.5)', // Adjust color as needed
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Death Rates by Country (Scatter Plot)'
            },
            scales: {
                x: {
                    type: 'category',
                    labels: countries,
                    title: {
                        display: true,
                        text: 'Countries'
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Death Rate'
                    }
                }
            }
        }
    });
}


// Function to generate random colors
function generateRandomColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8)`;
        colors.push(color);
    }
    return colors;
}
function createConfirmedCasesBarChart(processedData) {
    console.log('Processed Data for Confirmed Cases Bar Chart:', processedData);

    const countries = processedData.map(entry => entry.name);
    const confirmedCases = processedData.map(entry => entry.confirmed);

    const ctxBarConfirmedCases = document.getElementById('bar-chart-confirmed-cases').getContext('2d');
    const barChartConfirmedCases = new Chart(ctxBarConfirmedCases, {
        type: 'bar',
        data: {
            labels: countries,
            datasets: [{
                label: 'Total Confirmed Cases',
                data: confirmedCases,
                backgroundColor: generateRandomColors(countries.length), // Function to generate random colors
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Confirmed Cases'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Countries'
                    }
                }
            },
            title: {
                display: true,
                text: 'Confirmed Cases by Country'
            }
        }
    });
}

function createRecoveredCasesLineChart(processedData) {
    console.log('Processed Data for Recovered Cases Line Chart:', processedData);

    const countries = processedData.map(entry => entry.name);
    const recoveredCases = processedData.map(entry => entry.recovered);

    const ctxLineRecoveredCases = document.getElementById('line-chart-recovered-cases').getContext('2d');
    const lineChartRecoveredCases = new Chart(ctxLineRecoveredCases, {
        type: 'line',
        data: {
            labels: countries,
            datasets: [{
                label: 'Total Recovered Cases',
                data: recoveredCases,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Recovered Cases'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Countries'
                    }
                }
            },
            title: {
                display: true,
                text: 'Recovered Cases by Country'
            }
        }
    });
}

function openTab(event, tabName) {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }

    const tablinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = '';
    }

    document.getElementById(tabName).style.display = 'block';
    event.currentTarget.style.backgroundColor = '#bbb';
}
document.addEventListener('DOMContentLoaded', async () => {

    try {
        const response = await fetch('https://covid-api.com/api/reports');
        const data = await response.json();

        if (data && data.data && Array.isArray(data.data)) {
            const dataWorker = new Worker('worker.js');
            dataWorker.postMessage(data.data);

            dataWorker.onmessage = function (event) {
                const processedData = event.data;
                console.log('Processed Data:', processedData);

                // Additional charts
                createDeathRateScatterChart(processedData);
                createRecoveredCasesLineChart(processedData);
                createConfirmedCasesBarChart(processedData);
            };
             // Default to show Confirmed Cases tab
            document.getElementById('confirmed-cases').style.display = 'block';
        } else {
            console.error('Error: Expected an array of data from the API.');
        }
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
    
});
