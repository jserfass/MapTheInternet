// Bar chart
var peaknames = ["Arizona", "California", "Colorado", "Idaho", "Montana", "Nevada", "New Hampshire", "New Mexico", "New York",
 "North Carolina", "Oregon", "Texas", "Utah", "Washington", "Wyoming"];
var typeNums = [9, 13, 5, 7, 9, 19, 1, 1, 1, 2, 7, 1, 12, 15, 3];
var typeNums2 = [5, 9, 3, 3, 4, 8, 1, 1, 0, 1, 4, 0, 8, 7, 3]//

var context = document.getElementById("barchart");
var barchart = new Chart(context, {
  type: 'bar',
  data: {
    labels: peaknames,
    datasets: [
      {
        label: "Number of Top 100 Peaks",
        backgroundColor: "#3e95cd",
        data: typeNums
      },
      {
        label: "Ultra Prominent Peaks (Greater than 5,000 feet)",
        backgroundColor: "red",
        data: typeNums2
      } 
    ]
  },
  options: {
    legend: { display: false },
    }
  });