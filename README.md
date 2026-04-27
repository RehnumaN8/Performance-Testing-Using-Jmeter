# Performance-Testing-Using-Jmeter
I used money transfer api documentation. Created four users (customer1,2,agent and merchant) inside the thread group one along with the all other requests which are available inside the documentation. Then I take another thread group for performing transactions among them by login those users.


# JMeter Performance Testing Project

## Tools Used
- Apache JMeter
- GitHub

## Test Details
- Users: 50
- Ramp-up: 10 sec

## Results
- Avg Response Time: ~356 ms
- Throughput: ~15 req/sec
- Error Rate: 0.29%

## Reports
HTML report available in `html_report2` folder.
