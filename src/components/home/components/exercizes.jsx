import React, { Component } from 'react';
import LoadingComponent from "../../common/loadingComponent";

class Exercizes extends Component {
    addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);
    render() {
        const { smallScreen } = this.props;
        let timeClass = "done-exersizes-time";
        let nameClass = this.props.theme === "dark" ? "done-exersizes-name-dark-theme" : "done-exersizes-name";
        let timesClass = this.props.theme === "dark" ? "done-exersizes-times-dark-theme" : "done-exersizes-times";

        const row = " row";

        if (smallScreen) {
            timeClass += row;
            nameClass += row;
            timesClass += row;
        }

        const whiteHr = { height: "1px", backgroundColor: "gray", border: "none" };

        return (
            this.props.list
                ? this.props.list.map(elem => {
                    let date = new Date(elem.exersize_time);
                    // date = this.addMinutes(date, new Date().getTimezoneOffset() * -2); work
                    date = this.addMinutes(date, new Date().getTimezoneOffset() * -1);

                    const d = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();

                    let hours = date.getHours().toString();
                    let minutes = date.getMinutes().toString();

                    if (hours.length === 1) hours = "0" + hours;
                    if (minutes.length === 1) minutes = "0" + minutes;

                    const time = this.props.showDate ? d + " " + hours + ":" + minutes : hours + ":" + minutes;

                    return (
                        <div key={elem.exersize_id}>
                            <hr style={this.props.theme === "dark" ? whiteHr : {}} />
                            <div className="done-exersizes-block">

                                <div>
                                    <span className={timeClass}> {time} </span>
                                    <span className={nameClass}> {elem.exersize_name} </span>
                                    <span className={timesClass}> {elem.exersize_count} раз</span>
                                </div>

                                <div className="icons">
                                    <div style={{ display: this.props.showDate ? "none" : "" }} className="edit-icon">
                                        <i style={{ color: this.props.theme === "dark" ? "gray" : "black" }} className="far fa-edit" onClick={() => this.props.editRecord(elem.exersize_id)}></i>
                                    </div>
                                    <div className="delete-icon">
                                        <i style={{ color: this.props.theme === "dark" ? "gray" : "black" }} className="far fa-trash-alt" onClick={() => this.props.deleteRecord(elem.exersize_id)}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
                : <LoadingComponent />
        );
    }
}

export default Exercizes;