import React, { Component } from 'react';
import axios from "axios";
import LoadingComponent from "../../common/loadingComponent";

class StatsList extends Component {
    state = {
        stats: null,

        exercizes: [],

        total: {},
        maxInDay: {},
        max: {},

        render: false,

        currentIndex: 0
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;
        axios.get(`${process.env.REACT_APP_API_URL}/records?id=${this.props.id}`)
            .then(res => {
                this.setState({ stats: res.data });
                this.getList();
            })

            .catch(error => this.setState({ error }));
    }

    getList = () => {
        const list = this.state.stats;

        const exercizes = this.filterList(list);

        const total = this.getTotal(list, exercizes);
        const max = this.getMax(list, exercizes);
        const maxInDay = this.getMaxInDay(list, exercizes);

        this.setState({
            exercizes,

            total,
            max,
            maxInDay,

            render: true
        });
    }

    getTotal = (array, names) => {
        let object = {};

        names.forEach(name => {
            let new_array = array.filter(element => element.exersize_name === name);
            let value = 0;

            for (let elem of new_array) value += elem.exersize_count;

            object[name] = value;
        });

        return object
    }

    getMax = (array, names) => {
        let object = {};

        names.forEach(name => {
            let new_array = array.filter(element => element.exersize_name === name);
            let value = Math.max.apply(Math, new_array.map(elem => elem.exersize_count));

            object[name] = value;
        });

        return object
    }

    getMaxInDay = (array, names) => {
        let object = {};

        names.forEach(name => {
            let new_array = array.filter(element => element.exersize_name === name);

            let dates = [];
            new_array.forEach(elem => {
                const date = new Date(elem.exersize_time).getDate();
                if (!dates.find(el => el === date)) dates.push(date);
            });

            let value = 0;
            dates.forEach(elem => {
                let v = 0;
                let values = new_array.filter(date => elem === new Date(date.exersize_time).getDate());

                for (let e of values) v += e.exersize_count;

                if (v > value) value = v
            });

            object[name] = value;
        });

        return object
    }

    filterList = list => {
        let exercizes = [];
        let filteredArray;

        if (list) {
            for (let i of list) {
                exercizes.push(i.exersize_name);
            }
            filteredArray = [...new Set(exercizes)];
        }

        return filteredArray;
    }

    changeIndex = event => this.setState({ currentIndex: event.target.value });

    render() {
        const whiteHr = { height: "1px", backgroundColor: "gray", border: "none" };
        const hrStyle = this.props.theme === "dark" ? whiteHr : {};

        if (!this.state.render) {
            return (
                <div>
                    <hr style={{ hrStyle }} />
                    <LoadingComponent />
                </div>
            )
        } else if (this.state.exercizes.length === 0) {
            return (
                <div>
                    {
                        this.props.id === parseInt(localStorage.id)
                            ? <h4 style={{ color: "gray" }}> You have not done any exercizes. </h4>
                            : <h4 style={{ color: "gray" }}> This user have not done any exercizes. </h4>
                    }
                </div>
            )
        }

        const exercize = this.state.exercizes[this.state.currentIndex];

        return (
            <div>
                <hr style={hrStyle} />
                <div style={{ textAlign: this.props.smallScreen ? "center" : "" }}>
                    <h4 style={{ color: this.props.theme === "dark" ? "white" : "" }}> {exercize} </h4>

                    <span style={{ color: this.props.theme === "dark" ? "white" : "" }}>Загалом виконано: {this.state.total[exercize]} раз.</span>
                    <br />
                    <span style={{ color: this.props.theme === "dark" ? "white" : "" }}>Максимально за захід: {this.state.max[exercize]} раз.</span>
                    <br />
                    <span style={{ color: this.props.theme === "dark" ? "white" : "" }}>Максимально за день: {this.state.maxInDay[exercize]} раз.</span>

                    <input
                        type="range"
                        className="custom-range"
                        style={{
                            display: this.state.exercizes.length === 1 ? "none" : ""
                        }}

                        min="0"
                        max={this.state.exercizes.length - 1}
                        step="1"

                        value={this.state.currentIndex}
                        onChange={this.changeIndex}
                    />
                    <hr style={hrStyle} />
                </div>
            </div>
        );
    }
}

export default StatsList;