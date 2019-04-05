import React from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import {
    withStyles,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListSubheader
} from '@material-ui/core';
import {Typography, Button} from '@jahia/ds-mui-theme';
import {Add} from '@material-ui/icons';
import {compose} from 'react-apollo';
import C from '../../../App.constants';
import {lookUpMappingStringArgumentInfo} from '../../StepperComponent.utils';
import {sdlUpdateAddModifyPropertyDialog, sdlSelectProperty} from '../../StepperComponent.redux-actions';
import {connect} from 'react-redux';

const styles = theme => ({
    paper: {
        width: '100%',
        minHeight: '35vh',
        padding:  theme.spacing.unit * 2 + 'px 0',
        overflowY: 'auto'
    },
    listButton: {
        '& > * *': {
            color: theme.palette.brand.alpha
        }
    }
});

const PropertyItem = ({index, name, type, jcrName, selectProperty, showAddPropertyDialog}) => (
    <ListItem button
              onClick={() => {
                  selectProperty(index, name, jcrName, type);
                  showAddPropertyDialog();
              }}
    >
        <ListItemText primary={name}/>
    </ListItem>
);

const PropertiesList = ({classes, t, selectedType, selectProperty, addModifyPropertyDialog}) => {
    return (
        <Paper className={classes.paper}>
            <List subheader={
                <ListSubheader>
                    <Typography color="alpha" variant="zeta">
                        {t('label.sdlGeneratorTools.createTypes.propertiesText')}
                    </Typography>
                </ListSubheader>
            }
            >
                <ListItem>
                    <Button
                        icon={<Add/>}
                        variant="ghost"
                        className={classes.listButton}
                        onClick={() => {
                        addModifyPropertyDialog({open: true, channel: undefined, mode: C.DIALOG_MODE_ADD});
                    }}
                    >
                            {t('label.sdlGeneratorTools.createTypes.addNewPropertyButton')}
                    </Button>
                </ListItem>
                {
                    selectedType && selectedType.fieldDefinitions.map((field, i) => (
                        <PropertyItem key={field.name}
                                      index={i}
                                      name={field.name}
                                      type={field.type}
                                      jcrName={lookUpMappingStringArgumentInfo(field, 'property')}
                                      selectProperty={selectProperty}
                                      showAddPropertyDialog={() => addModifyPropertyDialog({
                                                                                       open: true,
                                                                                       mode: C.DIALOG_MODE_EDIT
                                                                                   })}
                    />
))

                }
            </List>
        </Paper>
    );
};

PropertiesList.propTypes = {
    selectedType: PropTypes.object,
    selectProperty: PropTypes.func.isRequired,
    addModifyPropertyDialog: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return {
        selectedType: state.nodeTypes[state.selection]
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addModifyPropertyDialog: infos => dispatch(sdlUpdateAddModifyPropertyDialog(infos)),
        selectProperty: (index, name, jcrName, type) => dispatch(sdlSelectProperty(index, name, jcrName, type))
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(styles),
    translate()
)(PropertiesList);
