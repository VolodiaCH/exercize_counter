import React, { Component } from 'react';
import LoadingComponent from "../../common/loadingComponent";

class Exercizes extends Component {
    addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);
    render() {
        const { smallScreen } = this.props;
        let timeClass = "done-exersizes-time";
        let nameClass = "done-exersizes-name";
        let timesClass = "done-exersizes-times";
        const row = " row";

        if (smallScreen) {
            timeClass += row;
            nameClass += row;
            timesClass += row;
        }

        return (
            this.props.list
                ? this.props.list.map(elem => {
                    let date = new Date(elem.exersize_time);
                    date = this.addMinutes(date, date.getTimezoneOffset() * -1);

                    const d = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

                    let hours = date.getHours();
                    let minutes = date.getMinutes().toString();
                    hours = hours.toString();

                    if (hours.length === 1) hours = "0" + hours;
                    if (minutes.length === 1) minutes = "0" + minutes;

                    const time = this.props.showDate ? d + " " + hours + ":" + minutes : hours + ":" + minutes;

                    return (
                        <div key={elem.exersize_id}>
                            <hr />
                            <div className="done-exersizes-block">

                                <div>
                                    <span className={timeClass}> {time} </span>
                                    <span className={nameClass}> {elem.exersize_name} </span>
                                    <span className={timesClass}> {elem.exersize_count} раз</span>
                                </div >

                                <div className="icons">
                                    <div className="edit-icon">
                                        <i className="far fa-edit" onClick={() => this.props.editRecord(elem.exersize_id)}></i>
                                    </div>
                                    <div className="delete-icon">
                                        <i className="far fa-trash-alt" onClick={() => this.props.deleteRecord(elem.exersize_id)}></i>
                                    </div>
                                </div>
                            </div >
                        </div >
                    );
                })
                : <LoadingComponent />
        );
    }
}

export default Exercizes;