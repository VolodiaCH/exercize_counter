import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import AvatarEditor from 'react-avatar-editor'
import DialogTitle from '@material-ui/core/DialogTitle';

class EditAvatar extends React.Component {
    state = {
        open: this.props.show,

        props: this.props,

        scale: 0
    }

    dataURItoBlob = dataURI => {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        let byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        //Old Code
        //write the ArrayBuffer to a blob, and you're done
        //var bb = new BlobBuilder();
        //bb.append(ab);
        //return bb.getBlob(mimeString);

        //New Code
        return new Blob([ab], { type: mimeString });
    }

    handleClose = () => this.props.handleClose();

    handleSave = () => {
        this.handleClose();

        if (this.editor) {
            const canvasScaled = this.editor.getImageScaledToCanvas().toDataURL('image/jpeg', 1.0);
            const blob = this.dataURItoBlob(canvasScaled);
            this.props.handleUploadImage(blob);
        }
    }

    setEditorRef = editor => this.editor = editor;

    handleScaleChange = event => this.setState({ scale: event.target.value });

    render() {
        if (this.props !== this.state.props) this.setState({ open: this.props.url ? true : false, props: this.props });

        const { screenWidth } = this.props;
        const smallScreen = screenWidth < 350;

        return (
            <div style={{ display: this.props.show ? "" : "none" }}>
                <Dialog
                    open={this.props.show}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Edit you avatar</DialogTitle>
                    <DialogContent>
                        <div style={{ display: this.props.show ? "" : "none" }}>
                            <AvatarEditor
                                ref={this.setEditorRef}
                                image={this.props.url}
                                width={smallScreen ? screenWidth - 100 : 300}
                                height={smallScreen ? screenWidth - 100 : 300}
                                border={smallScreen ? 20 : 30}
                                color={[255, 255, 255, 0.6]} // RGBA
                                scale={1 + this.state.scale * 0.03}
                                rotate={0}
                            />
                            <div className="form-group">
                                <label htmlFor="formControlRange">Scale</label>
                                <input
                                    type="range"
                                    className="form-control-range"
                                    id="formControlRange"

                                    onChange={this.handleScaleChange}
                                    value={this.state.scale}
                                />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div >
        );
    }
}

export default EditAvatar