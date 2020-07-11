import React, { Component } from 'react';

class Dropdown extends Component {
    constructor(props) {
        super(props);

        this.selectedItem = this.props.currentName ? this.props.currentName : "Exercize";
        this.onInputChange = this.onInputChange.bind(this);

        this.list = this.filterList(this.props.list);
    }

    state = {
        isToggleOpen: false,
        inputValue: "",
        dropdownDate: null,

        error: null
    }

    openToggle = () => this.setState({ isToggleOpen: !this.state.isToggleOpen });

    componentDidMount = () => {
        if (this.selectedItem !== "Exercize") this.changeExersize(this.selectedItem);
    }

    changeExersize = exersize => {
        this.selectedItem = exersize;

        this.setState({ isToggleOpen: false });

        if (exersize === "Інше") exersize = this.state.inputValue;
        this.props.exersizeName(this.selectedItem);
    };

    handleSubmitAnother = () => {
        this.setState({ isToggleOpen: false });
        let { length } = this.state.inputValue;
        if (length > 32) return alert("Too long exercize name")//this.setState({ error: "Too long exercize name." });
        else if (length === 0) return this.selectedItem = "Exercize";

        this.selectedItem = this.state.inputValue;
        this.props.exersizeName(this.selectedItem);
    }

    onInputChange = event => {
        const inputValue = event.target.value;

        this.props.exersizeName(inputValue);

        this.setState({ inputValue });
    }

    filterList = list => {
        let exercizes = ["Віджимання", "Підтягування"];
        let filteredArray;

        if (list) {
            for (let i of list) {
                exercizes.push(i.exersize_name);
            }
            filteredArray = [...new Set(exercizes)];
        }

        return filteredArray;
    }

    render() {
        const menuClass = `dropdown-menu${this.state.isToggleOpen ? " show" : ""}`;
        const anotherClass = this.selectedItem === "Інше" ? "flex" : "none";
        const show = this.selectedItem === "Інше" ? "none" : "";

        const iconClass = {
            position: "absolute",
            right: "6px",
            padding: "7px",
            transform: "translateY(-50 %)"
        }

        return (
            <div>
                <div className="dropdown" onClick={this.openToggle} style={{ display: "flex" }}>
                    <div style={{ display: show }}>
                        <button
                            className="btn dropdown-toggle btn-outline-primary"
                            type="button"
                            id="dropdownMenuButton"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                        > {this.selectedItem} </button>

                        <div className={menuClass} aria-labelledby="dropdownMenuButton">
                            {this.list.map(elem => {
                                return (
                                    <button key={elem} className="dropdown-item" onClick={() => this.changeExersize(elem)}>
                                        {elem}
                                    </button>
                                );
                            })}


                            <div className="dropdown-divider"></div>

                            <button className="dropdown-item" onClick={() => this.changeExersize("Інше")}>
                                Iнше
                            </button>

                        </div>
                    </div>

                    <div className="input-group" style={{ display: anotherClass }}>
                        <div style={{ display: "flex", width: "200px" }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Інше"
                                onChange={this.onInputChange}
                                value={this.state.inputValue}
                            />
                            <div style={iconClass}>
                                <i
                                    style={{ cursor: "pointer" }}
                                    onClick={this.handleSubmitAnother}
                                    className="fas fa-check"
                                ></i>
                            </div>

                            <div className="invalid-feedback">
                                Please choose a username.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dropdown;