let geturl = "https://sachiniyer.com/ec2-dash/get"
let ipurl = "https://sachiniyer.com/ec2-dash/ip"
let starturl = "https://sachiniyer.com/ec2-dash/start/?InstanceId="
let stopurl = "https://sachiniyer.com/ec2-dash/stop/?InstanceId="

// let geturl = "https://localhost:8010/ec2-dash/get"
// let ipurl = "https://localhost:8010/ec2-dash/ip"
// let starturl = "https://localhost:8010/ec2-dash/start/?InstanceId="
// let stopurl = "https://localhost:8010/ec2-dash/stop/?InstanceId="


// https://mnl5ssqjm9.execute-api.us-east-1.amazonaws.com/deploy-1/ec2-dash/start/?InstanceId=i-0ec3456120a968428

function processinstances(instances) {
	var instanceid = document.getElementById('instances')
	for(var i in instances) {
		var button = document.createElement("button")
		button.classList.add("ec2but")
		button.innerHTML = "Start: " + instances[i]
		instanceid.appendChild(button)
		button.addEventListener("click", function() {
			let url = starturl + i
			fetch(url)
				.then((response) => {
					console.log(response.text())
				})
				.then((data) => {
					console.log(data)
				})

			alert("started instance")
		})

		var button2 = document.createElement("button")
		button2.classList.add("ec2but")
		button2.innerHTML = "Stop: " + instances[i]
		instanceid.appendChild(button2)
		button2.addEventListener("click", function() {
			let url = stopurl + i
			fetch(url)
				.then((response) => {
					console.log(response.text())
				})
				.then((data) => {
					console.log(data)
				})
			alert("stopped instance")
		})
	}
}

document.addEventListener("DOMContentLoaded", function(event){
	fetch(geturl)
		.then(response => {
			console.log(response)
			return response.text()
		})
		.then((data) => {
			console.log(data)
			let jsondata = JSON.parse(data.toString())
			processinstances(jsondata)
		})
})
// document.addEventListener("DOMContentLoaded", function(event){
// 	processinstances(JSON.parse('{"i-0da09c44fd2c1d1b9": "vpn", "i-0ec3456120a968428": "Minecraft Server"}'))
// });
