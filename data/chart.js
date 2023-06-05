// Bar chart
var peaknames = ["Mount Rainier", "Mount Baker", "Mount Adams", "Mount Olympus", "Glacier Peak", "Mount Stuart", "Abercrombie Mountain", "Round Mountain", "Mount Spickard",
 "Copper Butte", "Mount Saint Helens", "Three Fingers", "Mount Shuksan", "Remmel Mountain", "Jack Mountain", "Moses Mountain", "Mount Deception", "Mount Prophet", "North Gardner", "Hozomeen Mountain"];
var typeNums = [13210, 8881, 8116, 7829, 7480, 5335, 5168, 4780, 4779, 4740, 4605, 4490, 4411, 4365, 4186, 4134, 4108, 4000, 3996, 3932];
var typeNums2 = [14410, 10781, 12276, 7969, 10520, 9415, 7308, 5320, 8979, 7140, 8365, 6850, 9131, 8685, 9066, 6774, 7788, 7640, 8956, 8066]

var context = document.getElementById("barchart");
var barchart = new Chart(context, {
  type: 'bar',
  data: {
    labels: peaknames,
    datasets: [
      {
        label: "Prominence (Feet)",
        backgroundColor: "#3e95cd",
        data: typeNums
      },
      {
        label: "Summit Elevation (Feet)",
        backgroundColor: "red",
        data: typeNums2
      }
    ]
  },
  options: {
    legend: { display: false },
    }
  });