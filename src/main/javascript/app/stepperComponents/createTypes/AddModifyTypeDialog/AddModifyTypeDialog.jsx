import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {compose, withApollo, graphql} from 'react-apollo';
import gqlQueries from '../../../gql/gqlQueries';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import {
    Button,
    FormControlLabel,
    FormGroup,
    MenuItem,
    Select,
    Switch,
    ListItemText,
    withStyles
} from '@material-ui/core';
import * as _ from 'lodash';

const NodeTypeSelectCom = ({classes, value, open, handleClose, handleChange, handleOpen, nodeTypeNames}) => (
    <Select
        open={open}
        value={value}
        onClose={handleClose}
        onOpen={handleOpen}
        onChange={handleChange}
    >
        <MenuItem value="">
            <em>None</em>
        </MenuItem>
        {
            !_.isNil(nodeTypeNames) ? nodeTypeNames.map((typeName, idx) => {
                return (<MenuItem key={typeName.name} value={typeName.name} classes={classes}>
                    <ListItemText primary={typeName.name} secondary={typeName.displayName}/>
                </MenuItem>);
            }) : null
        }
    </Select>
);

const NodeTypeSelect = withStyles({
    root: {
        padding: '15px 12px'
    }
})(NodeTypeSelectCom);

const AddTypeDialog = ({data, t, open, closeDialog, customTypeName, addArgToDirective, removeArgFromDirective, jcrNodeType, addType, selectedType}) => {
    const [typeName, updateTypeName] = useState(customTypeName);
    const [nodeType, updateNodeType] = useState(jcrNodeType);
    const [showNodeTypeSelector, setShowNodeTypeSelector] = useState(false);
    const mappingDirective = selectedType != null ? selectedType.directives.reduce((acc, dir) => dir.name === 'mapping' ? dir : acc, {}) : null;
    const [ignoreDefaultQueries, updateIgnoreDefaultQueries] = useState(mappingDirective != null ? mappingDirective.arguments.reduce((acc, arg) => arg.name === 'ignoreDefaultQueries' ? arg.value : acc, false) : false);
    const nodeTypeNames = !_.isNil(data.jcr) ? data.jcr.nodeTypes.nodes : null;

    function handleIgnoreDefaultQueries(e) {
        updateIgnoreDefaultQueries(e.target.checked);
        if (e.target.checked) {
            addArgToDirective(selectedType.idx, 'mapping', {value: true, name: 'ignoreDefaultQueries'});
        } else {
            removeArgFromDirective(selectedType.idx, 'mapping', mappingDirective.arguments.reduce((acc, curr, idx) => curr.name === 'ignoreDefaultQueries' ? idx : curr));
        }
    }

    function addTypeAndClose() {
        addType({typeName: typeName, nodeType: nodeType});
        //TODO call selectType in batch actions
        closeDialog();
    }

    return (
        <Dialog
            open={open}
            aria-labelledby="form-dialog-title"
            onClose={closeDialog}
        >
            <DialogTitle id="form-dialog-title">{t('label.sdlGeneratorTools.createTypes.addNewTypeButton')}</DialogTitle>
            <DialogContent style={{width: 400}}>
                <NodeTypeSelect open={showNodeTypeSelector}
                                value={nodeType}
                                nodeTypeNames={nodeTypeNames}
                                handleOpen={() => setShowNodeTypeSelector(true)}
                                handleClose={() => setShowNodeTypeSelector(false)}
                                handleChange={event => updateNodeType(event.target.value)}/>
                <TextField
                    autoFocus
                    fullWidth
                    margin="dense"
                    id="typeName"
                    label={t('label.sdlGeneratorTools.createTypes.customTypeNameText')}
                    type="text"
                    value={typeName}
                    onChange={e => updateTypeName(e.target.value)}
                />
                {/* <FormGroup row> */}
                {/* <FormControlLabel control={ */}
                {/* <Switch */}
                {/* checked={ignoreDefaultQueries} */}
                {/* onChange={handleIgnoreDefaultQueries} */}
                {/* color="primary" */}
                {/* /> */}
                {/* } */}
                {/* label="Ignore Default Queries"/> */}
                {/* </FormGroup> */}
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={closeDialog}>
                    {t('label.sdlGeneratorTools.cancelButton')}
                </Button>
                <Button color="primary"
                        onClick={addTypeAndClose}
                >
                    {t('label.sdlGeneratorTools.addButton')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddTypeDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    closeDialog: PropTypes.func.isRequired,
    addType: PropTypes.func.isRequired,
    customTypeName: PropTypes.string,
    jcrNodeType: PropTypes.string
};

AddTypeDialog.defaultProps = {
    customTypeName: '',
    jcrNodeType: ''
};

const CompositeComp = compose(
    graphql(gqlQueries.NODE_TYPE_NAMES, {
        options(props) {
            return {
                variables: {},
                fetchPolicy: 'network-only'
            };
        }
    }),
    translate()
)(AddTypeDialog);

export default withApollo(CompositeComp);
