/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.70588235294117, "KoPercent": 0.29411764705882354};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8455882352941176, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.65, 500, 1500, "customer1 login"], "isController": false}, {"data": [0.65, 500, 1500, "agent login"], "isController": false}, {"data": [0.95, 500, 1500, "deposit system to agent "], "isController": false}, {"data": [1.0, 500, 1500, "Post_payment-customer-to-merchant"], "isController": false}, {"data": [1.0, 500, 1500, "Post_Deposit (AGENT → Customer)"], "isController": false}, {"data": [0.95, 500, 1500, "Get Request"], "isController": false}, {"data": [0.95, 500, 1500, "Post_Deposit (System --> Customer)"], "isController": false}, {"data": [0.65, 500, 1500, "merchant login"], "isController": false}, {"data": [0.95, 500, 1500, "Post_deposit system to agent"], "isController": false}, {"data": [0.95, 500, 1500, "payment-customer1-to-merchant"], "isController": false}, {"data": [0.95, 500, 1500, "Post_withdraw-customer-to-agent"], "isController": false}, {"data": [0.95, 500, 1500, "withdraw-customer1-to-agent"], "isController": false}, {"data": [1.0, 500, 1500, "Get_Search User By email"], "isController": false}, {"data": [0.65, 500, 1500, "admin login"], "isController": false}, {"data": [1.0, 500, 1500, "Get_system-virtual-balance"], "isController": false}, {"data": [0.6, 500, 1500, "customer2 login"], "isController": false}, {"data": [1.0, 500, 1500, "Get_Transaction Details"], "isController": false}, {"data": [0.5, 500, 1500, "create user (customer2)"], "isController": false}, {"data": [0.95, 500, 1500, "Post_send-money-customer-to-customer"], "isController": false}, {"data": [0.5, 500, 1500, "create user (agent)"], "isController": false}, {"data": [0.95, 500, 1500, "Get_Balance Check"], "isController": false}, {"data": [0.55, 500, 1500, "Post_Create User"], "isController": false}, {"data": [0.9, 500, 1500, "Deposit (agent → customer1)"], "isController": false}, {"data": [0.5, 500, 1500, "create user (Customer1)"], "isController": false}, {"data": [1.0, 500, 1500, "Get_Transaction History"], "isController": false}, {"data": [0.95, 500, 1500, "Post_admin-create-virtual-money"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "send-money-customer2-to-customer1"], "isController": false}, {"data": [0.95, 500, 1500, "Post_commission-create"], "isController": false}, {"data": [0.55, 500, 1500, "Login Request"], "isController": false}, {"data": [0.95, 500, 1500, "Get_User by id"], "isController": false}, {"data": [1.0, 500, 1500, "Get_commission-listing"], "isController": false}, {"data": [0.65, 500, 1500, "create user (merchant)"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 340, 1, 0.29411764705882354, 356.04999999999995, 0, 1681, 194.0, 820.7, 906.8499999999999, 1271.1199999999958, 15.749490457661663, 133.85831936434593, 11.208393407216972], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["customer1 login", 10, 0, 0.0, 720.0, 369, 1172, 733.0, 1156.7, 1172.0, 1172.0, 1.8477457501847745, 1.275738520879527, 1.3569382852919438], "isController": false}, {"data": ["agent login", 10, 0, 0.0, 632.3000000000001, 308, 818, 703.0, 812.7, 818.0, 818.0, 1.5931177314003504, 1.0890453241994582, 1.1777247291699857], "isController": false}, {"data": ["deposit system to agent ", 10, 0, 0.0, 206.9, 72, 621, 113.0, 592.7, 621.0, 621.0, 1.6291951775822744, 0.566081683773216, 1.3094019835451287], "isController": false}, {"data": ["Post_payment-customer-to-merchant", 10, 0, 0.0, 196.5, 125, 349, 170.5, 341.5, 349.0, 349.0, 1.751006828926633, 0.6135363771668709, 1.3628441822798107], "isController": false}, {"data": ["Post_Deposit (AGENT → Customer)", 10, 0, 0.0, 201.29999999999998, 126, 322, 165.0, 320.4, 322.0, 322.0, 1.7863522686673812, 0.7309390630582351, 1.407799102357985], "isController": false}, {"data": ["Get Request", 10, 0, 0.0, 260.9, 159, 562, 198.5, 545.2, 562.0, 562.0, 2.3277467411545625, 186.05379640945063, 1.3934655784450651], "isController": false}, {"data": ["Post_Deposit (System --> Customer)", 10, 0, 0.0, 208.0, 102, 529, 159.5, 516.1, 529.0, 529.0, 1.7895490336435218, 0.7406356254473873, 1.4050756084466713], "isController": false}, {"data": ["merchant login", 10, 0, 0.0, 651.5, 328, 904, 661.5, 902.3, 904.0, 904.0, 1.5328019619865114, 1.058291979613734, 1.1376264561618639], "isController": false}, {"data": ["Post_deposit system to agent", 10, 0, 0.0, 241.1, 147, 700, 164.0, 662.8000000000002, 700.0, 700.0, 1.775883502042266, 0.6173969987568815, 1.383940463505594], "isController": false}, {"data": ["payment-customer1-to-merchant", 10, 0, 0.0, 222.8, 74, 600, 126.5, 589.4000000000001, 600.0, 600.0, 1.3071895424836601, 0.4556015114379085, 1.0518790849673203], "isController": false}, {"data": ["Post_withdraw-customer-to-agent", 10, 0, 0.0, 208.5, 111, 639, 139.5, 607.0000000000001, 639.0, 639.0, 1.77367860943597, 0.5993093738914509, 1.382222197587797], "isController": false}, {"data": ["withdraw-customer1-to-agent", 10, 0, 0.0, 174.7, 65, 530, 98.0, 521.4000000000001, 530.0, 530.0, 1.2971851083149566, 0.4381800087559995, 1.055229682838241], "isController": false}, {"data": ["Get_Search User By email", 10, 0, 0.0, 179.3, 63, 374, 120.5, 369.70000000000005, 374.0, 374.0, 2.2951572182694515, 0.9256835265090658, 1.4613696350700023], "isController": false}, {"data": ["admin login", 10, 0, 0.0, 646.7, 365, 1081, 650.0, 1063.0, 1081.0, 1081.0, 1.5241579027587258, 1.0359510745313214, 1.1073959762231367], "isController": false}, {"data": ["Get_system-virtual-balance", 10, 0, 0.0, 183.2, 98, 396, 141.0, 384.1, 396.0, 396.0, 1.8125793003443902, 0.5805918071415624, 1.3098717600145005], "isController": false}, {"data": ["customer2 login", 10, 0, 0.0, 644.0999999999999, 286, 953, 681.5, 939.9000000000001, 953.0, 953.0, 1.721170395869191, 1.188347138554217, 1.2639845094664373], "isController": false}, {"data": ["Get_Transaction Details", 10, 0, 0.0, 156.89999999999998, 79, 262, 138.5, 260.3, 262.0, 262.0, 1.8198362147406735, 1.091190855323021, 1.2351427434030937], "isController": false}, {"data": ["create user (customer2)", 10, 0, 0.0, 738.5, 616, 837, 754.5, 834.4, 837.0, 837.0, 1.6630633627141194, 0.8705097289206719, 1.450308186429403], "isController": false}, {"data": ["Post_send-money-customer-to-customer", 10, 0, 0.0, 191.7, 131, 509, 156.0, 478.5000000000001, 509.0, 509.0, 1.751927119831815, 0.6073575464260687, 1.3669821960406447], "isController": false}, {"data": ["create user (agent)", 10, 0, 0.0, 745.0, 548, 933, 737.5, 930.0, 933.0, 933.0, 1.7403411068569439, 0.9146988122171945, 1.5214388270100938], "isController": false}, {"data": ["Get_Balance Check", 10, 0, 0.0, 236.5, 93, 678, 169.0, 659.5, 678.0, 678.0, 1.877581674802854, 0.6215822146075854, 1.281669522155464], "isController": false}, {"data": ["Post_Create User", 10, 0, 0.0, 721.0999999999999, 428, 928, 726.5, 924.0, 928.0, 928.0, 1.7869907076483202, 0.9179268674052895, 1.5391853556111508], "isController": false}, {"data": ["Deposit (agent → customer1)", 10, 1, 10.0, 274.3, 72, 1681, 100.0, 1538.4000000000005, 1681.0, 1681.0, 1.2934937265554263, 239.60619684549218, 1.0635954274996766], "isController": false}, {"data": ["create user (Customer1)", 10, 0, 0.0, 835.2, 726, 986, 809.0, 983.8, 986.0, 986.0, 1.6113438607798904, 0.8434378021269738, 1.4052051442152755], "isController": false}, {"data": ["Get_Transaction History", 10, 0, 0.0, 208.5, 115, 418, 155.0, 407.50000000000006, 418.0, 418.0, 1.863932898415657, 0.5624563140726934, 1.3014765843429636], "isController": false}, {"data": ["Post_admin-create-virtual-money", 10, 0, 0.0, 184.00000000000003, 99, 512, 153.0, 480.3000000000001, 512.0, 512.0, 1.7853954650955186, 0.6154732413854669, 1.3948402071058739], "isController": false}, {"data": ["Debug Sampler", 20, 0, 0.0, 0.8999999999999999, 0, 4, 1.0, 1.0, 3.849999999999998, 4.0, 2.2639800769753227, 6.839364422968078, 0.0], "isController": false}, {"data": ["send-money-customer2-to-customer1", 10, 0, 0.0, 108.7, 65, 205, 96.0, 199.40000000000003, 205.0, 205.0, 1.3008976193573565, 0.4483269237023546, 1.0493568687394301], "isController": false}, {"data": ["Post_commission-create", 10, 0, 0.0, 211.30000000000004, 122, 660, 163.0, 613.3000000000002, 660.0, 660.0, 1.7708517797060386, 0.8629443731184699, 1.485509451921374], "isController": false}, {"data": ["Login Request", 10, 0, 0.0, 824.4, 457, 1340, 831.0, 1308.6000000000001, 1340.0, 1340.0, 1.8910741301059002, 1.285339447806354, 0.795950146558245], "isController": false}, {"data": ["Get_User by id", 10, 0, 0.0, 159.6, 62, 565, 116.0, 526.2000000000002, 565.0, 565.0, 2.077274615704196, 1.2638106304528458, 1.2840965153718322], "isController": false}, {"data": ["Get_commission-listing", 10, 0, 0.0, 187.9, 102, 323, 164.5, 319.1, 323.0, 323.0, 1.7577781683951486, 7.11522510546669, 1.299451243628054], "isController": false}, {"data": ["create user (merchant)", 10, 0, 0.0, 742.5, 333, 1351, 705.5, 1315.7, 1351.0, 1351.0, 1.904036557501904, 1.01746953541508, 1.6812791555597868], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 1, 100.0, 0.29411764705882354], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 340, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Deposit (agent → customer1)", 10, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
