//utils
function percentage(num, per) {
    return Number((num / 100) * per);
}

function ConvertRsIntoLakhs(amount) {
    return Number(amount / 100000).toFixed(1);
}

let canvasWrapper = document.querySelectorAll(".canvas-wrapper");
let error = document.querySelector(".error");
//FD Calculator
function CalculateFD() {

    fd_table = document.getElementById("fd_table");
    summary = document.getElementById("summary");

    ClearTable();
    ClearCharts();

    fd_amount = document.getElementById("fd_amount").value;
    fd_period = document.getElementById("fd_period").value;
    fd_date = document.getElementById("fd_date").value;
    fd_rate = document.getElementById("fd_rate").value;
    fd_frequency = document.getElementById("fd_frequency").value;

    var Results = [];
    MaturityAmount = 0;
    TotalInterestEarned = 0;



    if (fd_amount.trim() == "" || fd_period.trim() == "" || fd_date.trim() == "" || fd_rate == "" || fd_frequency.trim() == "") {
        canvasWrapper.forEach(wrapper => {
            wrapper.classList.add("ch");
        })
        fd_table.classList.add("hidden");
        summary.classList.add("hidden");
        error.classList.remove("hidden");
        $('html, body').animate({
            scrollTop: $(".fs-title").offset().top
        }, 500);
        return;
    }

    if (!error.classList.contains("hidden")) {
        error.classList.add("hidden");
    }

    if (fd_amount < 0) {
        fd_amount = Math.abs(fd_amount);
        document.getElementById("fd_amount").value = fd_amount;
    }

    if (fd_rate < 0) {
        fd_rate = Math.abs(fd_rate);
        document.getElementById("fd_rate").value = fd_rate;
    }

    if (fd_period > 100) {
        fd_period = 100;
    }

    if (fd_period < 0) {
        fd_period = 1;
    }

    if (fd_period == 0) {
        fd_period = 1;
        document.getElementById("fd_period").value = 1;
    }


    if (fd_date == "m") {
        fd_period = Math.ceil(fd_period / 12);
    }
    else if (fd_date == "d") {
        fd_period = Math.ceil(fd_period / 365);
    }

    if (fd_rate > 1) {
        if (fd_frequency == "m") {
            fd_rate = fd_rate - 0.25;
        } else if (fd_frequency == "q") {
            fd_rate = fd_rate - 0.20;
        } else if (fd_frequency == "hq") {
            fd_rate = fd_rate - 0.15;
        }
    }

    var openingBalance = Number(fd_amount);
    var interestEarned = Number(percentage(openingBalance, fd_rate));
    var closingBalance = Number(openingBalance + interestEarned);

    for (let i = 1; i <= fd_period; i++) {
        var data = {
            year: i,
            openingBalance: Number(openingBalance).toFixed(0),
            interestEarned: Number(interestEarned).toFixed(0),
            closingBalance: Number(closingBalance).toFixed(0)
        }

        openingBalance = Number(data.closingBalance);
        interestEarned = Number(percentage(openingBalance, fd_rate));
        closingBalance = Number(openingBalance + interestEarned);

        Results.push(data);

    }

    Results.forEach(data => {
        TotalInterestEarned += Number(data.interestEarned);
    })

    MaturityAmount = Results[Results.length - 1].closingBalance;

    fd_table.classList.remove("hidden");
    summary.classList.remove("hidden");
    canvasWrapper.forEach(wrapper => {
        wrapper.classList.remove("ch");
    })
    PopulateSummary(MaturityAmount, TotalInterestEarned);
    PopulateFDTable(Results);
    CreateFDBarChart(Results);
    CreateFDPieChart(Results[0].openingBalance, TotalInterestEarned, MaturityAmount);

    $('html, body').animate({
        scrollTop: $("#summary").offset().top
    }, 1000);

}

//SIP Calculator

