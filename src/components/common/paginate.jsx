import React, { Component } from 'react';

class Paginate extends Component {
    state = {
        pages: null,
        current_page: this.props.currentPage,

        current_props: null,

        p: [this.props.currentPage, this.props.currentPage + 1, this.props.currentPage + 2]
    }

    getData = () => {
        const { list, itemsOnPage, full_list, show_full_list } = this.props;

        const items = show_full_list ? full_list.length : list.length;
        const pages = Math.ceil(items / itemsOnPage);
        this.setState({ pages, current_props: this.props });
    }

    changePage = page => {
        if (page === "start") {
            // handle << icon press

            const p = [1, 2, 3];

            this.setState({ p });
        } else if (page === "end") {
            // handle >> icon press
            const p = [this.state.pages - 2, this.state.pages - 1, this.state.pages];

            this.setState({ p });
        } else if (page === "-1") {
            // handle < icon press
            let p = [this.state.p[0] - 3, this.state.p[1] - 3, this.state.p[2] - 3];

            for (let page of p) {
                if (page <= 0) {
                    p = p.map(elem => elem + 1);
                }
            }

            this.setState({ p });
        } else if (page === "+1") {
            // handle > icon press
            let p = [this.state.p[0] + 3, this.state.p[1] + 3, this.state.p[2] + 3];

            for (let page of p) {
                if (page > this.state.pages) {
                    p = p.map(elem => elem - 1);
                }
            }

            this.setState({ p });
        } else {
            // handle page change

            this.setState({ current_page: page });
            this.props.changePage(page, this.props.show_full_list);
        }
    }

    render() {
        if (this.props !== this.state.current_props) this.getData();
        if (this.state.pages <= 1) return <div></div>;

        let pages = [];
        for (let i = 0; i < this.state.pages; i++) pages[i] = i + 1;

        return (
            <div>
                {
                    this.state.pages <= 5
                        // paginate when 5 or less
                        ? <div className="btn-group mr-2" role="group" aria-label="First group">
                            {
                                pages.map(elem => {
                                    return (
                                        <button key={elem} onClick={() => this.changePage(elem)} type="button" className={this.state.current_page === elem ? "btn btn-primary" : "btn btn-outline-primary"}>
                                            {elem}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        // paginate when 6 or more
                        : <div>
                            <div className="btn-group mr-2" role="group" aria-label="First group">
                                <button onClick={() => this.changePage("start")} type="button" className="btn btn-outline-primary" disabled={this.state.p[0] <= 6}>
                                    <i className="fas fa-angle-double-left"></i> {/* << */}
                                </button>

                                <button onClick={() => this.changePage("-1")} type="button" className="btn btn-outline-primary" disabled={this.state.p[0] < 3}>
                                    <i className="fas fa-angle-left"></i> {/* < */}
                                </button>

                                {
                                    this.state.p.map(elem => {
                                        return (
                                            <button key={elem} onClick={() => this.changePage(elem)} type="button" className={this.state.current_page === elem ? "btn btn-primary" : "btn btn-outline-primary"}>
                                                {elem}
                                            </button>
                                        )
                                    })
                                }

                                <button onClick={() => this.changePage("+1")} type="button" className="btn btn-outline-primary" disabled={this.state.p[2] >= this.state.pages}>
                                    <i className="fas fa-angle-right"></i> {/* > */}
                                </button>

                                <button onClick={() => this.changePage("end")} type="button" className="btn btn-outline-primary" disabled={this.state.p[2] >= this.state.pages - 3}>
                                    <i className="fas fa-angle-double-right"></i> {/* >> */}
                                </button>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default Paginate;