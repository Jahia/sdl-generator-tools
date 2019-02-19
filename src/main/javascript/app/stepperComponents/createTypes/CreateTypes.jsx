import React, {useState} from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import {withStyles, Grid, Paper, List, ListItem, ListItemText, ListSubheader, Button} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import AddTypeDialog from './addModifyTypeDialog';
import AddPropertyDialog from './addModifyPropertyDialog';
import {compose} from 'react-apollo';

const styles = theme => ({
    paper: {
        width: 360,
        height: 400
    }
});

const TypeItem = ({name, isSelected, selectType}) => (
    <ListItem button
              selected={isSelected}
              onClick={() => selectType(name)}
    >
        <ListItemText primary={name}/>
    </ListItem>
);

const PropertyItem = ({name}) => (
    <ListItem button>
        <ListItemText primary={name}/>
    </ListItem>
);

const CreateTypes = ({classes,t, nodeTypes, selection, addType, addProperty, selectType}) => {
    const [addTypeDialogShown, showAddTypeDialog] = useState(false);
    const [addPropertyDialogShown, showAddPropertyDialog] = useState(false);

    return (
        <React.Fragment>
            <Grid container>
                <Grid item>
                    <Paper className={classes.paper}>
                        <List subheader={<ListSubheader>{t('label.sdlGeneratorTools.createTypes.nodeTypeText')}</ListSubheader>}>
                            <Button onClick={() => showAddTypeDialog(true)}>
                                {t('label.sdlGeneratorTools.createTypes.addNewTypeButton')}
                                <Add/>
                            </Button>
                            {
                                nodeTypes.map(type => (
                                    <TypeItem key={type.name}
                                              {...type}
                                              isSelected={type.name === selection}
                                              selectType={selectType}/>
))
                            }
                        </List>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>
                        <List subheader={<ListSubheader>{t('label.sdlGeneratorTools.createTypes.propertiesText')}</ListSubheader>}>
                            <Button onClick={() => showAddPropertyDialog(true)}>
                                {t('label.sdlGeneratorTools.createTypes.addNewPropertyButton')}
                                <Add/>
                            </Button>
                            {
                                nodeTypes.reduce((acc, type) => {
                                    if (type.name === selection) {
                                        acc = type.fieldDefinitions.map(field => (
                                            <PropertyItem {...field}/>
                                        ));
                                        return acc;
                                    }
                                }, [])
                            }
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            <AddTypeDialog open={addTypeDialogShown}
                           closeDialog={() => showAddTypeDialog(false)}
                           addType={addType}/>
            <AddPropertyDialog open={addPropertyDialogShown}
                               typeName={selection}
                               closeDialog={() => showAddPropertyDialog(false)}
                               addProperty={addProperty}/>
        </React.Fragment>
    );
};

CreateTypes.propTypes = {
    nodeTypes: PropTypes.array.isRequired,
    selectType: PropTypes.func.isRequired,
    addType: PropTypes.func.isRequired,
    removeType: PropTypes.func.isRequired,
    addProperty: PropTypes.func.isRequired,
    removeProperty: PropTypes.func.isRequired,
    selection: PropTypes.string
};

export default compose(
    withStyles(styles),
    translate()
)(CreateTypes);
