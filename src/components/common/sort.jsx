import React, { Component } from 'react';

class Sort extends Component {
    state = {
        searchDropdownOpen: false,
        dropdownOpen: false,

        searchInputValue: "",
        dropdownValue: "Sort by",
        searchDropdownValue: "Search by"
    }

    openSearchDropdown = () => this.setState({ searchDropdownOpen: !this.state.searchDropdownOpen });
    openDropdown = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });

    onInputChange = event => this.setState({ searchInputValue: event.target.value });

    chooseSortByOption = option => this.setState({ dropdownValue: option, dropdownOpen: false });
    chooseSearchByOption = option => this.setState({ searchDropdownValue: option, searchDropdownOpen: false });

    handleSubmit = () => {
        const values = {
            sortBy: this.state.dropdownValue,
            searchBy: this.state.searchDropdownValue,
            search: this.state.searchInputValue
        }

        this.props.handleSort(values);
    }

    getStyles = smallScreen => {
        return {
            mainContainer: {
                display: "flex",
                justifyContent: "space-between"
            },
            inputs: {
                display: smallScreen ? "" : "flex"
            },
            searchInput: {
                maxWidth: "300px",
                paddingLeft: smallScreen ? "0px" : "15px",
                paddingTop: smallScreen ? "10px" : "0px",
                display: this.props.searchBy === null ? "none" : ""
            },
            button: {
                float: "right"
            }
        }
    }

    render() {
        // styles
        const { smallScreen } = this.props;
        const styles = this.getStyles(smallScreen);

        return (
            <div>
                <div style={styles.mainContainer}>
                    <div style={styles.inputs}>
                        {/* first dropdown */}
                        <div className="dropdown">
                            <button
                                onClick={this.openDropdown}
                                className="btn btn-outline-primary dropdown-toggle"
                                type="button"
                                id="dropdownMenu2"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            > {this.state.dropdownValue} </button>

                            <div className={this.state.dropdownOpen ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="dropdownMenu2">
                                {
                                    this.props.sortBy.map(elem => {
                                        return (
                                            <button key={elem} className="dropdown-item" type="button" onClick={() => this.chooseSortByOption(elem)}>
                                                {elem}
                                            </button>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        {/* input + dropdown (search) */}
                        <div style={styles.searchInput} className="input-group">
                            {/* input */}
                            <input
                                placeholder="Search"
                                type="text"
                                className="form-control"
                                aria-label="Text input with dropdown button"

                                value={this.state.searchInputValue}
                                onChange={this.onInputChange}
                            />

                            {/* dropdown */}
                            <div className="input-group-append">
                                <button
                                    onClick={this.openSearchDropdown}
                                    className="btn btn-outline-secondary dropdown-toggle"
                                    type="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                > {this.state.searchDropdownValue} </button>

                                <div className={this.state.searchDropdownOpen ? "dropdown-menu show dropdown-menu-right" : "dropdown-menu dropdown-menu-right"}>
                                    {
                                        this.props.searchBy
                                            ? this.props.searchBy.map(elem => {
                                                return (
                                                    <button key={elem} className="dropdown-item" type="button" onClick={() => this.chooseSearchByOption(elem)}>
                                                        {elem}
                                                    </button>
                                                )
                                            })
                                            : <div></div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* button */}
                    <div style={styles.button}>
                        <button className="btn btn-primary" onClick={this.handleSubmit}> Search </button>
                    </div>
                </div>
            </div >
        );
    }
}

export default Sort;