function CalculateSIP() {
    ClearCharts();

    summary = document.getElementById("summary");

    sip_amount = document.getElementById("sip_amount").value;
    sip_period = document.getElementById("sip_period").value;
    sip_date = document.getElementById("sip_date").value;
    sip_rate = document.getElementById("sip_rate").value;

    if (sip_amount.trim() == "" || sip_period.trim() == "" || sip_date.trim() == "" || sip_rate.trim() == "") {
        canvasWrapper.forEach(wrapper => {
            wrapper.classList.add("ch");
        })
        summary.classList.add("hidden");
        error.classList.remove("hidden");
        $('html, body').animate({
            scrollTop: $(".fs-title").offset().top
        }, 500);
        return;
    }


    if (!error.classList.contains("hidden")) {
        error.classList.add("hidden");
    }

    if (sip_amount < 0) {
        sip_amount = Math.abs(sip_amount);
        document.getElementById("sip_amount").value = sip_amount;
    }

    if (sip_period < 0) {
        sip_period = Math.abs(sip_period);
        document.getElementById("sip_period").value = sip_period;
    }

    if (sip_rate < 0) {
        sip_rate = Math.abs(sip_rate);
        document.getElementById("sip_rate").value = sip_rate;
    }

    var investment = sip_amount;
    var annualRate = sip_rate;
    var monthlyRate = annualRate / 12 / 100;
    var years = sip_period;
    var months = years * 12;
    var futureValue = 0;

    var total = (investment * months).toFixed(0);
    futureValue = (investment * (1 + monthlyRate) * ((Math.pow((1 + monthlyRate), months)) - 1) / monthlyRate).toFixed(0);

    var wealthGain = Math.abs(futureValue - total).toFixed(0);

    summaryData = {
        "expectedAmount": futureValue,
        "amountInvested": total,
        "wealthGain": wealthGain
    }

    summary.classList.remove("hidden");
    canvasWrapper.forEach(wrapper => {
        wrapper.classList.remove("ch");
    })
    PopulateSipSummary(summaryData);

    $('html, body').animate({
        scrollTop: $("#summary").offset().top
    }, 1000);

}

//PPF Calculator

function CalculatePPF() {
    summary = document.getElementById("summary");
    ppf_table = document.getElementById("ppf_table");
    ClearTable();
    ClearCharts();
    ppf_amount = document.getElementById("ppf_amount").value;
    ppf_date = document.getElementById("ppf_date").value;

    var maxYear = 15;
    var OpeningBalance = 0;
    var AmountDeposited = Number(ppf_amount).toFixed(0);
    var InterestEarned = 0;
    var ClosingBalance = 0;
    var MainInterest = Number(Math.round(percentage(AmountDeposited, 7.9)));
    var LoanAmount = 0;
    var WithdrawalAmount = 0;

    if (ppf_amount < 0) {
        ppf_amount = Math.abs(ppf_amount);
        document.getElementById("ppf_amount").value = ppf_amount;
    }

    if (ppf_amount == 0) {
        canvasWrapper.forEach(wrapper => {
            wrapper.classList.add("ch");
        })
        summary.classList.add("hidden");
        ppf_table.classList.add("hidden");
        error.classList.remove("hidden");
        $('html, body').animate({
            scrollTop: $(".fs-title").offset().top
        }, 500);
        return;
    } else {

        if (!error.classList.contains("hidden")) {
            error.classList.add("hidden");
        }
    }

    var ppfData = {
        "year": 0,
        "OpeningBalance": 0,
        "AmountDeposited": AmountDeposited,
        "InterestEarned": 0,
        "ClosingBalance": 0,
        "LoanMax": 0,
        "WithdrawalMax": 0
    }

    var FinalPpfData = [];

    if (ppf_amount.trim() != "" || ppf_date.trim() != "") {

        for (let i = 1; i <= maxYear; i++) {

            OpeningBalance = Number(ppfData.OpeningBalance);
            InterestEarned = Number(Math.round(percentage(OpeningBalance, 7.9))) + MainInterest;
            ClosingBalance = Number(Number(OpeningBalance) + Number(ppfData.AmountDeposited) + Number(InterestEarned));

            if (i > 2 && i < 7) {
                LoanAmount = Math.round(percentage(FinalPpfData[i - 2].OpeningBalance, 25));
            } else {
                LoanAmount = 0;
            }

            if (i >= 7) {
                WithdrawalAmount = Math.round(percentage(FinalPpfData[i - 4].OpeningBalance, 50));
            } else {
                WithdrawalAmount = 0;
            }

            tempPpfData = {
                "year": i,
                "OpeningBalance": OpeningBalance,
                "AmountDeposited": Number(ppfData.AmountDeposited),
                "InterestEarned": InterestEarned,
                "ClosingBalance": ClosingBalance,
                "LoanMax": LoanAmount,
                "WithdrawalMax": WithdrawalAmount
            }

            ppfData.OpeningBalance = ClosingBalance;


            FinalPpfData.push(tempPpfData);
        }
    }

    if (FinalPpfData.length > 14) {

        let TotalInterestEarned = 0;
        FinalPpfData.forEach(data => {
            TotalInterestEarned += data.InterestEarned;
        })

        summary.classList.remove("hidden");
        PopulatePPFSummary(FinalPpfData[14].ClosingBalance);

        ppf_table.classList.remove("hidden");
        canvasWrapper.forEach(wrapper => {
            wrapper.classList.remove("ch");
        })
        PopulatePPFTable(FinalPpfData);

        CreatePPFBarChart(FinalPpfData);
        CreatePPFPieChart(AmountDeposited * 15, TotalInterestEarned, FinalPpfData[14].ClosingBalance);
        $('html, body').animate({
            scrollTop: $("#summary").offset().top
        }, 1000);

    }
}


