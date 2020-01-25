import React, {Component} from "react";
import {withStyles} from '@material-ui/core/styles';
import {render} from "react-dom";
import {Chart} from "react-google-charts";
import {getValueByDate} from "../index";

class Sankey extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dates: [],
            data: [],
        };
        this.collectDatesForTimeline = this.collectDatesForTimeline.bind(this);
    }

    componentDidMount() {
        this.props.getSearchResults("OrgChart-Level1:");
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.searchResults !== this.props.searchResults) {
            this.collectDatesForTimeline();
        }
        if (prevProps.searchKey !== this.props.searchKey) {
            this.collectDatesForTimeline();
        }
    }

    collectDatesForTimeline() {
        const {searchResults} = this.props;

        let dates = [], data = [['From', 'To', 'Weight']];

        function addDateToTimeline(item) {
            let newDate = item.date;
            if (!dates.includes(newDate)) {
                dates.push(newDate);
            }
        }

        if (searchResults) {
            for (let i = 0; i < searchResults.length; i++) {
                let entity = searchResults[i];
                entity.attributes.parent.forEach(addDateToTimeline);
            }
            dates.sort();
            for (let j = 0; j < searchResults.length; j++) {
                let entity = searchResults[j];
                let from = getValueByDate(entity.attributes.parent, dates[0]);
                let to = getValueByDate(entity.attributes.parent, dates[1]);
                let toto = getValueByDate(entity.attributes.parent, dates[2]);
                if (from && to && to) {
                    data.push([from + dates[0], to + dates[1], 1]);
                    data.push([to + dates[1], toto + dates[2], 1]);
                }
            }
        }

        console.log(data);

        this.setState({dates: dates, data: data});
    }

    render() {
        const {searchResults} = this.props;
        const {dates, data} = this.state;
        return (
            <Chart
                style={{margin: 'auto', marginTop: '100px'}}
                width={'98%'}
                height={'8000px'}
                chartType="Sankey"
                loader={<div>Loading Chart</div>}
                data={data}
                rootProps={{'data-testid': '1'}}
            />
        )

    }
}

export default Sankey;
