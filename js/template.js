var Charts = [];

function ClearCharts() {
    if (Charts.length > 0) {
        Charts.forEach(chart => {
            chart.destroy();
        })
        Charts = [];
    }
}

function PopulateFDTable(results) {
    var data_spawnPoint = document.getElementById("data_spawnPoint");

    results.forEach(data => {
        data_spawnPoint.innerHTML += `
        <tr>
            <td>${data.year}</td>
            <td>${data.openingBalance}</td>
            <td>${data.interestEarned}</td>
            <td>${data.closingBalance}</td>
        </tr > `
    });

}

function PopulatePPFTable(results) {
    var data_spawnPoint = document.getElementById("data_spawnPoint");

    results.forEach(data => {
        data_spawnPoint.innerHTML += `
        <tr>
            <td>${data.year}</td>
            <td>${data.OpeningBalance}</td>
            <td>${data.AmountDeposited}</td>
            <td>${data.InterestEarned}</td>
            <td>${data.ClosingBalance}</td>
            <td>${data.LoanMax}</td>
            <td>${data.WithdrawalMax}</td>
        </tr > `
    });

}

function PopulateSummary(MaturityAmount, TotalInterestEarned) {
    var summary = document.getElementById("summary");
    summary.innerHTML =
        `<h1>Summary</h1>
    <h2>Maturity Amount : Rs. ${MaturityAmount}</h2>
    <h2>Total Interest Earned : Rs. <span class="green"> ${TotalInterestEarned}</span></h2>`
}

function PopulateSipSummary(summaryData) {
    var summary = document.getElementById("summary");

    summary.innerHTML =
        `<h1>Summary</h1>
    <h2>Expected Amount : Rs. ${summaryData.expectedAmount} ( ${ConvertRsIntoLakhs(summaryData.expectedAmount)} Lakhs)</h2>
    <h2>Amount Invested : Rs. ${summaryData.amountInvested} ( ${ConvertRsIntoLakhs(summaryData.amountInvested)} Lakhs)</h2>
    <h2>Wealth Gain : Rs. <span class="green"> ${summaryData.wealthGain}</span> ( <span class="green">${ConvertRsIntoLakhs(summaryData.wealthGain)}</span> Lakhs)</h2>`

    CreateSIPPieChart(summaryData.amountInvested, summaryData.wealthGain, summaryData.expectedAmount);
}

function PopulatePPFSummary(closingBalance) {
    var summary = document.getElementById("summary");

    summary.innerHTML =
        `<h1>Summary</h1>
        <h2>Maturity Amount : Rs. <span class="green">${closingBalance}</span> ( <span class="green">${ConvertRsIntoLakhs(closingBalance)}</span> Lakhs)</h2>`
}

function ClearTable() {
    var data_spawnPoint = document.getElementById("data_spawnPoint");
    data_spawnPoint.innerHTML = "";
}

function CreateFDBarChart(results) {
    var labels = [];
    var closingBalances = [];
    var interestEarneds = [];
    var backgroundColors1 = []
    var backgroundColors2 = []
    var borderColors1 = []
    var borderColors2 = []

    results.forEach(data => {
        var label = "Year #" + data.year;
        var closingBalance = data.closingBalance;
        var interestEarned = data.interestEarned;

        backgroundColors1.push('rgb(117, 167, 81,0.6)');
        borderColors1.push('rgb(117, 167, 81,1)');
        backgroundColors2.push('rgb(163, 196, 234)');
        borderColors2.push('rgba(54, 162, 235, 1)');
        labels.push(label);
        closingBalances.push(closingBalance);
        interestEarneds.push(interestEarned);
    })

    var ctx1 = document.getElementById('myChart1').getContext('2d');

    var myChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Closing Balance',
                data: closingBalances,
                backgroundColor: backgroundColors1,
                borderColor: borderColors1,
                borderWidth: 1
            }, {
                label: 'Interest Earned',
                data: interestEarneds,
                backgroundColor: backgroundColors2,
                borderColor: borderColors2,
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'FD Amount over the period',
                position: "bottom",
                fontSize: 24
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    Charts.push(myChart);
}

function CreateFDPieChart(TotalDeposited, totalEarned, Maturity) {

    var ctx2 = document.getElementById('myChart2').getContext('2d');
    var myChart2 = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: ['Total Amount Deposited(INR)', 'Total Interests Earned(INR)'],
            datasets: [{
                data: [TotalDeposited, totalEarned],
                backgroundColor: [
                    'rgb(255, 125, 56,0.6)',
                    'rgb(163, 196, 234)'
                ],
                borderColor: [
                    'rgb(255, 84, 0,1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'FD Maturity Amount is Rs. ' + Maturity + '.',
                position: "bottom",
                fontSize: 15
            }
        }
    });

    Charts.push(myChart2);
}

function CreateSIPPieChart(AmountInvested, WealthGain, Maturity) {

    var ctx2 = document.getElementById('myChart2').getContext('2d');
    var myChart2 = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: ['Amount Invested (INR): ', 'Wealth Gain (INR): '],
            datasets: [{
                data: [AmountInvested, WealthGain],
                backgroundColor: [
                    'rgb(255, 125, 56,0.6)',
                    'rgb(163, 196, 234)'
                ],
                borderColor: [
                    'rgb(255, 84, 0,1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Expected Maturity Amount is Rs. ' + Maturity + '.',
                position: "bottom",
                fontSize: 15
            }
        }
    });

    Charts.push(myChart2);
}

function CreatePPFBarChart(results) {
    var labels = [];
    var closingBalances = [];
    var interestEarneds = [];
    var backgroundColors1 = []
    var backgroundColors2 = []
    var borderColors1 = []
    var borderColors2 = []

    results.forEach(data => {
        var label = "Year #" + data.year;
        var closingBalance = data.ClosingBalance;
        var interestEarned = data.InterestEarned;

        backgroundColors1.push('rgb(117, 167, 81,0.6)');
        borderColors1.push('rgb(117, 167, 81,1)');
        backgroundColors2.push('rgb(163, 196, 234)');
        borderColors2.push('rgba(54, 162, 235, 1)');
        labels.push(label);
        closingBalances.push(closingBalance);
        interestEarneds.push(interestEarned);
    })

    var ctx1 = document.getElementById('myChart1').getContext('2d');

    var myChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Closing Balance',
                data: closingBalances,
                backgroundColor: backgroundColors1,
                borderColor: borderColors1,
                borderWidth: 1
            }, {
                label: 'Interest Earned',
                data: interestEarneds,
                backgroundColor: backgroundColors2,
                borderColor: borderColors2,
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'PPF balance (with interest) over the year',
                position: "bottom",
                fontSize: 24
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    Charts.push(myChart);
}

function CreatePPFPieChart(AmountDeposited, InterestEarned, Maturity) {

    var ctx2 = document.getElementById('myChart2').getContext('2d');
    var myChart2 = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: ['Amount Deposited (INR): ', 'Total Interest Earned (INR): '],
            datasets: [{
                data: [AmountDeposited, InterestEarned],
                backgroundColor: [
                    'rgb(255, 125, 56,0.6)',
                    'rgb(163, 196, 234)'
                ],
                borderColor: [
                    'rgb(255, 84, 0,1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Final Maturity Amount is Rs. ' + Maturity + '.',
                position: "bottom",
                fontSize: 15
            }
        }
    });

    Charts.push(myChart2);
}
