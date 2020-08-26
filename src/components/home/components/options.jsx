import React, { Component } from 'react';

class Options extends Component {
    state = {
        option: null,

        challengeToggleOpen: false,
        exercizePlanToggleOpen: false
    }

    choseOption = option => {
        this.setState({ option, toggleOpen: false });
        this.props.option(option);
    }

    openChallengeToggle = () => this.setState({ challengeToggleOpen: !this.state.challengeToggleOpen });
    openExercizePlanToggle = () => this.setState({ exercizePlanToggleOpen: !this.state.exercizePlanToggleOpen });

    render() {
        const smallScreen = this.props.smallScreen;
        const styles = {
            buttons: {
                constainer: {
                    display: smallScreen ? "" : "flex",
                    width: smallScreen ? "100%" : ""
                },
                button: {
                    paddingLeft: smallScreen ? "0px" : "10px",
                    paddingTop: smallScreen ? "10px" : "0px"
                }
            }
        }

        return (
            <div className={smallScreen ? "btn-group-vertical" : "btn-group"} role="group" style={styles.buttons.constainer}>
                {
                    this.state.option === "New exercize"
                        ? <button onClick={() => this.choseOption(null)} className="btn btn-secondary">New record</button>
                        : <button onClick={() => this.choseOption("New exercize")} className="btn btn-outline-secondary">New record</button>
                }

                <div className="btn-group" role="group">
                    <button
                        id="btnGroupDrop1"
                        type="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"

                        onClick={this.openChallengeToggle}
                        className={
                            this.state.challengeToggleOpen
                                ? "btn btn-secondary dropdown-toggle"
                                : "btn btn-outline-secondary dropdown-toggle"
                        }
                    > Challenges </button>

                    <div className={this.state.challengeToggleOpen ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="btnGroupDrop1">
                        <button onClick={() => this.choseOption("New challenge")} className="dropdown-item">Create challenge</button>
                        <button onClick={() => this.choseOption("Accept challenge")} className="dropdown-item">Accept challenge</button>
                    </div>
                </div>

                {/* <div className="btn-group" role="group">
                    <button
                        id="btnGroupDrop1"
                        type="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"

                        onClick={this.openExercizePlanToggle}
                        className={
                            this.state.exercizePlanToggleOpen
                                ? "btn btn-secondary dropdown-toggle"
                                : "btn btn-outline-secondary dropdown-toggle"
                        }
                    > Exercize plan </button>

                    <div className={this.state.exercizePlanToggleOpen ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="btnGroupDrop1">
                        <button onClick={() => this.choseOption("Edit exercize plan")} className="dropdown-item">Edit exercize plan</button>
                        <button onClick={() => this.choseOption("Todays exercize plan progress")} className="dropdown-item">Todays exercize plan progress</button>
                    </div>
                </div> */}

                {
                    this.state.option === "Show challenge progress"
                        ? <button onClick={() => this.choseOption(null)} className="btn btn-outline-secondary">Hide challenge progress</button>
                        : <button onClick={() => this.choseOption("Show challenge progress")} className="btn btn-outline-secondary">Show challenge progress</button>
                }

                {
                    this.state.option === "Show exercizes list for all time"
                        ? <button onClick={() => this.choseOption(null)} className="btn btn-outline-secondary">Show normal list</button>
                        : <button onClick={() => this.choseOption("Show exercizes list for all time")} className="btn btn-outline-secondary">Show exercizes list for all time</button>
                }

                {
                    this.state.option === "Show stats for today"
                        ? <button onClick={() => this.choseOption(null)} className="btn btn-outline-secondary">Hide stats for today</button>
                        : <button onClick={() => this.choseOption("Show stats for today")} className="btn btn-outline-secondary">Show stats for today</button>
                }
            </div>
        );
    }
}

export default Options;