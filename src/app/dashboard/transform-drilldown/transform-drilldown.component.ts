import { data } from 'jquery';
import { MonitorService } from './../../services/monitor.service';
import { ErrorDetailsService } from './../../services/error-details.service';
import { Component, OnInit, NgZone, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-transform-drilldown',
    templateUrl: './transform-drilldown.component.html',
    styleUrls: ['./transform-drilldown.component.css']
})
export class TransformDrilldownComponent implements OnInit {
    successCount: number;
    failCount: number = 20;
    constructor(private zone: NgZone, private monitorservice: MonitorService) {

    }

    ngOnInit(): void {
        this.getTransformSuccessCount();

    }

    chartInstance: any = {};

    // Callback to get chart instance
    initialized(e) {
        this.chartInstance = e.chart; // Save it for further use

        // Configure Drilldown attributes 
        // See this : https://www.fusioncharts.com/dev/api/fusioncharts/fusioncharts-methods#configureLink
        this.chartInstance.configureLink([
            {
                type: "column3d",
                overlayButton: {
                    message: 'Back',
                    fontColor: '880000',
                    bgColor: 'FFEEEE',
                    borderColor: '660000'
                }
            }, { type: 'bar3d' }
        ]);
    }

    dataSource = {
        "chart": {
            "caption": "Transformed Objects",
            "captionFontColor": "#4b4276",
            "captionFont": "Callibri",
            "subcaption": "",
            "xaxisname": "",
            "yaxisname": "",
            "numberprefix": "",
            "theme": "fusion",
            "paletteColors": "#0dd63f,#c73535",
            "rotateValues": "0"
        },
        "data": [{
            "label": "Successed Objects",
            "value": this.successCount,
            "link": "newchart-xml-transformedObjects"
        },
        {
            "label": "Failed Objects",
            "value": this.failCount,
            "link": "newchart-xml-failedObjectsTypes"
        }
        ],
        "linkeddata": [{
            "id": "transformedObjects",
            "linkedchart": {
                "chart": {
                    "caption": "Type specific Transformed Objects",
                    "captionFontColor": "#4b4276",
                    "captionFont": "Callibri",
                    "subcaption": "",
                    "numberprefix": "",
                    "theme": "fusion",
                    "rotateValues": "0",
                    "plottooltext": "$label, $dataValue",
                    "paletteColors": "#5AA454, #FFC533,#a8385d, #7aa3e5",
                },
                "data": [{
                    "label": "Part",
                    "value": "157"
                }, {
                    "label": "Procedure",
                    "value": "172"
                }, {
                    "label": "Tool",
                    "value": "206"
                }, {
                    "label": "Nut",
                    "value": "275"
                }]
            }
        },
        {
            "id": "failedObjectsTypes",
            "linkedchart": {
                "chart": {
                    "caption": "Type specific failed Transformed Objects",
                    "subcaption": "",
                    "captionFontColor": "#4b4276",
                    "captionFont": "Callibri",
                    "numberprefix": "",
                    "theme": "fusion",
                    "plottooltext": "$label, $dataValue",
                    "paletteColors": "#5AA454, #FFC533,#a8385d, #7aa3e5",
                },
                "data": [{
                    "label": "Part",
                    "value": "157",
                    "link": "newchart-xml-failedObjects"
                },
                {
                    "label": "Procedure",
                    "value": "172",
                    "link": "newchart-xml-failedObjects"
                },
                {
                    "label": "Tool",
                    "value": "206",
                    "link": "newchart-xml-failedObjects"
                },
                {
                    "label": "Nut",
                    "value": "275",
                    "link": "newchart-xml-failedObjects"
                }],
                "linkeddata": [
                    {
                        "id": "failedObjects",
                        "linkedchart": {
                            "chart": {
                                "caption": "Error/Exceptions",
                                "subcaption": "",
                                "captionFontColor": "#4b4276",
                                "captionFont": "Callibri",
                                "numberprefix": "",
                                "theme": "fusion",
                                "plottooltext": "$label, $dataValue",
                                "paletteColors": "#5AA454, #FFC533,#a8385d, #7aa3e5",
                            },
                            "data": [{
                                "label": "Internal Server Error",
                                "value": "102",
                            },
                            {
                                "label": "Bad Record Exception",
                                "value": "142"
                            },
                            {
                                "label": "Null Value Exception",
                                "value": "187"
                            }
                            ]
                        }
                    }
                ]
            }
        }
        ]
    };

    getTransformSuccessCount() {
        this.monitorservice.getSuccessObjectCount().subscribe(data => {
            console.log("data.." + data);
            this.successCount = data
        });
        console.log("this.successCount.." + this.successCount);
    }
}
