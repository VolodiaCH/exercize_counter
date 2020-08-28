import ChallengeProgress from "./components/challengeProgress";
import AcceptChallenge from "./components/acceptChallenge";
import NewChallenge from "./components/newChallenge";
import EditExercize from "./components/editExercize";
import NewExercizes from "./components/newExercize";
import TodaysStats from "./components/statsForToday";
import Exercizes from "./components/exercizes";
import Paginate from "../common/paginate";
import SnackBar from "../common/snackbar";
import Options from "./components/options";
import React, { Component } from 'react';
import Loading from "../common/loading";
import axios from "axios";
import Alert from "../common/alert";
import Error from "../common/error";
import "./home.css";

class Home extends Component {
    state = {
        exersizesList: null,
        fullList: null,
        page: null,

        showFullList: false,

        currentPage: 1,
        itemsOnPage: 7,

        screenWidth: null,
        screenHeight: null,

        alert: {
            title: "",
            message: "",

            challenge_id: null,

            show: false
        },

        snackbar: {
            message: "",
            status: "hide"
        },

        edit: null,
        option: null,
        error: null
    };


    // get screen size
    componentWillUnmount = () => window.removeEventListener('resize', this.updateWindowDimensions);
    updateWindowDimensions = () => this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });

    componentDidMount = async () => {
        // redirect to /login if unauthorized
        if (localStorage.length === 1) window.location = "/login";

        // resize listener
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // get all records for authorised user
        await axios.get(`${process.env.REACT_APP_API_URL}/records?id=${localStorage.id}`)
            .then(res => {
                const now = new Date();

                const todayDate = now.getDate();
                const todayMounth = now.getMonth();
                const todayYear = now.getFullYear();

                // filter exercizes list by date 
                const exersizesList = res.data.filter(elem => {
                    const exercizeDate = new Date(elem.exersize_time);

                    const elemDate = exercizeDate.getDate();
                    const elemMounth = exercizeDate.getMonth();
                    const elemYear = exercizeDate.getFullYear();

                    return todayDate === elemDate && todayMounth === elemMounth && todayYear === elemYear
                });

                this.setState({ exersizesList, fullList: res.data });

                // render page if it not rendered before
                if (!this.state.page) this.changePage(1, this.state.showFullList);
            })
            .catch(error => this.setState({ error }));
    }

    handleAlertClose = () => this.setState({ alert: { title: "", message: "", show: false } });

    chooseOption = option => this.setState({ option });

    handleDelete = recordId => {
        // create alert
        const alert = {
            title: `You realy want to delete this record?`,
            message: null,

            challenge_id: recordId,

            show: true
        }

        this.setState({ alert });
    }

    deleteRecord = recordId => {
        // if alert agree

        // close alert 
        this.handleAlertClose();

        // set authorization header with JWT token
        axios.defaults.headers.common['Authorization'] = `${localStorage.token}`;

        // delete record from `counter` DB
        axios.delete(`${process.env.REACT_APP_API_URL}/deleteRecord?id=${recordId}`)
            .then(res => {
                // creating new exercizes list without deleted record
                let exersizesList = this.state.exersizesList.filter(record => recordId !== record.exersize_id);
                let fullList = this.state.fullList.filter(record => recordId !== record.exersize_id);

                this.setState({ exersizesList, fullList });
                this.changePage(this.state.currentPage, false);
            })
            .catch(error => this.setState({ error }));
    }

    addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

    editRecord = recordId => {
        // get choosed exercize for edit
        const exercize = this.state.exersizesList.filter(elem => elem.exersize_id === recordId)[0];
        this.setState({ edit: exercize });
    }

    createRecord = record => { // imitation
        let { exersizesList, fullList } = this.state;

        // const exercizeTime = this.addMinutes(record.time, new Date().getTimezoneOffset()); work
        const exercizeTime = this.addMinutes(record.time, new Date().getTimezoneOffset());
        // const exercizeTime = record.time;
        console.log("now (Home component):", exercizeTime);

        // new record values
        const newRecord = {
            user_id: record.user_id,
            exersize_name: record.exersizeName,
            exersize_time: exercizeTime,
            // exersize_time: record.time,
            exersize_count: record.times,
            exersize_id: record.id
        }

        // add new record to lists
        exersizesList.push(newRecord);
        fullList.push(newRecord);

        this.setState({ exersizesList, fullList });
        this.changePage(this.state.currentPage, false);
    }

    hideOption = () => this.setState({ option: null });

    renderOption = () => {
        const { exersizesList, screenWidth } = this.state;
        const smallScreen = screenWidth < 450;

        // return choosed option
        if (this.state.edit) return <EditExercize exercize={this.state.edit} list={exersizesList} smallScreen={smallScreen} theme={this.props.theme} />
        else if (this.state.option === "New exercize") return <NewExercizes smallScreen={smallScreen} list={this.state.fullList} createRecord={this.createRecord} theme={this.props.theme} />
        else if (this.state.option === "New challenge") return <NewChallenge smallScreen={screenWidth < 800} list={exersizesList} theme={this.props.theme} />
        else if (this.state.option === "Show challenge progress") return <ChallengeProgress smallScreen={smallScreen} list={this.state.fullList} theme={this.props.theme} />
        else if (this.state.option === "Show stats for today") return <TodaysStats smallScreen={smallScreen} list={this.state.fullList} theme={this.props.theme} />
        else return null
    }

    showFullList = show => {
        if (this.state.showFullList !== show) {
            this.setState({ showFullList: show });
            this.changePage(1, show);
        }
    }

    handleAcceptChallenge = challenge_name => {
        // show challenge progress
        this.setState({ option: "Show challenge progress" });

        // create success snackbar
        const snackbar = {
            message: `You started challenge "${challenge_name}"`,
            status: "success"
        }

        this.setState({ snackbar });
    }

    changePage = (p, fullList) => { // (render)
        let page = [];

        const list = fullList ? this.state.fullList : this.state.exersizesList;
        const currentPage = p - 1;

        const startIndex = currentPage * this.state.itemsOnPage;
        const endIndex = startIndex + this.state.itemsOnPage;

        for (let index = startIndex; index < endIndex; index++) {
            if (list[index]) page.push(list[index]);
        }

        this.setState({ currentPage: p, page });
    }

    render() {
        const smallScreen = this.state.screenWidth < 450;

        if (this.state.error) return <Error message={this.state.error.toString()} /> // handle error
        else if (!this.state.exersizesList) return <Loading /> // if data !recived show loading spiner
        else if (this.state.option === "Accept challenge") return <AcceptChallenge smallScreen={smallScreen} handleAcceptChallenge={this.handleAcceptChallenge} theme={this.props.theme} /> // display accept challenge page if it need

        // display full list if it need
        if (this.state.option === "Show exercizes list for all time") this.showFullList(true);
        else this.showFullList(false);

        const whiteHr = { height: "1px", backgroundColor: "gray", border: "none" };

        return (
            <div style={{ paddingTop: "25px" }}>
                <SnackBar
                    message={this.state.snackbar.message}
                    status={this.state.snackbar.status}
                />

                <Alert
                    message={this.state.alert.message}
                    title={this.state.alert.title}

                    challenge_id={this.state.alert.challenge_id}

                    show={this.state.alert.show}

                    handleAgree={this.deleteRecord}
                    handleClose={this.handleAlertClose}
                />

                {/* option menu */}
                <div>
                    <Options smallScreen={smallScreen} option={this.chooseOption} />
                </div>

                {/* render choosed option */}
                <div style={{ display: this.renderOption() ? "" : "none" }}>
                    <hr style={this.props.theme === "dark" ? whiteHr : {}} />
                    {this.renderOption()}
                </div>

                {/* exercizes list (component) */}
                <div>
                    {
                        this.state.page && this.state.page.length > 0
                            ? <Exercizes
                                list={this.state.page}
                                deleteRecord={this.handleDelete}
                                editRecord={this.editRecord}
                                smallScreen={smallScreen}
                                showDate={this.state.showFullList}

                                theme={this.props.theme}
                            />
                            : <div>
                                <hr style={this.props.theme === "dark" ? whiteHr : ""} />
                                <h4 style={{ color: "gray" }}> You haven't done any exercizes today. </h4>
                            </div>
                    }
                </div>

                <hr style={this.props.theme === "dark" ? whiteHr : {}} />

                {/* paginate */}
                <div style={{ paddingTop: "25px" }}>
                    <Paginate
                        show_full_list={this.state.showFullList}
                        full_list={this.state.fullList}
                        list={this.state.exersizesList}
                        currentPage={this.state.currentPage}
                        changePage={this.changePage}
                        itemsOnPage={this.state.itemsOnPage}
                    />
                </div>
            </div>
        );
    }
}

export default Home;