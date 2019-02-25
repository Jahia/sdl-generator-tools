import React, {useState} from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import {withStyles, Grid, Paper, List, ListItem, ListItemText, ListSubheader, ListItemSecondaryAction, IconButton, Button} from '@material-ui/core';
import {Add, Edit, Delete} from '@material-ui/icons';
import AddTypeDialog from './AddModifyTypeDialog';
import AddPropertyDialog from './AddModifyPropertyDialog';
import {compose} from 'react-apollo';
import {dialogMode} from './addModifyTypeDialog/AddModifyTypeDialog';
import * as _ from 'lodash';

const styles = theme => ({
    paper: {
        width: '100%',
        minHeight: '50%',
        padding: '6px 6px',
        '& button': {
            paddingTop: 0,
            paddingBottom: 0
        }
    }
});

const TypeItem = ({name, isSelected, selectType, updateTypeDialogMode, removeType, showAddTypeDialog}) => (
    <ListItem button
              selected={isSelected}
              onClick={() => selectType(name)}
    >
        <ListItemText primary={name}/>
        <ListItemSecondaryAction>
            <IconButton aria-label="Edit" onClick={()=>{
                selectType(name);
                updateTypeDialogMode(dialogMode.EDIT);
                showAddTypeDialog(true);
            }}>
                <Edit/>
            </IconButton>
            <IconButton aria-label="Remove" onClick={()=>{
                removeType(name);
            }}>
                <Delete/>
            </IconButton>
        </ListItemSecondaryAction>
    </ListItem>
);

const PropertyItem = ({name}) => (
    <ListItem button>
        <ListItemText primary={name}/>
    </ListItem>
);

const CreateTypes = ({classes, t, nodeTypes, selection, dispatch, dispatchBatch, addProperty, addArgToDirective, removeType, removeArgFromDirective, selectType}) => {
    const [addTypeDialogShown, showAddTypeDialog] = useState(false);
    const [addPropertyDialogShown, showAddPropertyDialog] = useState(false);
    const [typeDialogMode, updateTypeDialogMode] = useState(dialogMode.ADD);

    const selectedType = nodeTypes.reduce((acc, type, idx) => type.name === selection ? Object.assign({idx: idx}, type) : acc, null);

    const isDuplicatedPropertyName = propertyName => {
        let isDuplicated = false;
        if (!_.isNil(selectedType)) {
            for (let field of selectedType.fieldDefinitions) {
                if (field.name === propertyName) {
                    isDuplicated = true;
                    break;
                }
            }
        }
        return isDuplicated;
    };

    const isDuplicatedTypeName = typeName => {
        let isDuplicated = false;
        for (let type of nodeTypes) {
            if (type.name === typeName) {
                isDuplicated = true;
                break;
            }
        }
        return isDuplicated;
    };

    return (
        <React.Fragment>
            <Grid container spacing={24}>
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper}>
                        <List subheader={<ListSubheader>{t('label.sdlGeneratorTools.createTypes.nodeTypeText')}</ListSubheader>}>
                            <Button onClick={() => {
                                updateTypeDialogMode(dialogMode.ADD);
                                showAddTypeDialog(true);
                            }}>
                                {t('label.sdlGeneratorTools.createTypes.addNewTypeButton')}
                                <Add/>
                            </Button>
                            {
                                nodeTypes.map(type => (
                                    <TypeItem key={type.name}
                                              {...type}
                                              isSelected={type.name === selection}
                                              selectType={selectType}
                                              updateTypeDialogMode={updateTypeDialogMode}
                                              showAddTypeDialog={showAddTypeDialog}
                                              removeType={removeType}
                                    />
                                ))
                            }
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper}>
                        <List subheader={<ListSubheader>{t('label.sdlGeneratorTools.createTypes.propertiesText')}</ListSubheader>}>
                            <Button onClick={() => showAddPropertyDialog(true)}>
                                {t('label.sdlGeneratorTools.createTypes.addNewPropertyButton')}
                                <Add/>
                            </Button>
                            {
                                nodeTypes.filter(type => type.name === selection).map(type => type.fieldDefinitions.map((field, i) => {
                                        return (
                                            <PropertyItem key={`${field.name}_${i}`} {...field}/>
                                        );
                                    }
                                ))
                            }
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            <AddTypeDialog open={addTypeDialogShown}
                           mode={typeDialogMode}
                           dispatch={dispatch}
                           dispatchBatch={dispatchBatch}
                           closeDialog={() => showAddTypeDialog(false)}
                           selectedType={selectedType}
                           isDuplicatedTypeName={isDuplicatedTypeName}/>
            <AddPropertyDialog open={addPropertyDialogShown}
                               typeName={selection}
                               selectedType={selectedType}
                               closeDialog={() => showAddPropertyDialog(false)}
                               addProperty={addProperty}
                               isDuplicatedPropertyName={isDuplicatedPropertyName}/>
        </React.Fragment>
    );
};

CreateTypes.propTypes = {
    nodeTypes: PropTypes.array.isRequired,
    selectType: PropTypes.func.isRequired,
    removeType: PropTypes.func.isRequired,
    addProperty: PropTypes.func.isRequired,
    removeProperty: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    dispatchBatch: PropTypes.func.isRequired,
    selection: PropTypes.string
};

export default compose(
    withStyles(styles),
    translate()
)(CreateTypes);
