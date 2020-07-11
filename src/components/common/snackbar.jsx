import React, { Component } from 'react';
import classNames from 'classnames';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.8
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

const MySnackbarContent = props => {
    const { classes, className, message, onClose, variant, ...other } = props;

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" style={{ fontSize: "20px" }} className={classes.message}>
                    {
                        variant === "success"
                            ? <i className="far fa-check-circle"></i>
                            : variant === "error"
                                ? <i className="fas fa-exclamation-circle"></i>
                                : <div className="spinner-border" role="status"></div>
                    }
                    &nbsp;
                    {message}
                </span>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={onClose}
                >
                    <i className="fas fa-times"></i>
                </IconButton>
            ]}
            {...other}
        />
    );
}

const MySnackbarContentWrapper = withStyles(styles)(MySnackbarContent);

class SnackBar extends Component {
    state = {
        open: this.props.status !== "hide",

        props: this.props
    }

    handleClose = () => this.setState({ open: false });

    render() {
        const { message, status } = this.props;

        if (this.props !== this.state.props) this.setState({ props: this.props, open: this.props.status !== "hide" });

        return (
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                >
                    <MySnackbarContentWrapper
                        onClose={this.handleClose}
                        variant={
                            status === "success"
                                ? status
                                : status === "fail"
                                    ? "error"
                                    : "info"
                        }
                        message={message}
                    />
                </Snackbar>
            </div>
        );
    }
}

export default SnackBar;