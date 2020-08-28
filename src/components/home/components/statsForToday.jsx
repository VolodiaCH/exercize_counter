import React, { Component } from 'react';
import LoadingComponent from "../../common/loadingComponent";

class TodaysStats extends Component {
    state = {
        exercizes_list: null,
        exercizes_names: null,
        total: null,
        max: null
    }

    componentDidMount = () => {
        const list = this.props.list;

        const now = new Date();

        const todayDate = now.getDate();
        const todayMounth = now.getMonth();
        const todayYear = now.getFullYear();

        const exercizes_list = list.filter(elem => {
            const exercizeDate = new Date(elem.exersize_time);

            const elemDate = exercizeDate.getDate();
            const elemMounth = exercizeDate.getMonth();
            const elemYear = exercizeDate.getFullYear();

            return todayDate === elemDate && todayMounth === elemMounth && todayYear === elemYear
        });

        let exercizes_names = [];
        exercizes_list.forEach(elem => {
            const exercize_name = elem.exersize_name;
            if (exercizes_names.indexOf(exercize_name) === -1) exercizes_names.push(exercize_name);
        });

        const total = this.getTotal(exercizes_list, exercizes_names);
        const max = this.getMax(exercizes_list, exercizes_names);

        this.setState({ exercizes_list, exercizes_names, total, max });
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

    render() {
        if (!this.state.exercizes_list || !this.state.exercizes_names) return <LoadingComponent />
        else if (this.state.exercizes_names.length === 0) {
            return (
                <div>
                    <h4 style={{ color: "gray" }}> You have not done any exercizes today. </h4>
                </div>
            )
        }

        const { smallScreen } = this.props;

        return (
            <div style={{ display: smallScreen ? "" : "flex" }}>
                {
                    this.state.exercizes_names.map((exercize, idx) => {
                        return (
                            <div
                                style={{
                                    paddingLeft: idx === 0
                                        ? smallScreen ? "0px" : "10px"
                                        : smallScreen ? "0px" : "20px",
                                    paddingTop: idx === 0
                                        ? "0px"
                                        : smallScreen ? "10px" : "0px"
                                }}
                                key={idx}
                            >
                                <h4 style={{ color: this.props.theme === "dark" ? "white" : "" }}> {exercize} </h4>

                                <span style={{ color: this.props.theme === "dark" ? "white" : "" }}>Загалом виконано: {this.state.total[exercize]} раз.</span>
                                <br />
                                <span style={{ color: this.props.theme === "dark" ? "white" : "" }}>Максимально за захід: {this.state.max[exercize]} раз.</span>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

export default TodaysStats;