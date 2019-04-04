import React from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import {
    withStyles,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Button
} from '@material-ui/core';
import {Typography} from '@jahia/ds-mui-theme';
import {Add} from '@material-ui/icons';
import {compose} from 'react-apollo';
import C from '../../../../App.constants';
import {lookUpMappingStringArgumentInfo} from '../../StepperComponent.utils';
import {sdlUpdateAddModifyPropertyDialog, sdlSelectProperty} from '../../StepperComponent.redux-actions';
import {connect} from 'react-redux';

const styles = theme => ({
    paper: {
        width: '100%',
        height: '100%',
        padding: '6px 0px',
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

PropertyItem.propTypes = {
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    jcrName: PropTypes.string.isRequired,
    selectProperty: PropTypes.func.isRequired,
    showAddPropertyDialog: PropTypes.func.isRequired
};

const PropertiesList = ({classes, t, selectedType, selectProperty, addModifyPropertyDialog}) => {
    return (
        <Paper className={classes.paper}>
            <List subheader={
                <ListSubheader>
                    <Typography color="alpha" variant="omega">
                        {t('label.sdlGeneratorTools.createTypes.propertiesText')}
                    </Typography>
                </ListSubheader>
            }
            >
                <ListItem>
                    <Button className={classes.listButton}
                            onClick={() => {
                                addModifyPropertyDialog({open: true, channel: undefined, mode: C.DIALOG_MODE_ADD});
                            }}
                    >
                        <Typography color="alpha" variant="zeta">
                            {t('label.sdlGeneratorTools.createTypes.addNewPropertyButton')}
                        </Typography>
                        <Add/>
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
    classes: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
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
